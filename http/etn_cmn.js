/*
 * eternary.common
 * 共通で使用される定数・オブジェクト定義
 */

// console.log()の環境依存対応
if (typeof window == "undefined") {  // 非ブラウザ対策(Rhino等)
  window = {};
  console = { log : function(msg){} } ;
}
if (!window.console) {  // IE対策
  window.console = { log : function(msg){} };
}

// GETパラメータを配列にして返すメソッド
// http://qiita.com/Evolutor_web/items/c9b940f752883676b35d
// "="無しで指定されたパラメータも配列格納するように修正(値はnull)
var getUrlVars = function(){
    var vars = {};
    var param = (typeof location !== "undefined") ? location.search.substring(1).split('&') : [];
    for(var i = 0; i < param.length; i++) {
        var equalSearch = param[i].search(/=/);
        var key = equalSearch != -1 ? param[i].slice(0, equalSearch) : param[i];
        var val = equalSearch != -1 ? param[i].slice(param[i].indexOf('=', 0) + 1) : null;
        vars[key] = decodeURI(val);
    }
    return vars;
};
// URLパラメータ取得
var httpGetParas = getUrlVars();

/**
  * 勢力（色・手番）を表す定数群
  * (A・Bと、そのどちらにも属さないOの三値論理)
  */
var SIDE = {
  /** どちらの勢力にも属さない */
  O : 0,
  /** ある勢力 */
  A : 1,
  /** 他方の勢力 */
  B : 2
}

/**
  * 勝利ランク
  */
var WIN_RANK = {
  NOT_WIN   :  0,  // 敗北 or 引き分け
  GOOD      :  1,  // 勝利(通常)
  EXCELLENT :  2,  // 勝利(大勝)
  PERFECT   :  3   // 勝利(完全勝利)
}

/** 投了時のスコア値 */
var GIVEUP_SCORE = 999.0;

/** GameMasterのインスタンスを格納するグローバルシンボル */
var gm;

// テスト用：連続自動対局モード(通常は無効(false))
var BOT_AUTO_TEST = false;
if (BOT_AUTO_TEST) {
  // ネームスペースの定義
  var botAutoTest = {};
  // ウォッチドッグタイマ 15分 (たまに対局停止する対策)
  setTimeout(function(){ location.reload(); }, 15 * 60 * 1000);
}

/**
  * ゲーム（コンタクト）を管理する
  */
function GameMaster(col, row) {
  var self = this;
  /* ゲーム進行状態(制御系) */
  this.STATE_CONTACT       = 0;  // コンタクト中を表す定数
  this.STATE_WAIT_JUDGE    = 1;  // ジャッジメント判定中(サーバからのestimate結果待ち)を表す定数
  this.STATE_CONFIRM_JUDGE = 2;  // ジャッジメント確認中(同意するかどうかの入力待ち)を表す定数
  this.STATE_GAME_OVER     = 3;  // コンタクト終了(結果表示)を表す定数
  this.state = this.STATE_CONTACT;  // ゲーム状態
  this.judgeResult = null;   // ジャッジメント結果保存
  this.setState = function(st) {  // stateのセッタ(viewに状態更新を伝えるため、状態変更は必ずこれを使う)
    this.state = st;
    this.ui.onStateChange();
  };

  /** ゲーム状態(コンタクト状況) */
  this.gameState = new GameState(col, row);
  /** 行動履歴 */
  this.actionHistory = new Array();
  /** undo回数 */
  this.undoCount = 0;
  /** UIインターフェース */
  this.ui = null;
  /** DBインターフェース */
  this.db = new DbIf();
  /** セッションインターフェース */
  this.ses = new SessionIf();
  /** 特典管理インターフェース */
  this.gds = new GoodiesIf();
  /** ユーザー */
  this.userNo = 0;      // ses.getUser()のコールバックで上書きされる
  /** ユーザーの手番 */
  this.userSide = SIDE.A;   // TODO: 人が黒番(SIDE.A)であることを前提としたコードが大量にあるので、白番対応する際はこの変数を使って書き換えまくる必要がある
  /** プレイヤー */
  this.player = new Array();
  this.playerName = new Array();
  this.cpuLevel = 0;
  /** モード */
  this.gameMode = 0;
  /** キッズモード */
  this.isKidsMode = true;
  /** ローカル設定 */
  this.lset = null;    // 設定データ
  this.lsetUtl = new localSettingsUtil();  // ユーティリティ関数群

  /** ポイント(GameMasterに持つべきか?) */
  this.totalPoint = 0;
  this.ownPoint = 0;
  /** データ登録完了フラグ */
  this.dataRegistDone = false;

  // // テスト用：プレイヤーBの候補
  // this.playerB_candidate = [new PrimitivePlayer(), new ChimeraPlayer(), new RandomPlayer(), new HumanPlayer(),
  //                           new GnugoPlayer("1.2"), new GnugoPlayer("1.6"), new GnugoPlayer("2.0"), new GnugoPlayer("2.6"), new GnugoPlayer("3.0"), new GnugoPlayer("3.8")];
  // this.playerB_name = ["Primo", "Chimera", "Random", "Human",
  //                      "GnuGo1.2", "Liberty", "GnuGo2.0", "GnuGo2.6", "GnuGo3.0", "GnuGo3.8"];
  // this.playerB_index = 0;


  // 初期化関数
  this.init = function(onloadfunc) {
    this.onloadfunc = onloadfunc;

    // Playerインスタンスの設定
    this.player[SIDE.A] = new HumanPlayer();
    this.playerName[SIDE.A] = "unknown";       // ses.getUser()のコールバックで上書きされる
    this.player[SIDE.B] = new PrimitivePlayer();   // db.getLevelInfo()のコールバックで上書きされる
    this.playerName[SIDE.B] = "unloaded(primo)";   // db.getLevelInfo()のコールバックで上書きされる
    // URLパラメータからモードを取得する
    this.gameMode = "md" in httpGetParas ? parseInt(httpGetParas.md) : 0;
    // URLパラメータからキッズモードかどうかを取得する
    this.isKidsMode = "kids" in httpGetParas;
    // ローカル設定取得(localStorageにあれば復帰)
    this.lset = this.lsetUtl.get();
    // URLで指定されたレベルの相手、モードの画像を取得する
    this.db.getLevelInfo(this.gameMode,
                         "ls" in httpGetParas ? httpGetParas.ls : "");
    // セッション情報からuserNo, userNameを取得する
    this.ses.getUser();
    // TODO: startPlaying()までにコールバック終了してるかどうか保証が無い
  };

  /** 行動の結果を処理する */
  this.processAction = function(action) {
    // 行動結果
    var actionResult = null;

    switch(action.actionKind) {
    case Action.PLAY:
      var posLog = new PosLog(action.col, action.row);
      // 合法なアクティビティかどうかの判定を行なう
      // 判定は共用関数使ってる都合でしっかりライフライン数まで数えちゃうので、
      // 処理速度で支障が出るならば、ライフラインが1つでもあれば探索を打ち切るロジックに変更する
      if (Rules.isLegal(this.gameState, this.gameState.nextSide, posLog)) {
        this.gameState.setPlay(action);
        this.actionHistory.push(action);
        this.gameState.worldState[action.col][action.row] = action.side;
        var vanishList = Rules.vanish(this.gameState, posLog);  // 捕獲処理

        // エターナリー判定(仮)
        // TODO: Rulesのfunctionとする。（ただし現在の、捕獲判定後の結果を使えるのがとてもが都合が良い）
        if (vanishList.length == 1 &&
            Rules.accurateVanish(this.gameState, Rules.getOppositeSide(this.gameState.nextSide), vanishList[0]) == 1) {
          this.gameState.eternallyPos = vanishList[0];
        }
        else {
          this.gameState.eternallyPos = null;
        }

        actionResult = new ActionResult(posLog, vanishList, this.gameState.eternallyPos != null);
        this.gameState.endTurn();
      }
      else {
        // 合法アクティビティでない場合、
        if (this.player[this.gameState.nextSide].isBot == false) {
          // ボットでなければ、再度アクティビティ生成させる
          this.player[this.gameState.nextSide].genmove(this.gameState);
        }
        else {
          // ボットの場合、(バグで、多分同じ非合法手を生成し続けて無限ループになるので、)
          // ログメッセージを表示する。（その後は関知しない。）※強制パスにするのもアリだが、コードめんどくさい。
          console.log("not legal move was generated!: col = " + posLog.col + ", row = " + posLog.row + "\n");
          alert("not legal move was generated!: col = " + posLog.col + ", row = " + posLog.row + "\n");

        }
      }
      break;

    case Action.PASS:
      var beforeAction = this.gameState.playHistory[this.gameState.playHistory.length - 1];
      this.gameState.setPlay(action);
      this.actionHistory.push(action);

      // パス時にエターナリー座標をクリアする
      this.gameState.eternallyPos = null;

      if (beforeAction != null && beforeAction.actionKind == Action.PASS) {
        // ジャッジメント待ち状態に遷移
        this.setState(this.STATE_WAIT_JUDGE);
        // 結果判定
        estimate();

        // TODO: 終了処理に移行する(今はとりあえずendTurnもさせてる)
        this.gameState.endTurn();
      }
      else {
        this.gameState.endTurn();
      }
      actionResult = new ActionResult();
      break;

    case Action.ESTIMATE:
      // 処理不要
      break;

    case Action.GIVEUP:
      // 投了はアクションとして扱わない
      // this.gameState.setPlay(action);
      // this.actionHistory.push(action);

      // 投了の結果をセットする
      this.judgeResult = {};
      this.judgeResult.winner = Rules.getOppositeSide(action.side);   // 投了してない方を勝者とする
      this.judgeResult.score = GIVEUP_SCORE;
      this.judgeResult.sideScore = [];
      var levelRate = 1.0 + gm.cpuLevel * 0.1;  // レベル係数
      var FIXED_POINT = 50;                     // 固定獲得ポイント
      var giveUpPoint = Math.ceil(gm.gameState.playCount / 2);  // 投了特別pt = 自分が打った手数 (すぐ投了したらポイントは少ない)
      giveUpPoint = Math.min(giveUpPoint, Math.floor(gm.gameState.worldSizeCol * gm.gameState.worldSizeRow / 4 / 10) * 10);   // ただし盤面の1/4は超えないように
         
      if (this.judgeResult.winner == this.userSide) {
        // ユーザーが勝った場合(CPU投了)
        // TODO:CPU投了時の勝利ランク、獲得ポイントは、CPU投了実装時に検討する
        this.judgeResult.winRank = WIN_RANK.EXCELLENT;  
        this.judgeResult.sideScore[this.userSide] = 50;
        this.judgeResult.earnedPoint = 100;
      }
      else {
        // ユーザーが負けた場合(ユーザー投了)
        this.judgeResult.winRank = WIN_RANK.NOT_WIN;
        this.judgeResult.sideScore[this.userSide] = giveUpPoint;
        this.judgeResult.earnedPoint = Math.ceil(levelRate * (giveUpPoint + FIXED_POINT));  // 投了時は対局状況に関わらず投了特別ptを加算したptを付与する
      }
      
      // 終了処理に移行する
      // ※丁度都合が良いので、FIN_OK時の動作にfallthroughしちゃう
      // this.setState(gm.STATE_GAME_OVER);
      // break;

    case Action.FIN_OK:
      // 確定結果をlocalStorageに格納する
      // (Endボタン押下時(ページ遷移直前)に格納すると、遷移先で参照するときに格納が間に合ってないことがある(Xperia Proで))
      localStorage.setItem("recentResultDate", new Date());
      localStorage.setItem("recentResult", JSON.stringify(gm.judgeResult));
      localStorage.setItem("recentGameState", JSON.stringify(gm.gameState));
      localStorage.setItem("recentSgf", JSON.stringify(gm.gameState.getPlaySGF()));

      // データ登録IFを通してゲーム結果を登録する
      gm.db.registDb(gm.gameState, gm.judgeResult);

      gm.setState(gm.STATE_GAME_OVER);

      // テスト用：Bot自動対局テスト(連続)
      if (BOT_AUTO_TEST) {
        // 未実施対局(=今回の対局)を探す
        for (var i = 0; i < botAutoTest.matchSetting.length; i++) {
          if (botAutoTest.matchSetting[i].doneGameCount < botAutoTest.gameCount * 2) {
            botAutoTest.matchSetting[i].result.push((gm.judgeResult.winner == botAutoTest.targetSide ? 1 : -1) * gm.judgeResult.score);
            botAutoTest.matchSetting[i].doneGameCount++;
            break;
          }
        }
        // localStorageの値を上書きして、リロードする
        localStorage.setItem("BotAutomationTest_matchSetting", JSON.stringify(botAutoTest.matchSetting));
        location.reload();
      }

      break;

    case Action.FIN_NG:
      // 相手のパスでのコンタクト終了を取消(nextSide == SIDE.A)→自分のパスと相手のパスを履歴から取り除いて、コンタクト再開
      // 自分のパスでのコンタクト終了を取消(nextSide == SIDE.B)→自分のパスを履歴から取り除いて、コンタクト再開
      gm.undo(gm.gameState.nextSide == SIDE.A ? 2 : 1);
      gm.setState(gm.STATE_CONTACT);
      gm.player[gm.gameState.nextSide].genmove(gm.gameState);
    }

    return actionResult;
  };


  /** ゲーム開始（Player同志の交互アクションを開始する） */
  this.startPlaying = function() {
    // Playerに初めのアクティビティを生成させる
    this.player[this.gameState.nextSide].genmove(this.gameState);
  };

  /** ゲームに関するイベントのコールバック処理 */
  this.processPlayEvent = function(action) {
      var waitTime = 0;
      // CPUプレイヤーの考慮の場合、考慮終了までの時間が指定されている場合、ウエイト時間を設定する
      if (gm.lset.thinkTimeMean > 0 && action.side == SIDE.B
          && (action.actionKind == Action.PLAY || action.actionKind == Action.PASS || action.actionKind == Action.GIVEUP)) {
        // アピア時間(目標値)
        var thinkTime = gm.lset.thinkTimeMean + gm.lset.thinkTimeDiff * (Math.random() * 2 - 1);  // Mean ± Diff
        // これまで既に掛かった時間
        var spentTime = Date.now() - action.timestamp;
        // ウエイト時間
        waitTime = Math.max(thinkTime - spentTime, 0);  // 待ち時間がマイナスになる場合は待ち時間0にする
      }

      // 待ち時間が必要な場合は待つ
      setTimeout(function(){
        // アクティビティ生成結果を解析・処理する
        var actionResult = gm.processAction(action);

        // 画面側に、ワールド表示を更新させる指示を出す
        gm.ui.updateGameState(actionResult);

        // 次のPlayerに次の着手を生成させる
        if (self.state == self.STATE_CONTACT) {
          gm.player[gm.gameState.nextSide].genmove(gm.gameState);
        }
      }, waitTime);
  };

  /** アンドゥ */
  this.undo = function(backCount) {

    // 戻す手数が引数で指定されない場合、1手戻す
    backCount = backCount || 1;

    // ①undo前履歴の保持
    var orgPlayHistory = gm.gameState.playHistory;
    var orgPlayCount = gm.gameState.playCount;

    // ②ゲーム状態変数のクリア
    gm.gameState.clearState();

    // ③一手ずつ再生（undo前の1手前まで）
    var actionResult = null;
    for (var i = 0; i < orgPlayCount - backCount; i++) {
      actionResult = gm.processAction(orgPlayHistory[i]);
    }

    // ④画面情報描画更新
    gm.ui.updateGameState(actionResult);

    // ⑤次のPlayerに次の着手を生成させる
    if (this.state == this.STATE_CONTACT) {
      gm.player[gm.gameState.nextSide].genmove(gm.gameState);
    }
  };

  /** ユーザーインターフェースをセットする */
  this.setUserInterface = function(ui) {
    this.ui = ui;
  };

  /** 行動履歴SGFを取得する */
  // TODO: 現在は単にGameState.getPlaySGF()の結果を返すのみ
  this.getActionSGF = function() {
    return this.gameState.getPlayShortSGF();
  };
}


/**
  * ゲーム状態
  */
function GameState(col, row) {
  /** ワールド横サイズ */
  this.worldSizeCol = col;
  /** ワールド縦サイズ */
  this.worldSizeRow = row;

  /** ワールド状態配列 */
  this.worldState;
  /** 累計バニッシュ数配列 */
  this.vanishCount;
  /** アクティビティ履歴 */
  this.playHistory;
  /** アクティビティ数 */
  this.playCount;
  /** アピア数配列 */
  this.appearCount;
  /** 次のサイド */
  this.nextSide;
  /** エターナリー座標（エターナリー状態判定フラグと兼用(nullなら未発生)) */
  this.eternallyPos;

  /**
    * ゲーム状態の初期化（ワールドサイズ以外。new時とundo時に使用。）
    */
  this.clearState = function() {
    this.worldState = new Array(this.worldSizeCol);
    for (var c = 0; c < this.worldSizeCol; c++) {
      this.worldState[c] = new Array(this.worldSizeRow);
      for (var r = 0; r < this.worldSizeRow; r++) {
        this.worldState[c][r] = SIDE.O;
      }
    }
    this.vanishCount = [null, 0, 0];
    this.playHistory = new Array();
    this.playCount = 0;
    this.appearCount = [null, 0, 0];
    this.nextSide = SIDE.A;
    this.eternallyPos = null;
  };
  // new時の初期化呼出
  this.clearState();

  /**
    * アクティビティを記録する
    */
  this.setPlay = function (action) {
    // プレイ履歴の末尾に追加し、プレイ数を増やす
    this.playHistory.push(action);
    this.playCount++;
    // 着手数は、アピアのときのみ増やす(パスでは増やさない)
    if (action.actionKind == Action.PLAY) {
      this.appearCount[this.nextSide]++;
    }

  };

  /**
    * アクティビティ履歴SGFを取得する(SGF形式:文字列が長くなる)
    */
  this.getPlaySGF = function () {
    var sgf = "(;GM[1]FF[4]SZ[" + this.worldSizeCol + "]"; // @TODO:サイズが長方形の場合に未対応
    sgf = sgf + "KM[" + Rules.AHEAD_WEIGHT + "]RU[Chinese]AP[eternary];";

    for (var i = 0; i < this.playHistory.length; i++) {
      sgf += (this.playHistory[i].side == SIDE.A ? "B" : "W") + "[";
      // アピアの場合は座標を出力する。（パスの場合は座標を出力しない("B[]"などとなる)
      if (this.playHistory[i].actionKind == Action.PLAY) {
        sgf += String.fromCharCode("a".charCodeAt(0) + this.playHistory[i].col) +
               String.fromCharCode("a".charCodeAt(0) + this.playHistory[i].row);
      }
      sgf += "];";
    }

    sgf += ")";

    return sgf;
  };

  /**
    * アクティビティ履歴を取得する(短縮SGF形式:http GETで送るのにIEのURL2083文字制限に対応するため)
    *   正規SGF: (;GM[1]FF[4]SZ[19]KM[7.5]RU[Chinese]AP[eternary];B[jd];W[hc];B[];W[ek];B[];)  400手 → 50 + 6 * 400 = 2450文字
    *   短縮SGF:                19,   7.5,                          jd    hc   __   ek   __    400手 →  7 + 2 * 400 =  807文字
    */
  this.getPlayShortSGF = function () {
    var ssgf = this.worldSizeCol + ","; // @TODO:サイズが長方形の場合に未対応
    ssgf += Rules.AHEAD_WEIGHT + ",";

    for (var i = 0; i < this.playHistory.length; i++) {
      // アピアの場合は座標を出力する。（パスの場合は"__"を出力)
      if (this.playHistory[i].actionKind == Action.PLAY) {
        ssgf += String.fromCharCode("a".charCodeAt(0) + this.playHistory[i].col) +
                String.fromCharCode("a".charCodeAt(0) + this.playHistory[i].row);
      }
      else {
        ssgf += "__";
      }
    }

    return ssgf;
  };

  /**
    * ターンを切り替える
    */
  this.endTurn = function () {
    this.nextSide = (this.nextSide == SIDE.A) ? SIDE.B : SIDE.A;
  };

}



/**
  * 行動
  */
function Action(side, actionKind, col, row) {
  /** 発生タイムスタンプ(Unixtime[ms]) */
  this.timestamp = Date.now();

  /** 勢力 */
  this.side = side;
  /** 行動種別 */
  this.actionKind = actionKind;

  // 以下は引数（行動種別によって必要なものが変わる）
  /** 横座標 */
  this.col = col;
  /** 縦座標 */
  this.row = row;
  /** 文字列 */
  this.str;

}
// 以下はActionクラスの定数定義
// クラス変数はJavaScriptではこう書けばよい？諸説あるので分からん
// Action()内で下記定義すると、初手処理時にAction.PLAY が undefinedになることがあった。
// (1回でもコンストラクタ呼ばないとAction.PLAYに代入されないから？)
Action.PLAY     =  1;
Action.PASS     =  2;
Action.GIVEUP   =  3;
Action.COMMENT  =  4;
Action.ESTIMATE =  5;
Action.FIN_OK   =  6;
Action.FIN_NG   =  7;


/**
  * データ登録用I/F
  * ※本来はPOSTを使いたいが、JSONPではPOST使えないため不可。
  *   (負荷分散等必要ないが、ローカルデバッグのためクロスドメインにする必要があるのでJSONPを使ってる)
  */
function DbIf() {
  // サーバーリクエストキュー
  this.requestQueue = new Array();

  // サーバーURL
  this.SERVER_URL = ETN_DB_IF_URL;

  // ユーザー仮登録→ゲーム情報登録→Goodies判定登録間の引数受け渡し用仮変数（無理矢理...）
  this.tmpGameState = null;
  this.tmpResult = null;

  // レベル情報の取得要求
  this.getLevelInfo = function(mode, levelStr) {
    // リクエストクエリ
    var request = this.SERVER_URL;
    request += "?cmd=lr";    // コマンド(レベル情報取得)
    request += "&md=" + mode;    // モード
    request += "&ls=" + levelStr;    // レベル文字列

    // scriptタグを使った、JSONP取得(クロスドメイン対応)
    // http://tadtak.jugem.jp/?eid=58
    var element = document.createElement("script");
    element.src = request;
    document.body.appendChild(element);
  };

  // レベル情報の取得結果の処理
  this.getLevelInfoCallback = function(levelInfo) {
    gm.player[SIDE.B] = eval("new " + levelInfo.playerConstructor);
//    gm.player[SIDE.B] = new HumanPlayer();    // ■デバッグ用
    gm.playerName[SIDE.B] = levelInfo.characterName;
    gm.cpuLevel = levelInfo.level;
    gm.ui.setWorldImage(levelInfo.worldImage, levelInfo.worldCoverImage);
    gm.ui.setCpuAbatarImage(levelInfo.avatarImage);
    gm.ui.setBgm(levelInfo.bgm);

    // テスト用：Bot自動対局テスト(単体)
    // gm.player[SIDE.A] = new GnugoPlayer("3.8", "5");
    // gm.player[SIDE.B] = new GnugoPlayer("3.8", "10");

    // テスト用：Bot自動対局テスト(連続)
    if (BOT_AUTO_TEST) {
      botAutoTest.gameCount = parseInt(localStorage.getItem("BotAutomationTest_gameCount"));
      botAutoTest.matchSetting = JSON.parse(localStorage.getItem("BotAutomationTest_matchSetting"));

      // 未実施対局を探す（無ければ通常対局になる）
      for (var i = 0; i < botAutoTest.matchSetting.length; i++) {
        var match = botAutoTest.matchSetting[i];
        var doneGameCount = match.doneGameCount;
        if (doneGameCount < botAutoTest.gameCount * 2) {
          // 自分の手番
          botAutoTest.targetSide = doneGameCount < botAutoTest.gameCount ? SIDE.A : SIDE.B;
          gm.player[SIDE.A] = eval("new " + (botAutoTest.targetSide == SIDE.A ? match.target : match.opponent));
          gm.player[SIDE.B] = eval("new " + (botAutoTest.targetSide == SIDE.B ? match.target : match.opponent));
          break;
        }
      }
    }
  };

  // DBに情報登録する
  this.registDb = function(gameState, result) {
    // 引数保持
    this.gameState = gameState;
    this.result = result;

    // ユーザー未登録の場合、仮ユーザーを発行した後にゲーム結果登録する
    if (gm.userNo == 0) {
      this.createTmpUser(gameState, result);
    }
    // ユーザー登録済みなら、ゲーム結果登録のみ
    else {
      this.registGameResult(gameState, result);
    }
  };

  // ユーザー仮登録要求
  this.createTmpUser = function(gameState, result) {
    // リクエストクエリ
    var request = this.SERVER_URL;
    request += "?cmd=uc";    // コマンド(仮ユーザー作成)

    // scriptタグを使った、JSONP取得(クロスドメイン対応)
    // http://tadtak.jugem.jp/?eid=58
    var element = document.createElement("script");
    element.charset = "UTF-8";  // [仮]が文字化けするので追加
    element.src = request;
    document.body.appendChild(element);
  };

  // ユーザー仮登録結果の処理
  this.createTmpUserCallback = function(json) {
    if (json.result != 1) {
      // 登録失敗
      console.log("DbIf failed!\n" + json.reason);
    }
    else {
      // 登録した仮ユーザー情報を格納
      gm.userNo = json.userNo;
      gm.playerName[SIDE.A] = json.userName;

      // ログイントークンをcookieに登録
      document.cookie = "loginToken=" + json.lt + "; max-age=" + 60*60*24*365*3 + "; path=/;";
      // ユーザー情報をセッション変数に登録
      gm.ses.setUser(json.userNo, json.userName);
      // 新規ユーザー仮登録した旨を伝えるフラグ(sessionStorage)
      sessionStorage.setItem("newUserRegist", JSON.stringify(true));


      // ゲーム結果をDBに登録
      gm.db.registGameResult(gm.db.gameState, gm.db.result);

    }
  };



  // ゲーム結果の登録要求
  this.registGameResult = function(gameState, result) {
    // リクエストクエリ
    var request = this.SERVER_URL;
    request += "?cmd=gr";    // コマンド(ゲーム結果登録)
    request += "&userNo=" + gm.userNo;    // ユーザー番号
    request += "&level=" + gm.cpuLevel;    // レベル
    request += "&size=" + gameState.worldSizeCol;    // サイズ  TODO: 長方形ワールドに非対応
    request += "&handi=0";    // ハンディ(現在固定)
    request += "&score=" + (((result.winner == SIDE.A) ? +1.0 : -1.0) * result.score);    // スコア
    request += "&appears=" + gameState.appearCount[SIDE.A];    // 着手数
    request += "&sgf=" + gameState.getPlayShortSGF();    // SGF
    request += "&undo=" + gm.undoCount;    // アンドゥ回数
    request += "&point=" + result.earnedPoint;    // 獲得ポイント

    // scriptタグを使った、JSONP取得(クロスドメイン対応)
    // http://tadtak.jugem.jp/?eid=58
    var element = document.createElement("script");
    element.src = request;
    document.body.appendChild(element);
  };

  // ゲーム結果の登録結果の処理
  this.registGameResultCallback = function(json) {
    if (json.result != 1) {
      // 登録失敗
      console.log("DbIf failed!\n" + json.reason);
    }

    // 今回獲得特典の判定・登録を呼び出す
    gm.gds.getGoodiesAfterGame(gm.db.gameState, gm.db.result);
  };

  // ユーザー情報の取得要求
  this.getUserInfo = function(userNo) {
    // リクエストクエリ
    var request = this.SERVER_URL;
    request += "?cmd=ur";    // コマンド(ユーザー情報取得)
    request += "&userNo=" + userNo;    // ユーザー番号

    // scriptタグを使った、JSONP取得(クロスドメイン対応)
    // http://tadtak.jugem.jp/?eid=58
    var element = document.createElement("script");
    element.src = request;
    document.body.appendChild(element);
  };

  // ユーザー情報の取得結果の処理
  this.getUserInfoCallback = function(userInfo) {
    gm.totalPoint = userInfo.totalPoint;
    gm.ownPoint = userInfo.ownPoint;
  };

}

/**
  * セッションデータ取得用I/F
  */
function SessionIf() {
  // サーバーリクエストキュー
  this.requestQueue = new Array();

  // サーバーURL
  this.SERVER_URL = ETN_SESSION_IF_URL;

  // ユーザー情報の取得要求
  this.getUser = function() {
    // リクエストクエリ
    var request = this.SERVER_URL + "?cmd=get";

    // scriptタグを使った、JSONP取得(クロスドメイン対応)
    // http://tadtak.jugem.jp/?eid=58
    var element = document.createElement("script");
    element.src = request;
    document.body.appendChild(element);
  };

  // ユーザー情報の取得結果の処理
  this.getUserCallback = function(user) {
    gm.userNo = user.userNo;
    gm.playerName[SIDE.A] = user.userName;

    gm.onloadfunc();  // ユーザー情報取得完了を伝える

    // DBからユーザー情報を取得する(使用するのは現在はポイントだけ)
    if (gm.userNo != 0) {
      gm.db.getUserInfo(gm.userNo);
    }
  };

  // ユーザー情報の登録要求
  this.setUser = function(userNo, userName) {
    // リクエストクエリ
    var request = this.SERVER_URL + "?cmd=set&userNo=" + userNo + "&userName=" + userName;

    // scriptタグを使った、JSONP取得(クロスドメイン対応)
    // http://tadtak.jugem.jp/?eid=58
    var element = document.createElement("script");
    element.src = request;
    document.body.appendChild(element);
  };

  // ユーザー情報の登録結果の処理
  this.setUserCallback = function(json) {
    if (json.result != 1) {
      // 登録失敗
      console.log("SessionIf failed!\n" + json.reason);
    }
  };

}

/**
  * 特典管理用I/F
  */
function GoodiesIf() {
  // サーバーリクエストキュー
  this.requestQueue = new Array();

  // サーバーURL
  this.SERVER_URL = ETN_SERVER_URL + "goodiesManager.php";

  // 対局後の特典獲得判定・登録要求
  this.getGoodiesAfterGame = function(gameState, result) {

    this.getGoodiesAfterGameCallback({getGoodies:[]});
  };

  // 対局後の特典獲得判定・登録結果の処理
  this.getGoodiesAfterGameCallback = function(json) {
    gm.judgeResult.getGoodies = json.getGoodies;
    sessionStorage.setItem("getGoodies", JSON.stringify(json.getGoodies));

    // 一連の対局データ登録完了をセットする
    gm.dataRegistDone = true;
  };

}



/** サーバーリクエストキュー */
// TODO: これとServerIf()とgetJsonData()などを一まとめのクラスにする
var requestQueue = new Array();

/**
  * サーバ側ロジックとのI/F
  * WinXPサポート外となった今、XMLHttpRequestオブジェクトのブラウザ互換コードは使用しません。
  * と思ったが、ローカルデバッグ用にクロスドメイン対応するため、JSONPを受け取るようにするため、XMLHttpRequestでの呼出はしない。
  * TODO:ここじゃなくて別ファイルに定義するかも
  * TODO:通信手段をメインに扱う。actionの解釈などのeternary論理の部分が多くなったらそこは分離するかも
  */
function ServerIf(gameState, action, version, level, host) {
  // サーバURL
  this.SERVER_URL = host === undefined ? ETN_GNUGO_IF_URL : host;  // 引数hostが指定されていた場合、サーバを強制変更する

  // TODO:いろいろ適当
  // TODO:サイズが長方形の場合に未対応
  var request = this.SERVER_URL + "?sgf=" + gameState.getPlayShortSGF() + "&size=" + gameState.worldSizeCol + "&komi=" + Rules.AHEAD_WEIGHT;
  request += version ? "&ver=" + version : "";    // バージョンが指定されていれば(genmove時)、verを付与
  request += level ? "&level=" + level : "";      // レベルが指定されていれば(genmove時)、verを付与 (レベル指定が有効かはバージョン次第)
  request += "&callback=getJsonData";   // JSONPのコールバック関数名の指定

  switch (action.actionKind) {
  // スコア推定
  case Action.ESTIMATE:
    // スコア推定の指定
    request += "&move=est";
    break;

  // アピアー生成
  case Action.PLAY:
    // アピアー生成する色の指定
    request += "&move=" + (action.side == SIDE.A ? "B" : "W");
    break;

  }

  // リクエストするアクションをキューに入れる
  requestQueue.push(action);

  // scriptタグを使った、JSONP取得(クロスドメイン対応)
  // http://tadtak.jugem.jp/?eid=58
  // TODO: script取得は非同期なので、ちゃんと取得できた後かどうかのチェック
  var element = document.createElement("script");
  element.src = request;
  document.body.appendChild(element);

}

var serverResponse;

function getJsonData(json) {
  serverResponse = json;

  // リクエストキューからactionを取り出して、action種別に応じた処理を行なう
  // TODO: リクエストが重なって、レスポンスの順序が入れ替わった場合の考慮
  var action = requestQueue.shift();

  switch (action.actionKind) {
  // スコア推定
  case Action.ESTIMATE:
    // 結果状態から各状態の座標数を求めて追加格納する
    var matter = [null, 0, 0];   // マター数
    var domain = [null, 0, 0];   // ドメイン数(自マターは含めない)
    var frozen = [null, 0, 0];   // フローズン数(既にバニッシュされた分は含まない)
    var worldState = serverResponse.result.status;
    for (var col = 0; col < gm.gameState.worldSizeCol; col++) {
      for (var row = 0; row < gm.gameState.worldSizeRow; row++) {
        switch (worldState[col][row]) {
          case 1:  // alive
          case 3:  // seki
            matter[gm.gameState.worldState[col][row]]++;
            break;
          case 4:  // white_territory
            domain[SIDE.B]++;
            break;
          case 5:  // black_territory
            domain[SIDE.A]++;
            break;
          case 2:  // dead
            frozen[Rules.getOppositeSide(gm.gameState.worldState[col][row])]++;
            break;
          case 6:  // dame
            break;
        }
      }
    }
    serverResponse.result.matter = matter;
    serverResponse.result.domain = domain;
    serverResponse.result.frozen = frozen;

    // 各状態座標数からスコア・勝者を再計算する(GnuGoの算出したスコアはまれに変(xx.2とか)なので)
    // 中国ルールはハマはカウントしない
    var sideScore    = [null,  0,  0];   // 各者のスコア
    var sideScoreStr = [null, "", ""];   // 各者のスコア計算式文字列(表示のため)
    for (var side = SIDE.A; side <= SIDE.B; side++) {
      sideScore[side]    = matter[side] +
                           domain[side] +
                           frozen[side] +
                           (side == SIDE.B ? Rules.AHEAD_WEIGHT : 0);
      sideScoreStr[side] = matter[side] + "+" +
                           domain[side] + "+" +
                           frozen[side] + "+" +
                           (side == SIDE.B ? Rules.AHEAD_WEIGHT : 0) + "=" +
                           sideScore[side] + " ";
    }
    serverResponse.result.sideScore = sideScore;
    serverResponse.result.sideScoreStr = sideScoreStr;
    serverResponse.result.gnugoScore = serverResponse.result.score;
    serverResponse.result.score = Math.abs(sideScore[SIDE.A] - sideScore[SIDE.B]);
    serverResponse.result.gnugoWinner = serverResponse.result.winner;
    if (sideScore[SIDE.A] == sideScore[SIDE.B]) {
      serverResponse.result.winner = SIDE.O;
    }
    else {
      serverResponse.result.winner = sideScore[SIDE.A] > sideScore[SIDE.B] ? SIDE.A : SIDE.B;
    }
    // 勝利ランクの設定
    if (serverResponse.result.winner == SIDE.A) {
      if (serverResponse.result.score >= gm.gameState.worldSizeRow * gm.gameState.worldSizeCol - 8.0) {  // 小数誤差を考慮しコミ分を-7.5じゃなく-8.0にした
        serverResponse.result.winRank = WIN_RANK.PERFECT;
      }
      else if (serverResponse.result.score >= gm.gameState.worldSizeRow * gm.gameState.worldSizeCol * 0.2) {
        serverResponse.result.winRank = WIN_RANK.EXCELLENT;
      }
      else {
        serverResponse.result.winRank = WIN_RANK.GOOD;
      }
    }
    else {
      serverResponse.result.winRank = WIN_RANK.NOT_WIN;
    }

    // 獲得ポイント数の計算(サーバ側でやるべきかも。上記スコア計算も。)
    var levelRate = 1.0 + gm.cpuLevel * 0.1;  // レベル係数
    var FIXED_POINT = 50;                     // 固定獲得ポイント
    var earnedPoint = Math.ceil(levelRate * (sideScore[SIDE.A] + FIXED_POINT));  // 今回獲得ポイント
    serverResponse.result.earnedPoint = earnedPoint;

    // ジャッジメント時のestimateの場合、状態を変化させ、結果を格納しておく
    if (gm.state == gm.STATE_WAIT_JUDGE) {
      gm.setState(gm.STATE_CONFIRM_JUDGE);
      gm.judgeResult = serverResponse.result;
    }
    // 推定結果の表示
    gm.ui.displayWorldState(serverResponse.result);
    break;

  // アピアー生成
  case Action.PLAY:
    // 生成された座標をactionオブジェクトにセットする
    if (serverResponse.result.indexOf("ERROR") == 0) {
      alert(serverResponse.result);
    }
    else if (serverResponse.result == "tt") {
      action.actionKind = Action.PASS;
      action.col = action.row = null;
    }
    else if (serverResponse.result == "resign") {
      action.actionKind = Action.GIVEUP;
      action.col = action.row = null;
    }
    // アピアの解析
    // TODO: パスでもギブアップでも着手でもない値を返したときの実装（エラー処理）
    else {
      // SGF座標表現からcol, row番号を求める
      action.col = serverResponse.result.charCodeAt(0) - "a".charCodeAt(0);
      action.row = serverResponse.result.charCodeAt(1) - "a".charCodeAt(0);
    }

    break;
  }

  // アピアイベント発生を通知する
  gm.processPlayEvent(action);

}



/**
  * プレイヤーの基底クラス
  */
// function Player() {
//   this.genmove = function (GameState gs) {

//   }
// }


/**
  * サーバ側のgnugoを使用したPlayer
  */
// TODO ダックタイピングな言語では、同名メソッドを使いたいだけなら別に継承関係が無くてもよいかも
//      Playerとしての共通メンバを持ち始めたら継承させる。
function GnugoPlayer(ver, level, server) {
  this.isBot = true;
  this.version = ver ? ver : "2.6";  // GNU Goのバージョン文字列
  this.level = level || "0";

  this.genmove = function (gs) {
    // 画面伝操作受付を無効にする
    gm.ui.allowInput(false);

    // TODO: サーバにgenmoveさせるのにAction.PLAY使うのは、暫定処置。
    ServerIf(gs, new Action(gs.nextSide, Action.PLAY, null, null), this.version, this.level, server);
  };

  this.getName = function() {
    if (this.version != "1.6") {
      return "GNU Go";
    }
    else {
      return "liberty";
    }
  };
  this.getVersion = function() {
    if (this.version != "1.6") {
      return this.version;
    }
    else {
      return "1.0";
    }
  };
}

/**
  * ランダムにアピアするPlayer (クライアント側ボット)
  */
function RandomPlayer() {
  this.isBot = true;
  this.genmove = function (gs) {
    // 画面伝操作受付を無効にする
    gm.ui.allowInput(false);

    var col, row, posId, posLog;
    var thinked = [];  // 考慮済座標のposIdを格納

    while (thinked.length < gs.worldSizeCol * gs.worldSizeRow) {
      // ランダムでアピア座標を生成する
      col = randint(0, gs.worldSizeCol - 1);
      row = randint(0, gs.worldSizeRow - 1);

      posId = PosLog.getPosId(col, row);
      posLog = new PosLog(col, row);

      // 既に考慮済の座標かどうか判定する
      var isThinked = false;
      for (var i = 0; i < thinked.length; i++) {
        if (thinked[i] == posId) {
          isThinked = true;
          break;
        }
      }
      // 考慮済でないとき、以降の判定を行なう
      if (!isThinked) {
        // 合法アピアを生成できたら、アピアイベント発生を通知する
        if (Rules.isLegal(gs, gs.nextSide, posLog)) {
          gm.processPlayEvent(new Action(gs.nextSide, Action.PLAY, col, row));
          return;
        }
        // 合法でなければ、考慮済座標に追加して再度生成
        thinked.push(posId);
      }
    }

    // ワールド上の全座標を考慮したけど合法アピアが無い場合は、パスする
    gm.processPlayEvent(new Action(gs.nextSide, Action.PASS, null, null));
  };

  this.getName = function() {
    return "eternary Random Player";
  };
  this.getVersion = function() {
    return "1.0";
  };
}


/**
  * 素朴に・幼稚にアピアするPlayer (クライアント側ボット)
  * 旧アプリのMonteCarloBotの移植
  */
function PrimitivePlayer() {
  this.isBot = true;
  this.genmove = function (gs) {
    // 画面伝操作受付を無効にする
    gm.ui.allowInput(false);

    var col, row, posId, posLog;
    var thinked = [];  // 考慮済座標のposIdを格納
    var betterPosLog = null;  // 最良アピア座標
    var betterPoint = Number.NEGATIVE_INFINITY;     // 最良アピアの評価ポイント

    // 現在のワールド勢力を判定する
    var influence = PrimitivePlayer.estimateInfluence(gs);


    while (thinked.length < gs.worldSizeCol * gs.worldSizeRow) {
      // ランダムでアピア座標を生成する
      col = randint(0, gs.worldSizeCol - 1);
      row = randint(0, gs.worldSizeRow - 1);

      posId = PosLog.getPosId(col, row);
      posLog = new PosLog(col, row);

      // 既に考慮済の座標かどうか判定する
      var isThinked = false;
      for (var i = 0; i < thinked.length; i++) {
        if (thinked[i] == posId) {
          isThinked = true;
          break;
        }
      }
      // 考慮済でないとき、以降の判定を行なう
      if (!isThinked) {
        // 合法アピアを生成できたら
        if (Rules.isLegal(gs, gs.nextSide, posLog)) {
          // 評価値
          var point = 0;

          // Ａ：候補アピアから除外する条件判定
          // A-1: 自分のボイドを潰さないような考慮をする
          if (mightEye(gs, gs.nextSide, posLog)) {
            point = -5;
          }

          // A-2: 呼吸点1のところには打たない（アタリに突っ込まない）※ただし取れる場合は除く
          if (Rules.accuratelib(gs, gs.nextSide, posLog) <= 1) {
            point = -5;
          }

          // Ｂ：バニッシュ数による評価
          // B-1: 候補アピアでバニッシュできる数をプラス評価にする
          point += Rules.accurateVanish(gs, gs.nextSide, posLog) * 10;
          // B-2: 候補アピアにもし相手がアピアした場合の、バニッシュされる数をプラス評価にする
          point += Rules.accurateVanish(gs, Rules.getOppositeSide(gs.nextSide), posLog) * 10;


          // Ｃ：周辺の勢力による評価（適当）
          // 勢力を考慮した評価値の付加
          // TODO: 各種閾値・評価値をパラメータ定数化する
          // 「空き地」：自勢力を広げるように打つ
          // 「自分有利」：(弱)補強するように打つ　(強)重複するのであまり打たない
          // 「敵有利」：(弱)攻めるように打つ　(強)消される可能性が高いので打たない
          // 「混戦」：攻め合いに勝てるように（連絡するように・眼形を保つように）打つ
          var myInfl = influence[gs.nextSide][posLog.col][posLog.row];                         // 自分の勢力
          var enInfl = influence[Rules.getOppositeSide(gs.nextSide)][posLog.col][posLog.row];  // 相手の勢力
          var vsInfl = influence[SIDE.O][posLog.col][posLog.row];                              // 拮抗度

          // C-1: 自分が有利なところ（自分のドメイン）にはアピアしない
          if (myInfl > 9 && vsInfl == 0) {
            point -= 3;
          }
          // C-2: 相手が有利なところ（相手のドメイン）にはアピアしない
          if (enInfl > 9 && vsInfl == 0) {
            point -= 3;
          }
          // C-3: 拮抗していないところで一線・二線にはアピアしない
          // TODO: ただし5路とかの低路の場合は二線は着手可にする
          if (vsInfl == 0 &&
              (posLog.col < 2 || gs.worldSizeCol - 2 <= posLog.col ||
               posLog.row < 2 || gs.worldSizeRow - 2 <= posLog.row)) {
            point -= 2;
          }


          // 評価値が現在の最良アピアより良ければ、最良アピア更新
          if (point > betterPoint) {
            betterPosLog = posLog;
            betterPoint = point;
          }
        }
      thinked.push(posId);
      }
    }

    var action;
    // ワールド上の全座標を考慮後、
    // 最良アピアをアピアする（状況を悪化させる手は打たない）
    if (betterPosLog != null && betterPoint >= 0) {
      action = new Action(gs.nextSide, Action.PLAY, betterPosLog.col, betterPosLog.row)
    }
    // 合法アピアが無い・状況を悪化させる手しかない場合は、パスする
    else {
      action = new Action(gs.nextSide, Action.PASS, null, null);
    }
    gm.processPlayEvent(action);

    // この戻り値は現在gtpInterfaceのみが使用している。（そのため、他のPlayerは返していない。）
    return(action);
  };

  // 指定された座標がボイドかも知れないかどうか判断する
  // （ゆるふわ判定：欠け目かとか判断しない。ポン抜きの形の真ん中も、目かもと判定する。
  //   あくまでbot着手指標の一つとして使用するため、他の指標で得するなら打てばよい。）
  function mightEye(gs, side, posLog) {
    var isMySideOrOutOfWorld = function(posLog) {
      return posLog.col < 0 || gs.worldSizeCol <= posLog.col || posLog.row < 0 || gs.worldSizeRow <= posLog.row || gs.worldState[posLog.col][posLog.row] == side;
    };

    // 指定された座標の上下左右が自分のマターもしくはワールド外かどうか
    return isMySideOrOutOfWorld(new PosLog(posLog.col + 1, posLog.row    )) &&
           isMySideOrOutOfWorld(new PosLog(posLog.col - 1, posLog.row    )) &&
           isMySideOrOutOfWorld(new PosLog(posLog.col    , posLog.row + 1)) &&
           isMySideOrOutOfWorld(new PosLog(posLog.col    , posLog.row - 1));
  }
  this.getName = function() {
    return "eternary Primo Player";
  };
  this.getVersion = function() {
    return "1.0";
  };
}

// 現在のワールド勢力の判定
// 自マター・敵マターとの距離を考慮し、
// ワールドを「空き地」「自分有利」「敵有利」「混戦」とかの状態に識別する。
PrimitivePlayer.estimateInfluence = function(gs) {
  // 勢力を格納する配列の初期化(添字は、side(SIDE.Oは拮抗度を格納), col, row)
  var infl = new Array(3);
  for (var s = SIDE.O; s <= SIDE.B; s++) {
    infl[s] = new Array(gs.worldSizeCol);
    for (var c = 0; c < gs.worldSizeCol; c++) {
      infl[s][c] = new Array(gs.worldSizeRow);
      for (var r = 0; r < gs.worldSizeRow; r++) {
        infl[s][c][r] = 0;
      }
    }
  }

  // まず現在のマター配置状況から各side単独の勢力を求める（相手マターの拮抗は考慮しない）
  // マターからの距離を考慮し、マターの座標は1.0、1つ離れると0.7, 2つ離れると0.4, 3つ離れると0.1 とする。
  // 複数のマターの影響を足し合わせる。
  for (var s = SIDE.A; s <= SIDE.B; s++) {
    for (var c = 0; c < gs.worldSizeCol; c++) {
      for (var r = 0; r < gs.worldSizeRow; r++) {
        if (gs.worldState[c][r] == s) {
          var ops = Rules.getOppositeSide(s);
          // 方向の途中に相手マターがあれば勢力伝播を止める
          //       □
          //     □回□
          //   □回■回□
          // □回■◎■回□
          //   □回■回□
          //     □回□
          //       □
          // 上下左右：一直線の途中の相手マター有無を判定
          // 斜め：対象マターの斜め上に相手マターがあれば、その先の桂馬の位置の2つへの伝播を停止
          //       右と上に相手マターがあるとき、右上に影響が伝播するが、これを止めると切り違えなくなるのでこれでよい。?
          //       TODO しかし切り違いならいいが、そこより1目離れた場所に打つこともあるので、影響を弱めて切り違いのところだけに打つ感じにする。

          // 上下左右の単位ベクトルでループし、左右上下のロジックを1つにまとめる
          var ch = [1, -1,  0,  0];
          var rh = [0,  0,  1, -1];
          for (var i = 0; i < ch.length; i++) {
            // 上下左右の一直線方向
            // 距離1
            if (Rules.isInWorld(gs, c + ch[i] * 1, r + rh[i] * 1) && gs.worldState[c + ch[i] * 1][r + rh[i] * 1] != ops) {
              addInfluence(s, c + ch[i] * 1, r + rh[i] * 1, 7);
              // 距離2
              if (Rules.isInWorld(gs, c + ch[i] * 2, r + rh[i] * 2) && gs.worldState[c + ch[i] * 2][r + rh[i] * 2] != ops) {
                addInfluence(s, c + ch[i] * 2, r + rh[i] * 2, 4);
                // 距離3
                if (Rules.isInWorld(gs, c + ch[i] * 3, r + rh[i] * 3) && gs.worldState[c + ch[i] * 3][r + rh[i] * 3] != ops) {
                  addInfluence(s, c + ch[i] * 3, r + rh[i] * 3, 1);
                }
              }
            }
          }

          // 斜め方向の単位ベクトルでループし、4方向のロジックを1つにまとめる
          var ch = [1, -1,  1, -1];
          var rh = [1,  1, -1, -1];
          for (var i = 0; i < ch.length; i++) {
            if (Rules.isInWorld(gs, c + ch[i] * 1, r + rh[i] * 1) && gs.worldState[c + ch[i] * 1][r + rh[i] * 1] != ops) {
              // 例：右上の場合、右・上にマターがない場合
              if (gs.worldState[c + ch[i] * 1][r] != ops || gs.worldState[c][r + rh[i] * 1] != ops) {
                addInfluence(s, c + ch[i] * 1, r + rh[i] * 1, 4);
                if (Rules.isInWorld(gs, c + ch[i] * 2, r + rh[i] * 1) && gs.worldState[c + ch[i] * 2][r + rh[i] * 1] != ops &&
                    gs.worldState[c + ch[i] * 1][r] != ops) {
                  addInfluence(s, c + ch[i] * 2, r + rh[i] * 1, 1);
                }
                if (Rules.isInWorld(gs, c + ch[i] * 1, r + rh[i] * 2) && gs.worldState[c + ch[i] * 1][r + rh[i] * 2] != ops &&
                    gs.worldState[c][r + rh[i] * 1] != ops) {
                  addInfluence(s, c + ch[i] * 1, r + rh[i] * 2, 1);
                }
              }
              // 右と上にマターがある場合、斜めへの影響を弱く掛ける
              else {
                addInfluence(s, c + ch[i] * 1, r + rh[i] * 1, 1);
              }
            }
          }

        }
      }
    }
  }

  // 拮抗度（マターのぶつかり合い）を求める
  //
  for (var c = 0; c < gs.worldSizeCol; c++) {
    for (var r = 0; r < gs.worldSizeRow; r++) {
      // 双方の勢力の最小値を拮抗度とする。（マターが無い、あるいはどちらかの勢力のみであれば、0）
      infl[SIDE.O][c][r] = Math.min(infl[SIDE.A][c][r], infl[SIDE.B][c][r]);
    }
  }

  // テスト出力
  var debugOut = false;
  if (debugOut) {
    for (var s = SIDE.O; s <= SIDE.B; s++) {
      console.log("side: " + s + "\n");
      for (var r = 0; r < gs.worldSizeRow; r++) {
        var str = "";
        for (var c = 0; c < gs.worldSizeCol; c++) {
          var ii = parseInt(infl[s][c][r]);
          str += (ii < 10 ? " " : "") + ii + " ";
        }
        console.log(str);
      }
    }
  }

  return infl;

  // 勢力値を加算する（ワールド内判定付き）
  function addInfluence(s, c, r, i) {
    if (0 <= c && c < gs.worldSizeCol && 0 <= r && r < gs.worldSizeRow) {
      infl[s][c][r] += i;
    }
  }
};

/**
  * 人間の操作により着手するPlayer
  */
function HumanPlayer() {
  this.isBot = false;
  this.genmove = function (gs) {
    // 画面での操作受付を有効化する
    // TODO: 現在は操作可能・不可能にするコンポーネントは決め打ちだが、
    //       setAvailableInput()で可変にすることを検討(必要であれば)
    gm.ui.allowInput(true);
  };

}

/**
  * 複数のPlayerを任意の割合でミックスするPlayer
  */
function ChimeraPlayer(consistPlayerArray, orderArray) {
  this.isBot = true;
  // 複合Playerを構成する原始Playerのインスタンス
  var player = consistPlayerArray || [new GnugoPlayer("2.0"), new GnugoPlayer("1.6")];
  // 複合Playerの各原始Playerのプレイ順(playerの添字で指定)
  var order  = orderArray || [0, 1];
  //
  var index = 0;

  this.genmove = function (gs) {

    // 原始Playerのgenmoveに処理委譲する
    player[order[index]].genmove(gs);

    // 順番を進める
    index++;
    if (index >= order.length) {
      index = 0;
    }
  };

  this.getName = function() {
    consist = "Chimera consist of "
    for (var i = 0; i < player.length; i++) {
      consist += player[i].getName() + " " + player[i].getVersion() + ", ";
    }
    return consist;
  };
  this.getVersion = function() {
    return "";
  };
}

/**
  * GnuGoにスコア推定させるfunction
  */
// TODO: 単体のfunctionで置いているが、GameMasterに含めるとか、util的メソッドで纏めるとかする
function estimate() {
  ServerIf(gm.gameState, new Action(gm.gameState.nextSide, Action.ESTIMATE, null, null));
}


/**
  * UIインターフェース
  * (Javaのインターフェースの役割だが、JSではただのクラス?)
  */
function UserInterface() {
  this.setWorldImage = null;
  this.updateGameState = null;
  this.allowInput = null;
  this.setAvailableInput = null;
  this.displayWorldState = null;
  this.showMessage = null;
  this.onStateChange = null;
}


/**
  * 論理座標クラス
  */
function PosLog(col, row) {
  this.col = col;
  this.row = row;

  this.equals = function(posLog) {
    return posLog != null && this.col == posLog.col && this.row == posLog.row;
  };

  this.toPosId = function() {
    return PosLog.getPosId(this.col, this.row);
  };
};
  // 論理座標を識別する一意のID(数値)を返す
  PosLog.getPosId = function(col, row) {
    // 256路盤とかは扱わない前提。
    return (col << 8) + row;
  };



/**
  * 行動結果クラス
  */
function ActionResult(posLog, vanishList, isEternally) {
  // 着手座標
  this.posLog = posLog;
  // 捕獲リスト
  this.vanishList = vanishList;
}

/**
  * int乱数を返す
  * tmlib.jsのtm.util.Random.randint()を移植
  * (BotをRhinoで動作させてkgsに接続させるため、cmn, rulesはブラウザ非依存・tmlib非依存で動作させる)
  */
function randint(min, max) {
  return Math.floor( Math.random()*(max-min+1) ) + min;
}

/**
 * ローカル設定情報関連
 * （デバイスごとにlocalStorageに保存）
 */
function localSettingsUtil() {
  // 格納するローカルストレージのキー
  var LOCAL_SETTINGS_KEY = function(){
    return "etn_localSettings";
  }

  // (private)初期設定データセット
  var _initlocalSettings = function() {
    return {
      // アピア操作で確認フェーズを伴うモード(2Pointモード)か？
      // 初期値：スマホ・タブレット等のタッチ端末は初期アピア操作モードを2Pointモードにする
      //        ※OSがキーなので、Windowsタブレットなんて識別できません。
      opModeIs2point : isSmartDevice(),
      // 考慮までの時間 (mean ± diff)
      // 初期値：待ち無し
      thinkTimeMean : 0,  // 中央値[ms]
      thinkTimeDiff : 0,  // ばらつき[ms]
      // 着手時エフェクト
      // 初期値：あり
      playEffect : true,
      // 視認性調整
      // 初期値：背景は半透明, ゲームオブジェクトは透過なし
      worldDimmerOpaque : 0.5,   // ワールドに更に被せる減光用画像の透明度
      gameObjOpaque     : 1.0,   // ゲームオブジェクト(マター・グリッド)の透明度
    }
  }

  // (private)ローカルストレージからの読出
  var _loadLocalSettings = function() {
    var lsStr = localStorage.getItem(LOCAL_SETTINGS_KEY());
    var ls = JSON.parse(lsStr);
    // ローカルストレージに保存されていた設定に、存在しない項目があれば、
    // 最新のデフォルト設定値を補完する(バージョン違い考慮)
    if(ls){
      var ini = _initlocalSettings();
      var iniKeys = Object.keys(ini);
      for (var i = 0; i < iniKeys.length; i++) {
        if (ls[iniKeys[i]] === undefined) {
          ls[iniKeys[i]] = ini[iniKeys[i]]
        }
      }
    }
    return ls; 
  }
  // (private)ローカルストレージへの保存
  var _saveLocalSettings = function(ls) {
    localStorage.setItem(LOCAL_SETTINGS_KEY(), JSON.stringify(ls));
  }

  // ローカル設定情報を取得する
  this.get = function() {
    var ls = _loadLocalSettings();
    if (ls) {
      return ls;
    }
    else {
      return _initlocalSettings();
    }
  }
  // ローカル設定情報を保存する
  this.set = function(ls) {
    _saveLocalSettings(ls);
  }
  // 【デバッグ用】ローカル設定情報を削除する
  this.delete = function() {
    localStorage.removeItem(LOCAL_SETTINGS_KEY());
  }
}

// スマホ・タブレット等のタッチ端末かどうか？
//  ※OSがキーなので、Windowsタブレットなんて識別できません。
function isSmartDevice() {
  return (window.navigator != null &&
          (window.navigator.userAgent.indexOf("Android")       > 0 ||
          window.navigator.userAgent.indexOf("iPhone")        > 0 ||
          window.navigator.userAgent.indexOf("iPad")          > 0 ||
          window.navigator.userAgent.indexOf("Windows Phone") > 0));
}
