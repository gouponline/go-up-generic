/*
 * eternary -
 * 次世代囲碁ゲームクライアント
 */

/*
 * 定数
 */
// etn_view内で使用するネームスペース
var etv = etv || {};

etv.gameScene = null;

/* 表示系 */
etv.devicePixelRatio;       // window.devicePixelRatio
etv.appWidth;               // アプリ幅 (物理解像度)
etv.appHeight;              // アプリ高さ (物理解像度)
etv.COLOR_OPAQUE = "rgba(0, 0, 0, 0)";  // 透明色
etv.FONT_FAMILY = "'Helvetica-Light', 'Meiryo', sans-serif";  // フォントファミリー
etv.LEAST_PANEL_SIZE = 100;   // infoパネル・buttonsパネルで最低限確保する短辺サイズ
etv.DISPLAY_MODE_NORMAL     = 0;  // 通常表示モード
etv.DISPLAY_MODE_WORLD_VIEW = 1;  // 背景確認モード
etv.DISPLAY_MODE_WORLD_OFF  = 2;  // 背景非表示モード
etv.displayMode = etv.DISPLAY_MODE_NORMAL;  // 表示モード

/* 2Point操作系 */
etv.POINT_STATE_SELECT  = 0;   // アピア選択状態を表す定数
etv.POINT_STATE_CONFIRM = 1;   // アピア確認状態を表す定数 (2Pointモードのみ)
etv.pointState = etv.POINT_STATE_SELECT;  // ワールドpoint時の動作状態
etv.tmpAppearPosLog = null;    // 仮アピア座標

/* ワールド定義系 */
//etv.rows = 5;   // ワールドの縦グリッド(死活等テスト用)
//etv.cols = 5;   // ワールドの横グリッド(死活等テスト用)
etv.rows = 7;   // ワールドの縦グリッド(終局等テスト用)
etv.cols = 7;   // ワールドの横グリッド(終局等テスト用)
//etv.rows = 9;   // ワールドの縦グリッド（棋力テスト用）
//etv.cols = 9;   // ワールドの横グリッド（棋力テスト用）
// etv.rows = 11;   // ワールドの縦グリッド
// etv.cols = 11;   // ワールドの横グリッド
//etv.rows = 13;   // ワールドの縦グリッド（costume用)
//etv.cols = 13;   // ワールドの横グリッド（costume用)
//etv.rows = 19;
//etv.cols = 19;
// デバッグ用：ワールドサイズをURLパラメータ ws で指定する
if ("ws" in httpGetParas) {
  etv.rows = parseInt(httpGetParas.ws);   // ワールドの縦グリッド
  etv.cols = parseInt(httpGetParas.ws);   // ワールドの横グリッド
}

etv.isWindowPortrait;      // ウィンドウが縦長かどうか
etv.worldWidth;   // ワールド領域(shpWorld,shpEffect)の幅
etv.worldHeight;  // ワールド領域(shpWorld,shpEffect)の高さ
etv.cellWidth;    // セルの幅(仮)
etv.cellHeight;   // セルの高さ(仮)
etv.worldMarginWidth;  // ワールドのマージン(ピクセル)
etv.worldMarginHeight;  // ワールドのマージン(ピクセル)
etv.matterSize;     // マターサイズ
etv.effOfsX;   // エフェクト描画時のX座標オフセット値
etv.effOfsY;   // エフェクト描画時のY座標オフセット値
etv.worldImg;  // 初期化したワールドの画像
etv.backTexture;   // 背景のテクスチャ画像

/* ワールドデザイン系 */
// TODO: 可変にできるようクラス化する
var worldBackColor = "#EEEEDD";
var worldBackTextureColor = ["#FFEEDD", "#EEFFEE"];

etv.drawWorld;        // ワールド描画関数を格納する関数ポインタ
etv.drawWorldCover;   // ワールドカバー描画関数を格納する関数ポインタ
etv.drawWorldDimmer;  // ワールドディマー描画関数を格納する関数ポインタ
etv.drawGrid;         // グリッド描画関数を格納する関数ポインタ

etv.worldImgFile      = "backB.png";
etv.worldCoverImgFile = "backA.png";
etv.worldDimmerImgFile = "woodboard.jpg";
etv.worldImg      = new Image();
etv.worldCoverImg = new Image();
etv.worldDimmerImg = new Image();

etv.worldDimmerOpaque;   // ワールドに更に被せる減光用画像の透明度
etv.gameObjOpaque;       // ゲームオブジェクト(マター・グリッド)の透明度

/* マターデザイン系 */
// TODO: 可変にできるようクラス化する
etv.matterAnimation = true;
etv.drawMatter;   // 値セットはViewUtl初期化の都合でtm.main内で行なう

// drawSolidRoundMatter()で使うもの
var sideAColor = "black";
var sideBColor = "white";

// drawSpriteMatter()で使うもの
var MATTER_ANM_INTERVAL = 150;    // マターアニメーションの周期[ms]
var matterLastAnm = 0;

var matterPhase = [null, 0, 0];

var matterImg = [null, new Image(), new Image()];
// var MATTER_IMG_FILE = [null, "PRT_Fire_red_alpha.png", "PRT_Fire_blue_alpha.png"];
// var MATTER_SPRITE_WIDTH = [null, 128, 128];    // マタースプライト1個分の幅
// var MATTER_SPRITE_HEIGHT = [null, 128, 128];   // マタースプライト1個分の高さ
// var MATTER_PHASES = [null, 8, 8];            // マタースプライトのコマ数
// var MATTER_SPRITE_BREAK = [null, 4, 4];      // マタースプライト集合をブレイク（改行）する数（※横書き限定）
// etv.MATTER_COEFF_Y = [null, -0.2, -0.2];        // マターをマター中央からセル高に対してどれくらいの比率ずらすかの補正値
// etv.MATTER_COEFF_Y = [null, 0, 0];        // マターをマター中央からセル高に対してどれくらいの比率ずらすかの補正値
var MATTER_IMG_FILE = [null, "black.png", "white.png"];
// var MATTER_SPRITE_WIDTH = [null, 110, 110];    // マタースプライト1個分の幅
// var MATTER_SPRITE_HEIGHT = [null, 110, 110];   // マタースプライト1個分の高さ
var MATTER_SPRITE_WIDTH = [null, 79, 77];    // マタースプライト1個分の幅
var MATTER_SPRITE_HEIGHT = [null, 79, 77];   // マタースプライト1個分の高さ
var MATTER_PHASES = [null, 1, 1];            // マタースプライトのコマ数
var MATTER_SPRITE_BREAK = [null, 1, 1];      // マタースプライト集合をブレイク（改行）する数（※横書き限定）
etv.MATTER_COEFF_X = [null, 0.0, 0.0];        // マターをマター中央からセル幅に対してどれくらいの比率ずらすかの補正値
etv.MATTER_COEFF_Y = [null, 0, 0];        // マターをマター中央からセル高に対してどれくらいの比率ずらすかの補正値


/* 情報部 */
// 各情報部の配置座標 ※要素数3の配列。添字0=共通部, 1,2=side
etv.infoX;
etv.infoY;
etv.infoWidth;
etv.infoHeight;

// プレイヤー情報
etv.abatarImg = [null, new Image(), new Image()];
//etv.ABATAR_IMG_FILE_A = "ikikoi_200_02.jpg";
etv.ABATAR_IMG_FILE = [null, "image/face_player.png", "image/robot.png"];

// estimate結果
etv.estimatedResult = null;


/* サウンド関係 */
// サウンド再生方法
etv.SOUND_AUDIO    = 0;  // Audio要素
etv.SOUND_WEBAUDIO = 1;  // WebAudio
etv.soundMethod = tm.sound.WebAudio.isAvailable ? etv.SOUND_WEBAUDIO : etv.SOUND_AUDIO;
// サウンドアンロック済フラグ(iOSでの)
etv.soundUnlock = false;
// サウンドロード済フラグ(Android Chromeの)
etv.soundLoaded = false;
// ミュート
etv.soundOn = false;
// BGM再生中フラグ
etv.bgmPlaying = false;
// BGMロード待ちタイマID
etv.bgmLoadWaitTimerID = null;
// ミュート使った再生関数ショートカット
etv.playSE = function(soundAssetName) {
  if (etv.soundOn && tm.asset.Manager.get(soundAssetName).loaded == true) {
    tm.sound.SoundManager.play(soundAssetName);
  }
};
etv.playBGM = function(soundAssetName) {
  if (etv.soundOn) {
    if (tm.asset.Manager.get(soundAssetName).loaded == true) {
      tm.sound.SoundManager.playMusic(soundAssetName);
      etv.bgmPlaying = true;
    }
    else {
      // ロード完了前にsoundOnされた場合、
      // ロード完了をポーリングし(onload関数使えないみたいなので)、完了後に自動再生開始
      var onloadfunc = function(soundAssetName) {
        return function() {
          if (tm.asset.Manager.get(soundAssetName).loaded == true) {
            if (etv.soundOn && !etv.bgmPlaying) {
              etv.playBGM(soundAssetName);
            }
            clearInterval(etv.bgmLoadWaitTimerID);
            etv.bgmLoadWaitTimerID = null;
          }
        }
      }(soundAssetName);
      if (etv.bgmLoadWaitTimerID == null) {
        etv.bgmLoadWaitTimerID = setInterval(onloadfunc, 500);
      }
    }
  }
};
etv.stopBGM = function() {
  tm.sound.SoundManager.stopMusic();
  etv.bgmPlaying = false;
};


// COSTUME用
etv.COSTUME = true;
etv.transparency = null;


/**
  * グローバル変数
  */

var app;


/* ゲーム系 */
gm = new GameMaster(etv.cols, etv.rows);  // ゲームマスターのインスタンス生成


/*
 * main
 */
tm.main(function() {
  // アプリケーションセットアップ
  app = tm.app.CanvasApp("#world");       // 生成

  // ゲームマスターからの操作関数を作成
  gm.ui = new UserInterface();


  // ゲーム開始前にロード完了しておくもののカウンタセット
  // ワールドイメージ + ワールドカバーイメージ + ワールドディマーイメージ + マターイメージ + アバターイメージ + ユーザー名
  var LOAD_COUNT = 1 + 1 + 1 + 2 + 2 + 1;
  var loadCount = 0;
  var divLoading = document.getElementById("loading");
  var divTrouble = document.getElementById("trouble");
  // ロード完了時に実行する関数：全読込完了時にGameSceneに遷移し実行開始
  var onloadfunc = function(){
    loadCount++;
    divLoading.innerText = "Loading... (" + loadCount + " / " + LOAD_COUNT + ")";
    if (loadCount == LOAD_COUNT) {
      divLoading.parentNode.removeChild(divLoading);
      divTrouble.parentNode.removeChild(divTrouble);
      app.replaceScene(GameScene());
      app.run();
    }
  };

  // ワールド画像ファイルを指定する
  // TODO: これ本当はcmnから受け取るべきものじゃないのでは...
  gm.ui.setWorldImage = function(worldImageFile, worldCoverImageFile) {
    etv.worldImgFile      = worldImageFile;
    etv.worldCoverImgFile = worldCoverImageFile;
    // TODO: worldDimmerImageFileも外から受け取って可変にできるようにする

    // 背景画像のロード
    if (etv.worldImgFile != null) {
      etv.worldImg.src      = "image/" + etv.worldImgFile;
      etv.worldImg.onload   = onloadfunc;
    }
    if (etv.worldCoverImgFile != null) {
      etv.worldCoverImg.src    = "image/" + etv.worldCoverImgFile;
      etv.worldCoverImg.onload = onloadfunc;
    }
    if (etv.worldDimmerImgFile != null) {
      etv.worldDimmerImg.src    = "image/" + etv.worldDimmerImgFile;
      etv.worldDimmerImg.onload = onloadfunc;
    }
  };

  // CPUのアバター画像ファイルを指定する
  gm.ui.setCpuAbatarImage = function(abatarImageFile) {
    etv.ABATAR_IMG_FILE[SIDE.B] = abatarImageFile;
    // CPUアバター画像のロード
    if (etv.ABATAR_IMG_FILE[SIDE.B] != null) {
      etv.abatarImg[SIDE.B].src = etv.ABATAR_IMG_FILE[SIDE.B];
      etv.abatarImg[SIDE.B].onload = onloadfunc;
    }
  };

  // ステージごとのBGMファイルをロードする
  gm.ui.setBgm = function(bgmFile) {
    var loaderBgm = tm.asset.Loader();
    loaderBgm.set("bgm", null);
    loaderBgm._load("bgm", "soundtmp/" + bgmFile);
  };

  // GameMasterの初期化
  gm.init(onloadfunc);

  // Option画面(ローカル設定)関係の処理
  initOptionDlg();

  app.background = worldBackColor;// 背景色

  // localStorageからマターIDを取得する
  if (localStorage.getItem("matterIdA") != null &&
      localStorage.getItem("matterIdB") != null) {
    var matterIds = [null, localStorage.getItem("matterIdA"), localStorage.getItem("matterIdB")];
    for (var s = SIDE.A; s <= SIDE.B; s++) {
      if (matterIds[s] != null && matterIds[s].length > 0) {
        for (var i = 0; i < ownMatters.length; i++) {
          if (matterIds[s] === ownMatters[i].matterId) {
            MATTER_IMG_FILE[s] = ownMatters[i].spriteFileName;
            MATTER_PHASES[s] = ownMatters[i].spritePhases;
            MATTER_SPRITE_BREAK[s] = ownMatters[i].spriteBreak;
            MATTER_SPRITE_WIDTH[s] = ownMatters[i].spriteWidth;
            MATTER_SPRITE_HEIGHT[s] = ownMatters[i].spriteHeight;
          }
        }
      }
    }
  }

  // マター画像描画方法のセット
  etv.drawMatter = ViewUtl.drawSpriteMatter;

  // マター画像のロード
  for (var s = SIDE.A; s <= SIDE.B; s++) {
    matterImg[s].src = MATTER_IMG_FILE[s];
    matterImg[s].onload = onloadfunc;
  }
  // アバター画像のロード(プレイヤー分)
  etv.abatarImg[SIDE.A].src = etv.ABATAR_IMG_FILE[SIDE.A];
  etv.abatarImg[SIDE.A].onload = onloadfunc;


  // ワールド画像描画方法のセット
  etv.drawWorld = function(layer) { ViewUtl.drawImageWorld(layer, etv.worldImg); };
  etv.drawWorldCover = function(layer) { ViewUtl.drawPartTransparentImageWorld(layer, etv.worldCoverImg); };
  etv.drawWorldDimmer = function(layer) { ViewUtl.drawImageWorldOpaque(layer, etv.worldDimmerImg, etv.worldDimmerOpaque); };
  etv.drawGrid = ViewUtl.drawTraditionalGrid;

  // GlossyButtonクラスの初期フェードの暗さを調整
  tm.app.GlossyButton.DEFAULT_ALPHA = 0.85;

  // 使用するアセットの定義
  var assetsImg = {  // 画像
      // "cutin": CUT_IN_IMG_FILE,
      // "cutin2": "csg-5445102b1f18c.png",
  };
  var assetsSound = {  // 音声
      // "bgm"           : "soundtmp/loop_4.mp3",  // BGMはステージごとのBGMファイルを受け取った後に個別ロード
      "se_push"       : "soundtmp/se_maoudamashii_system47.mp3",    // 汎用ボタン押下
      "se_candidate"  : "soundtmp/se_maoudamashii_system40.mp3",   // 着手候補(2Point)
      "se_strike1"    : "soundtmp/WhipB@22.mp3",      // 着手確定(SIDE A)
      "se_strike2"    : "soundtmp/WhipB@22.mp3",      // 着手確定(SIDE B)
      "se_cancel"     : "soundtmp/se_maoudamashii_system05.mp3",       // キャンセル(Undo, 2Point候補キャンセル, 終局拒否等)
      "se_vanish1"    : "soundtmp/windchime.mp3",      // バニッシュ(SIDE A)
      "se_vanish2"    : "soundtmp/se_maoudamashii_chime12.mp3",      // バニッシュ(SIDE B)
      "se_pass"       : "soundtmp/se_maoudamashii_onepoint25.mp3",      // パス
      "se_win"        : "soundtmp/ji_020.mp3",       // 勝利
      "se_lose"       : "soundtmp/game_maoudamashii_9_jingle10.mp3",       // 敗北
      "se_earn"       : "soundtmp/coin03.mp3",    // ポイント加算
      "se_goodies"    : "soundtmp/b_082.mp3",      // 特典獲得
  };

  // ローディングシーンを介さないロード（サウンド・スプライト）
  var loader = tm.asset.Loader();
  loader.load(assetsImg.$extend(assetsSound));

  // サウンドアンロック関数をwindow.touchendで呼ぶ(iOS safari用)
  // http://qiita.com/isora1988/items/75f249e8bea60c7f2c20
  if (etv.soundMethod == etv.SOUND_WEBAUDIO) {
    var func;
    document.getElementById("world").addEventListener("touchend", func = function(e) {
      if (etv.soundUnlock == false) {
        tm.sound.WebAudio.unlock();
        etv.soundUnlock = true;
        document.getElementById("world").removeEventListener("touchend", func);
      }
    });
  }

  // サウンドロードをwindow.touchstartで呼ぶ(Android Chrome用)
  // http://dsuket.hatenablog.com/entry/2013/05/05/101430
  // ※Android ChromeでのWebAudio動作は、対応端末が無いため未確認
  if (window.navigator.userAgent.indexOf("Android") > 0 && tm.BROWSER == "Chrome") {
    var func;
    document.getElementById("world").addEventListener("touchstart", func = function(e) {
      if (etv.soundLoaded == false) {
        for (var key in assetsSound) {
          tm.asset.Manager.get(key).element.load();
        }
        if (tm.asset.Manager.get("bgm") != null) {
          tm.asset.Manager.get("bgm").element.load();
        }
      }
      etv.soundLoaded = true;
      document.getElementById("world").removeEventListener("touchstart", func);
    });
  }
});

/*
 * ゲームシーン
 */
tm.define("GameScene", {
  superClass: "tm.app.Scene",
  // 親となるcanvas
  canvas: null,

  // ワールドを描画するShape
  shpWorld: null,
  // ワールドを覆う要素を描画するShape
  shpWorldCover: null,
  // ワールドの明度を調整する要素を描画するShape
  shpWorldDimmer: null,
  // マターを描画するShape
  shpMatter: null,
  // グリッドを描画するShape
  shpGrid: null,
  // エフェクトを描画するShape
  shpEffect: null,
  // マターマーカーを描画するShape
  shpMarker: null,

  // ゲーム情報(ベース情報)を表示するShape
  shpInfo: null,
  // ゲーム情報(ゲーム状態)を表示するShape
  shpInfoState: null,

  // 操作ボタンを配置するShape
  shpButtons: null,

  // undoボタン
  btnUndo: null,
  // パスボタン
  btnPass: null,
  // ギブアップ(投了)ボタン
  btnGiveUp: null,
  // サウンド切替ボタン
  btnSoundOnOff: null,
  // オプションボタン
  btnOption: null,
  // ヘルプボタン
  btnHelp: null,

  // (2Pointモード)OKボタン
  btn2pOk: null,
  // (2Pointモード)キャンセルボタン
  btn2pCancel: null,

  // (ジャッジメント)OKボタン
  btnOk: null,
  // (ジャッジメント)NGボタン
  btnNg: null,

  // (終了)終了ボタン
  btnEnd: null,

  // 前回着手位置を保持
  prvPlayPosLog: null,
  // 前回透過マター描画位置を保持
  // TODO:変数名(Gst=Ghost)を検討
  prvGstPosLog: null,
  // 前回Eternally位置を保持
  prvEternallyPosLog: null,

  // 有効なエフェクトを格納する配列
  effects: [],

  init: function() {
    this.superInit();

    var self = this;
    etv.gameScene = this;

    // ワールドのオブジェクト(キャンバス)
    this.canvas = tm.app.CanvasElement();
    this.addChild(this.canvas);

    // 画面要素の配置
    self.setArrangement(self);
    // Android端末では正確な画面サイズ取得のため、一定時間後に再配置する
    // http://www.riaxdnp.jp/?p=5093
    var ANDROID_RESIZE_WAIT = 100;
    if (window.navigator != null && window.navigator.userAgent.indexOf("Android") > 0) {
      setTimeout(function(){ self.setArrangement(self); }, ANDROID_RESIZE_WAIT);
    }

    // ウィンドウリサイズ時のイベントリスナ登録
    // tmlibのfitWindowだと、リサイズ時に縦横比を変えないように短辺合わせするのでフルスクリーンにならない
    if (window.navigator != null && window.navigator.userAgent.indexOf("Android") > 0) {
      window.addEventListener("resize", function(){ setTimeout(function(){ self.setArrangement(self); }, ANDROID_RESIZE_WAIT); }, false);
    }
    else {
      window.addEventListener("resize", function(){ self.setArrangement(self); }, false);
    }

    gm.ui.updateGameState = function(actionResult) {
      if (actionResult != null) {
        // 前回エターナリー座標マーカーのクリア
        if (self.prvEternallyPosLog != null) {
          var prvEternallyPosPhs = ViewUtl.toPosPhs(self.prvEternallyPosLog);
          self.shpMarker.canvas.clear(prvEternallyPosPhs.x, prvEternallyPosPhs.y, etv.cellWidth, etv.cellHeight);

        }

        if (actionResult.posLog != null) {
          // 描画更新する
          // マターの状態が変更になる座標（今回着手・捕獲）及び前回着手(マーカークリアのため)のみ描画する
          var drawList = [actionResult.posLog].concat(actionResult.vanishList)
                                              .concat(self.prvPlayPosLog != null ? [self.prvPlayPosLog] : []);
          for (var i = 0; i < drawList.length; i++) {
            var posPhs = ViewUtl.toPosPhs(drawList[i]);
            var side = gm.gameState.worldState[drawList[i].col][drawList[i].row];

            if (side != SIDE.O) {
              // マターを描画する
              etv.drawMatter(self.shpMatter, drawList[i], side, false);
            }
            else {
              // マターをクリアする
              self.shpMatter.canvas.clear(posPhs.x, posPhs.y, etv.cellWidth, etv.cellHeight);
            }
          }

          // 今回アピアに関する処理
          // 直前アピアマーカーを描画更新する（前回マーカークリア、今回マーカー描画）
          if (self.prvPlayPosLog != null) {
            var prvPlayPosPhs = ViewUtl.toPosPhs(self.prvPlayPosLog);
            self.shpMarker.canvas.clear(prvPlayPosPhs.x, prvPlayPosPhs.y, etv.cellWidth, etv.cellHeight);
          }
          ViewUtl.drawLastMarker(self.shpMarker, actionResult.posLog);

          // アピアエフェクトの追加（エフェクト有効時のみ）
          if (gm.lset.playEffect) {
            self.effects.push(new EffectCircle(self.shpEffect, actionResult.posLog));
            // self.effects.push(new EffectPicture(self.shpEffect, actionResult.posLog));
            self.effects.push(new EffectStarsSplash(self.shpEffect, actionResult.posLog));
            // ★★★ スプライトのテストコード呼出部2:カットインアニメーション
            // self.effects.push(new SakiTsumo(self.shpEffect, actionResult.posLog));
          }

          var side = Rules.getOppositeSide(gm.gameState.nextSide);
          etv.playSE("se_strike" + side);

          // バニッシュエフェクトを追加する
          if (actionResult.vanishList.length > 0) {
            etv.playSE("se_vanish" + side);
            for (var i = 0; i < actionResult.vanishList.length; i++) {
              self.effects.push(new EffectStarsSplash(self.shpEffect, actionResult.vanishList[i], true));
            }
            // ★★★ スプライトのテストコード呼出部:3つ以上バニッシュしたらミクをinfo部に歩かせる
            //if (actionResult.vanishList.length >= 3)
            //self.effects.push(new MikuMikuWalk(self.shpInfo, actionResult.posLog));
          }

          // 前回アピア座標の更新
          self.prvPlayPosLog = actionResult.posLog;
        }
        // パスの表示
        else {
          etv.playSE("se_pass");
          self.effects.push(new EtnToast(self.shpEffect, "Passed.", 1000));
        }


        // エターナリーマーカーの描画
        if (gm.gameState.eternallyPos != null) {
          ViewUtl.drawEternallyMarker(self.shpMarker, gm.gameState.eternallyPos);
        }
        // 前回エターナリー座標の更新
        self.prvEternallyPosLog = gm.gameState.eternallyPos;


        // 情報部の配置/描画
        self.setInfoPanel(self, false);

        // COSTUME: ワールド透過度・画像の更新
        if (etv.COSTUME) {
          etv.transparency = PrimitivePlayer.estimateInfluence(gm.gameState);
          self.shpWorldCover.canvas.clear();
          etv.drawWorldCover(self.shpWorldCover);
          // etv.drawGrid(self.shpWorldCover);
        }
      }
      // （旧チュートリアルの表示(※呼出先で無効化されている)）
      showHelp(ETN_HELP.TUTORIAL);
      // 対局中のページ遷移(戻る・リロード・閉じる)時に確認ダイアログを表示する
      if (gm.gameState.playCount == 2) {  // 2手目まで進んだらセットする
        window.onbeforeunload = function(e) {
          e.preventDefault();
          var MES = "この対局はクリアされますがよろしいですか？";  // メッセージは多くのブラウザで表示されないが、
          e.returnValue = MES;                                 // ダイアログ有効化のためセットする必要がある
          return MES;
        }        
      }
    };

    gm.ui.allowInput = function(allow) {
      // 操作可能・不可能を切り替える
      // ※切替対象コンポーネント
      //   ・this.shpWorld: allowのboolean値に従う
      //   ・その他: 常に操作可能(可否制御しない)
      // TODO:新規配置したボタンの可否制御
      self.shpWorld.setInteractive(allow);
    };

    // Estimate結果取得完了時の処理
    gm.ui.displayWorldState = function(result) {
      // estimate結果を格納する
      etv.estimatedResult = result;

      // Estimate結果マーカーの描画
      ViewUtl.drawEstimateMarker(self.shpMarker);

      // ジャッジメントによる表示の場合、確認を行なう
      if (gm.state == gm.STATE_CONFIRM_JUDGE) {
        // ジャッジメント確認ボタンを表示させる
        self.setButtonPanel(self);
        // テスト用：Bot自動対局テスト(連続)
        if (BOT_AUTO_TEST) {
          // ボタン確認無しに終局同意
          gm.processPlayEvent(new Action(gm.gameState.nextSide, Action.FIN_OK, null, null));
        }
      }
    };

    // メッセージの表示
    // TODO: 無期限メッセージの指定と、無期限メッセージ削除の仕組み
    gm.ui.showMessage = function(mes) {
      self.effects.push(new EtnToast(self.shpEffect, mes, 2000));
    };

    // ゲーム状態変化時のアクション
    gm.ui.onStateChange = function(mes) {
      if (gm.state == gm.STATE_WAIT_JUDGE) {
        // メッセージ表示
        self.effects.push(new EtnToast(self.shpEffect, "結果判定中...", 3000));
        // TODO: もっと強力な操作禁止を掛ける（ボタンも押下禁止）
        //gm.ui.allowInput(false);
      }
      else if (gm.state == gm.STATE_CONFIRM_JUDGE) {
        self.effects.push(new EtnToast(self.shpEffect, "判定結果OK？", 5000));
      }
      else if (gm.state == gm.STATE_GAME_OVER) {
        // ジャッジメント結果確定し、結果に応じた表示・エフェクト・アクションを行なう
        if (gm.judgeResult.winner == SIDE.A) {
          self.effects.push(new EffectPaperParticle(self.shpEffect, null));
        }
        else if (gm.judgeResult.winner == SIDE.B) {
          self.effects.push(new EffectBlackDown(self.shpEffect, null));
        }

        var isGiveUp = gm.judgeResult.score == GIVEUP_SCORE;
        var gameResultStr =
          (gm.judgeResult.winner != SIDE.O) ?
          (isGiveUp ? "投了により" : gm.judgeResult.score + "目") + (gm.judgeResult.winner == SIDE.A ? "勝ちです！！" : "負けです...") :
          "引き分けです。";
        var winRankStr = "";
        switch (gm.judgeResult.winRank) {
          case WIN_RANK.PERFECT:
            winRankStr = "  <span style='font-family: serif; font-weight: bold; color: #FFCC99;'>Perfect!!</span>";
            break;
          case WIN_RANK.EXCELLENT:
            winRankStr = "  <span style='font-family: serif; font-weight: bold; color: #99FF99;'>Excellent!</span>";
            break;
        }
        etv.playSE(gm.judgeResult.winner == SIDE.A ? "se_win" : "se_lose");   // TODO: even時のSEを変える(handi実装まで不要)

        // 対局結果・獲得ポイントの表示
        var pointDiv = document.getElementById('point');
        var gamePoint = gm.judgeResult.sideScore[SIDE.A];
        var fixPoint = 50;
        var levelRate = (1.0 + gm.cpuLevel * 0.1).toFixed(1);
        var earnedPointTmp = gm.judgeResult.earnedPoint;
        var allPoint = gm.totalPoint;  // 累計ポイント
        var ownPoint = gm.ownPoint;    // 保有ポイント

        pointDiv.innerHTML =
          "対局結果：" + winRankStr + "<br>" +
          " <span style='font-size: large; font-weight: bold; color: #" +
          (gm.judgeResult.winner == SIDE.A ? "FFAA00" : "0000BB") + // 勝敗で色を変える
          ";'>" + gameResultStr + "</span><br>" +
          "<br>" +
          "獲得ポイント：<br>" +
          "<table noborder>" +
          "<tr><td>" + (isGiveUp ? "投了pt" : "自領域数") + ":</td><td align='right'>" + gamePoint + "</td><td>pt.</td></tr>" +
          "<tr><td>" + (gm.judgeResult.winner == SIDE.A ? "勝利報酬" : "敗北支援pt") + ":</td><td align='right'>" + fixPoint + "</td><td>pt.</td></tr>" +
          "<tr><td>レベル倍率:</td><td align='right'>" + levelRate + "</td><td></td></tr>" +
          "</table>" +
          "　⇒ ( " + gamePoint + " + " + fixPoint + " ) * " + levelRate + " = " + gm.judgeResult.earnedPoint + "<br>" +
          " <span style='font-size: large; font-weight: bold; color: #FFEE00;'>" + gm.judgeResult.earnedPoint + " pt.獲得しました！</span><br>" +
          "<br>" +
          "累計ポイント：<br>" +
          "<table noborder>" +
          "<tr><td>保有：</td><td align='right'><span id='ownPoint'>" + ownPoint + "</span></td><td>pt.</td><td>←</td><td><span id='earnedPoint1'>" + earnedPointTmp + "</span></td><td align='right'>pt.</td></tr>" +
          "<tr><td>通算：</td><td align='right'><span id='allPoint'>" + allPoint + "</span></td><td>pt.</td><td>←</td><td><span id='earnedPoint2'>" + earnedPointTmp + "</span></td><td align='right'>pt.</td></tr>" +
          "</table>";
        pointDiv.style.display = "block";

        var ownPointSpan = document.getElementById('ownPoint');
        var allPointSpan = document.getElementById('allPoint');
        var earnedPointSpan1 = document.getElementById('earnedPoint1');
        var earnedPointSpan2 = document.getElementById('earnedPoint2');

        var jingleJangleFunc = function() {  // ジャラジャラ増やす
          var DELTA = 19;   // 1回の加算の増分

          // 結果画面が閉じられたときは実行せず終了
          if (pointDiv.style.display != "block") {
            return;
          }

          if (earnedPointTmp >= DELTA) {
            ownPoint += DELTA;
            allPoint += DELTA;
            earnedPointTmp -= DELTA;
          }
          else {
            ownPoint += earnedPointTmp;
            allPoint += earnedPointTmp;
            earnedPointTmp = 0;
          }

          ownPointSpan.innerHTML = ownPoint;
          allPointSpan.innerHTML = allPoint;
          earnedPointSpan1.innerHTML = earnedPointTmp;
          earnedPointSpan2.innerHTML = earnedPointTmp;

          etv.playSE("se_earn");

          if (earnedPointTmp > 0) {
            setTimeout(jingleJangleFunc, 100);
          }
        }
        setTimeout(jingleJangleFunc, 3000);
      }

      // 状態に応じたパネルに再描画する
      self.setInfoPanel(self);
      self.setButtonPanel(self);
    };

    // bgmスタート
    etv.playBGM("bgm");

    // Playerによるゲームの開始
    gm.startPlaying();
  },

  // 画面要素の初期配置 & サイズ変更再配置
  setArrangement: function(self, isLocalSettingsChange) {
    // 物理解像度と論理解像度の比の取得（スマホの解像度違い(俗に言うRetina対応)のため）
    etv.devicePixelRatio = window.devicePixelRatio;

    // 画面サイズ・縦横に応じて配置を自前で調整する
    // ウィンドウサイズの取得(論理解像度)
    // iOS9でinnerWidth/Heightが正しく取得できないため、document.documentElement.clientWidth/Heightに変更
    var innerWidth  = document.documentElement.clientWidth;   // window.innerWidth;
    var innerHeight = document.documentElement.clientHeight;  // window.innerHeight;

    // PCでのretinaテスト用
    // etv.devicePixelRatio = 1.5;
    // innerWidth  = window.innerWidth  / etv.devicePixelRatio;
    // innerHeight = window.innerHeight / etv.devicePixelRatio;

    // アプリケーションサイズをウィンドウサイズと同サイズに設定する（全画面化）
    // canvasの解像度を物理解像度と等しくするため、devicePixelRatioを掛ける
    etv.appWidth  = innerWidth  * etv.devicePixelRatio;
    etv.appHeight = innerHeight * etv.devicePixelRatio;

    // canvasの内部解像度を物理解像度に設定
    app.resize(etv.appWidth, etv.appHeight);

    // canvasの表示解像度を論理解像度に設定
    app.canvas.canvas.style.width  = innerWidth  + "px";
    app.canvas.canvas.style.height = innerHeight + "px";

    // マウスとタッチの座標を補正
    // (tmlib.jsのfitWindowでやっている処理)
    app.mouse._mousemove = app.mouse._mousemoveScale;
    app.touch._touchmove = app.touch._touchmoveScale;


    // ウィンドウが縦長かどうかを判定する
    etv.isWindowPortrait = etv.appWidth <= etv.appHeight;

    // ウィンドウの短辺長さを、フィールド部の正方形の長さにする
    var shortSideLength = Math.min(etv.appWidth, etv.appHeight);
    etv.worldWidth = etv.worldHeight = shortSideLength;
    // ただしinfo,buttonパネル用に最低限のサイズが確保できないときは、確保できるようフィールド部を定義する
    var longSideLength = Math.max(etv.appWidth, etv.appHeight);
    if (longSideLength - shortSideLength < etv.LEAST_PANEL_SIZE * 2) {
      etv.worldWidth = etv.worldHeight = longSideLength - etv.LEAST_PANEL_SIZE * 2;
    }

    // セル大きさの再計算
    // リサイズを考慮し、マージンは固定値ではなく、他のセル幅の半分になるようにする
    etv.cellWidth  = (etv.worldWidth)  / (etv.cols + 1);   // セルの幅(仮)
    etv.cellHeight = (etv.worldHeight) / (etv.rows + 1);   // セルの高さ(仮)
    etv.worldMarginWidth = etv.cellWidth / 2;
    etv.worldMarginHeight = etv.cellHeight / 2;
    etv.matterSize = Math.min(etv.cellWidth, etv.cellHeight);

    // オプションダイアログを画面方向に応じたclassを設定する
    if (!isLocalSettingsChange) {
      divOption.style.visibility = "hidden";
      divOption.className = etv.isWindowPortrait ? "portrait" : "landscape";
      showOptionDlg(false, true);
    }

    // 背景テクスチャを生成する
    ViewUtl.initBackTexture();

    // レイヤーshapeの作成
    // TODO: shapeのリサイズだと座標がズレてしまうため、shapeのインスタンスを破棄・再作成で対応しているが、
    //       メモリの無駄になりそうなので、座標ズレの根本原因を発見して、インスタンス使いまわすようにする。

    // 情報部 (ベース情報 < ゲーム状態情報)
    var infoWidth = etv.isWindowPortrait ? etv.appWidth : (etv.appWidth - etv.worldWidth) / 2;
    var infoHeight = etv.isWindowPortrait ? (etv.appHeight - etv.worldHeight) / 2 : etv.appHeight;

    self.canvas.removeChild(self.shpInfo);
    self.shpInfo = new tm.app.Shape({ width: infoWidth, height: infoHeight });
    self.canvas.addChild(self.shpInfo);

    self.canvas.removeChild(self.shpInfoState);
    self.shpInfoState = new tm.app.Shape({ width: infoWidth, height: infoHeight });
    self.canvas.addChild(self.shpInfoState);

    // メイン部 (ワールド < ワールドカバー < ワールドディマー < グリッド < マター < マーカー < エフェクト)
    self.canvas.removeChild(self.shpWorld);
    self.shpWorld = new tm.app.Shape({ width: etv.worldWidth, height: etv.worldHeight });
    self.canvas.addChild(self.shpWorld);

    self.canvas.removeChild(self.shpWorldCover);
    self.shpWorldCover = new tm.app.Shape({ width: etv.worldWidth, height: etv.worldHeight });
    self.canvas.addChild(self.shpWorldCover);

    self.canvas.removeChild(self.shpWorldDimmer);
    self.shpWorldDimmer = new tm.app.Shape({ width: etv.worldWidth, height: etv.worldHeight });
    self.canvas.addChild(self.shpWorldDimmer);

    self.canvas.removeChild(self.shpGrid);
    self.shpGrid = new tm.app.Shape({ width: etv.worldWidth, height: etv.worldHeight });
    self.canvas.addChild(self.shpGrid);

    self.canvas.removeChild(self.shpMatter);
    self.shpMatter = new tm.app.Shape({ width: etv.worldWidth, height: etv.worldHeight });
    self.canvas.addChild(self.shpMatter);

    self.canvas.removeChild(self.shpMarker);
    self.shpMarker = new tm.app.Shape({ width: etv.worldWidth, height: etv.worldHeight });
    self.canvas.addChild(self.shpMarker);

    self.canvas.removeChild(self.shpEffect);
    self.shpEffect = new tm.app.Shape({ width: etv.appWidth, height: etv.appHeight });
    // エフェクトをボタンの前面に出すため、後で配置する
    // self.canvas.addChild(self.shpEffect);


    // ボタン部
    self.canvas.removeChild(self.shpButtons);
    var buttonsWidth = etv.isWindowPortrait ? etv.appWidth : (etv.appWidth - etv.worldWidth) / 2;
    var buttonsHeight = etv.isWindowPortrait ? (etv.appHeight - etv.worldHeight) / 2 : etv.appHeight;
    self.shpButtons = new tm.app.Shape({ width: buttonsWidth, height: buttonsHeight });
    self.canvas.addChild(self.shpButtons);

    // 配置位置のセット
    self.shpWorld.x = self.shpWorldCover.x = self.shpWorldDimmer.x = self.shpGrid.x = self.shpMatter.x = self.shpMarker.x = self.shpEffect.x = etv.appWidth / 2;
    self.shpWorld.y = self.shpWorldCover.y = self.shpWorldDimmer.y = self.shpGrid.y = self.shpMatter.y = self.shpMarker.y = self.shpEffect.y = etv.appHeight / 2;
    self.shpInfo.x = self.shpInfoState.x = etv.isWindowPortrait ? etv.appWidth / 2 : infoWidth / 2;
    self.shpInfo.y = self.shpInfoState.y = etv.isWindowPortrait ? infoHeight / 2 : etv.appHeight / 2;
    self.shpButtons.x = etv.isWindowPortrait ? etv.appWidth / 2 : buttonsWidth / 2 + infoWidth + etv.worldWidth;
    self.shpButtons.y = etv.isWindowPortrait ? buttonsHeight / 2 + infoHeight + etv.worldHeight : etv.appHeight / 2;

    // エフェクトの描画オフセット座標
    etv.effOfsX = etv.isWindowPortrait ? (shortSideLength - etv.worldWidth) / 2 : infoWidth;
    etv.effOfsY = etv.isWindowPortrait ? infoHeight : (shortSideLength - etv.worldHeight) / 2;

    // shape属性のセット
    self.shpWorld.setInteractive(true).setBoundingType("rect");
    self.shpWorldCover.setInteractive(false).setBoundingType("rect");
    self.shpWorldDimmer.setInteractive(false).setBoundingType("rect");
    self.shpGrid.setInteractive(false).setBoundingType("rect");
    self.shpMatter.setInteractive(false).setBoundingType("rect");
    self.shpMarker.setInteractive(false).setBoundingType("rect");
    self.shpEffect.setInteractive(false).setBoundingType("rect");

    self.shpWorldCover.canvas.clearColor(etv.COLOR_OPAQUE);
    self.shpWorldDimmer.canvas.clearColor(etv.COLOR_OPAQUE);
    self.shpGrid.canvas.clearColor(etv.COLOR_OPAQUE);
    self.shpMatter.canvas.clearColor(etv.COLOR_OPAQUE);
    self.shpMarker.canvas.clearColor(etv.COLOR_OPAQUE);
    self.shpEffect.canvas.clearColor(etv.COLOR_OPAQUE);

    self.shpInfo.setInteractive(true).setBoundingType("rect");
    self.shpInfoState.setInteractive(false).setBoundingType("rect");
    ViewUtl.clearTexture(self.shpInfo, etv.backTexture);
    self.shpInfoState.canvas.clearColor(etv.COLOR_OPAQUE);

    self.shpButtons.setInteractive(true).setBoundingType("rect");
    ViewUtl.clearTexture(self.shpButtons, etv.backTexture);

    // ワールドカバーの描画
    if (etv.COSTUME) {
      etv.drawWorldCover(self.shpWorldCover);
      etv.drawWorldDimmer(self.shpWorldDimmer);
    }

    // ワールドの描画
    etv.drawWorld(self.shpWorld);

    // グリッドの描画
    etv.drawGrid(self.shpGrid);

    // マターの再配置
    for (var col = 0; col < etv.cols; col++) {
      for (var row = 0; row < etv.rows; row++) {
        var side = gm.gameState.worldState[col][row];
        if (side != SIDE.O) {
          etv.drawMatter(self.shpMatter, new PosLog(col, row), side, false);
        }
      }
    }
    // 直前アピアマーカー再描画
    if (self.prvPlayPosLog != null) {
      ViewUtl.drawLastMarker(self.shpMarker, self.prvPlayPosLog);
    }
    // エターナリーマーカーの再描画
    if (gm.gameState.eternallyPos != null) {
      ViewUtl.drawEternallyMarker(self.shpMarker, gm.gameState.eternallyPos);
    }
    // 仮アピアマーカーの再描画
    if (etv.pointState == etv.POINT_STATE_CONFIRM) {
      etv.drawMatter(self.shpMarker, etv.tmpAppearPosLog, gm.gameState.nextSide, true);
      // TODO: 仮にエターナリーマーカーを上書きしているので、別のマーカーにしたいならそうする
      ViewUtl.drawEternallyMarker(this.shpMarker, etv.tmpAppearPosLog);
    }
    // Estimate結果マーカーの再描画（estimate状態のときのみ）
    if (etv.estimatedResult != null) {
      ViewUtl.drawEstimateMarker(this.shpMarker);
    }

    // エフェクトキューに入っているエフェクトの描画対象レイヤを更新する
    // TODO:でもリサイズ後のエフェクト継続が効かない
    for (var i = 0; i < self.effects.length; i++) {
      self.effects[i].layer = self.shpEffect;
    }

    // イベントリスナの登録
    self.shpWorld.onpointingend = self.worldPointingEnd.bind(self);
    self.shpWorld.update = self.worldUpdate.bind(self);

    // ボタン部の配置と描画
    self.setButtonPanel(self);

    // エフェクトレイヤの配置（ボタンの上にエフェクトを掛けるため、ここで配置）
    self.canvas.addChild(self.shpEffect);

    // 情報部の配置/描画
    self.setInfoPanel(self, true);

  },

  // ボタン部の配置と描画　※ボタンはshpButtonsではなくappに直接配置している
  // TODO: 配置変更時の部分と、2Pointモードでの状態変化時の描画とに分割する
  setButtonPanel: function(self) {
    // 背景テクスチャの再描画
    ViewUtl.clearTexture(self.shpButtons, etv.backTexture);

    // ボタンの並び数
    var BUTTON_NUM = 5;
    // 通常操作ボタン
    var buttons = [self.btnUndo, self.btnPass, self.btnSoundOnOff, self.btnOption, self.btnGiveUp, self.btnHelp, ];
    // 2point用操作ボタン
    var buttons2p = [self.btn2pOk, self.btn2pCancel];
    // ジャッジメント確認用操作ボタン
    var buttonsJudge = [self.btnOk, self.btnNg];

    // 変更前ボタンの削除
    for (var i = 0; i < buttons.length; i++) {
      self.canvas.removeChild(buttons[i]);
    }
    // 2Point用ボタンの削除
    for (var i = 0; i < buttons2p.length; i++) {
      self.canvas.removeChild(buttons2p[i]);
    }
    // ジャッジメント確認用ボタンの削除
    for (var i = 0; i < buttonsJudge.length; i++) {
      self.canvas.removeChild(buttonsJudge[i]);
    }
    // 終了ボタンの削除
    self.canvas.removeChild(self.btnEnd);


    // 画面サイズ・向きに応じた座標の計算
    var buttonWidth = etv.isWindowPortrait ?
                        etv.appWidth / BUTTON_NUM :
                        Math.max(etv.LEAST_PANEL_SIZE, (etv.appWidth - etv.worldWidth) / 2);
    var buttonHeight = etv.isWindowPortrait ?
                        Math.max(etv.LEAST_PANEL_SIZE, (etv.appHeight - etv.worldHeight) / 2) :
                        etv.appHeight / BUTTON_NUM;
    var buttonAX = etv.isWindowPortrait ? buttonWidth / 2: self.shpButtons.x;
    var buttonAY = etv.isWindowPortrait ? self.shpButtons.y : buttonHeight / 2;
    var buttonDeltaX = etv.isWindowPortrait ? buttonWidth : 0;
    var buttonDeltaY = etv.isWindowPortrait ? 0 : buttonHeight;
    var buttonTextPx = parseInt(buttonWidth / "Estimate".length * 1.8);  // 倍率1.8は実験値

    // ボタンオブジェクトの生成
    if (gm.state == gm.STATE_CONTACT && etv.pointState == etv.POINT_STATE_SELECT) {
      self.btnUndo = tm.app.GlossyButton(buttonWidth, buttonHeight, "green", "Undo");
      self.btnPass = tm.app.GlossyButton(buttonWidth, buttonHeight, "green", "Pass");
      self.btnSoundOnOff = tm.app.GlossyButton(buttonWidth, buttonHeight, "green", "Sound");
      self.btnOption = tm.app.GlossyButton(buttonWidth, buttonHeight, "green", "Option");
      // 投了・ヘルプボタンは1つのボタンを半分に分割する
      self.btnGiveUp = tm.app.GlossyButton(buttonWidth  / (etv.isWindowPortrait ? 1 : 2), 
                                           buttonHeight / (etv.isWindowPortrait ? 2 : 1), "green", "GiveUp");
      self.btnHelp = tm.app.GlossyButton(buttonWidth  / (etv.isWindowPortrait ? 1 : 2), 
                                         buttonHeight / (etv.isWindowPortrait ? 2 : 1), "green", "Help");
    }
    else if (gm.state == gm.STATE_CONTACT && etv.pointState == etv.POINT_STATE_CONFIRM) {
      // OKボタンは画面の3/4(通常ボタン3.5個分)、Cancelボタンは画面の1/4(通常ボタン1.5個分) （OKの方が押す頻度が高いので押しやすく大きく）
      self.btn2pOk     = tm.app.GlossyButton(etv.isWindowPortrait ? buttonWidth * 3.5 : buttonWidth,
                                             etv.isWindowPortrait ? buttonHeight : buttonHeight * 3.5, "#3333BB", "OK");
      self.btn2pCancel = tm.app.GlossyButton(etv.isWindowPortrait ? buttonWidth * 1.5 : buttonWidth,
                                             etv.isWindowPortrait ? buttonHeight : buttonHeight * 1.5, "#BB3333", "Cancel");
    }
    else if (gm.state == gm.STATE_CONFIRM_JUDGE) {
      // OKは通常ボタン3個分, NGボタンは2個分
      self.btnOk = tm.app.GlossyButton(etv.isWindowPortrait ? buttonWidth * 3 : buttonWidth,
                                       etv.isWindowPortrait ? buttonHeight : buttonHeight * 3, "#2222BB", "OK");
      self.btnNg = tm.app.GlossyButton(etv.isWindowPortrait ? buttonWidth * 2 : buttonWidth,
                                       etv.isWindowPortrait ? buttonHeight : buttonHeight * 2, "#BB2222", "NG");
    }
    else if (gm.state == gm.STATE_GAME_OVER) {
      // 終了ボタン(通常ボタン4.5個分(フルに5個分だとボタンであることが分かりづらい))
      self.btnEnd = tm.app.GlossyButton(etv.isWindowPortrait ? buttonWidth * 4.5 : buttonWidth,
                                        etv.isWindowPortrait ? buttonHeight : buttonHeight * 4.5, "#0000AA", "Next");
    }

    // 変更後ボタンの配置
    if (gm.state == gm.STATE_CONTACT && etv.pointState == etv.POINT_STATE_SELECT) {
      var buttons = [self.btnUndo, self.btnPass, self.btnSoundOnOff, self.btnOption, self.btnGiveUp, self.btnHelp ];
      for (var i = 0; i < buttons.length; i++) {
        self.canvas.addChild(buttons[i]);
        buttons[i].label.setFontFamily(etv.FONT_FAMILY).setFontSize(buttonTextPx);
        var HALF_BTN_IDX = 5 - 1;  // 5番目のボタンは半分
        if (i < HALF_BTN_IDX) {  // Undo～Optionまでは普通の横並び
          buttons[i].setPosition(buttonAX + buttonDeltaX * i, buttonAY + buttonDeltaY * i);
        }
        else {  // GiveUp, Helpは大きさ半分なので、同じ場所に半分ずらして配置
          buttons[i].setPosition(buttonAX + buttonDeltaX * HALF_BTN_IDX + ( etv.isWindowPortrait ? 0 : (buttonWidth / 2) * (i - HALF_BTN_IDX) - (buttonWidth / 4)), 
                                 buttonAY + buttonDeltaY * HALF_BTN_IDX + (!etv.isWindowPortrait ? 0 : (buttonHeight  / 2) * (i - HALF_BTN_IDX) - (buttonHeight  / 4)));
          if (!etv.isWindowPortrait) {
            // 横画面時の半分ボタンはフォントサイズを小さくする
            buttons[i].label.setFontFamily(etv.FONT_FAMILY).setFontSize(buttonTextPx / 2);
          }
        }
        buttons[i].setInteractive(true);
      }
    }
    else if (gm.state == gm.STATE_CONTACT && etv.pointState == etv.POINT_STATE_CONFIRM) {
      var buttons2p = [self.btn2pOk, self.btn2pCancel];
      for (var i = 0; i < buttons2p.length; i++) {
        self.canvas.addChild(buttons2p[i]);
        buttons2p[i].label.setFontFamily(etv.FONT_FAMILY).setFontSize(buttonTextPx);
        buttons2p[i].setInteractive(true);
      }
      // OKの方が押す頻度が高いので押しやすくするため、ユーザーに近い下or右(右利きの人の方が多い)に配置
      self.btn2pCancel.setPosition(buttonAX + buttonDeltaX * 0.25, buttonAY + buttonDeltaY * 0.25);
      self.btn2pOk.setPosition(buttonAX + buttonDeltaX * 2.75, buttonAY + buttonDeltaY * 2.75);
    }
    else if (gm.state == gm.STATE_WAIT_JUDGE) {
      // 確認テキストの描画(真ん中：3個目のボタン位置に表示)
      self.shpButtons.canvas.fillStyle = "purple";
      ViewUtl.fillTextAutoFit(self.shpButtons, "判定中...",
                              buttonDeltaX * 2, buttonDeltaY * 2, buttonWidth, buttonHeight,
                              etv.FONT_FAMILY, buttonTextPx / 2);
    }
    else if (gm.state == gm.STATE_CONFIRM_JUDGE) {
      var buttonsJudge = [self.btnOk, self.btnNg];
      for (var i = 0; i < buttonsJudge.length; i++) {
        self.canvas.addChild(buttonsJudge[i]);
        buttonsJudge[i].label.setFontFamily(etv.FONT_FAMILY).setFontSize(buttonTextPx);
        buttonsJudge[i].setInteractive(true);
      }
      self.btnOk.setPosition(buttonAX + buttonDeltaX * 1.0, buttonAY + buttonDeltaY * 1.0);
      self.btnNg.setPosition(buttonAX + buttonDeltaX * 3.5, buttonAY + buttonDeltaY * 3.5);
    }
    else if (gm.state == gm.STATE_GAME_OVER) {
      // 終了ボタンの配置
      self.canvas.addChild(self.btnEnd);
      // ボタンエリア全体をボタンにする
      self.btnEnd.setPosition(buttonAX + buttonDeltaX * 2, buttonAY + buttonDeltaY * 2);
      self.btnEnd.label.setFontFamily(etv.FONT_FAMILY).setFontSize(buttonTextPx);
      self.btnEnd.setInteractive(true);
    }

    // ボタンへのイベントリスナセット
    // コンタクト状態のボタン
    if (gm.state == gm.STATE_CONTACT && etv.pointState == etv.POINT_STATE_SELECT) {
      self.btnUndo.onpointingend = function(e) {
        if (self.btnUndo.isHitPoint(e.pointing.x, e.pointing.y)) {
          // アンドゥ
          // TODO: 直前のPlayerの手番に戻すため2手戻すとしているが、CPU考慮中にundo押されることを考慮する
          gm.undo(2);
          gm.undoCount++;
          self.effects.push(new EtnToast(self.shpEffect, "Undo!", 1000));
          etv.playSE("se_cancel");
        }
      }
      self.btnPass.onpointingend = function(e) {
        if (self.btnPass.isHitPoint(e.pointing.x, e.pointing.y) && gm.gameState.nextSide == gm.userSide) {  // ユーザーの手番の時のみ有効) {
          // パス
          gm.processPlayEvent(new Action(gm.gameState.nextSide, Action.PASS, null, null));
        }
      }
      self.btnGiveUp.onpointingend = function(e) {
        if (self.btnGiveUp.isHitPoint(e.pointing.x, e.pointing.y) && gm.gameState.nextSide == gm.userSide) {  // ユーザーの手番の時のみ有効
          // 投了確認を表示
          divGiveUpConfirm.style.visibility = "visible";
          etv.playSE("se_push");
        }
      }
      self.btnSoundOnOff.onpointingend = function(e) {
        if (self.btnSoundOnOff.isHitPoint(e.pointing.x, e.pointing.y)) {
          // サウンドOn/Offを切り替える
          etv.soundOn = !etv.soundOn;
          if (etv.soundOn) {
            etv.playSE("se_push");
            etv.playBGM("bgm");
          }
          else {
            etv.stopBGM();
          }
          self.effects.push(new EtnToast(self.shpEffect, "Sound " + (etv.soundOn ? "ON♪" : "OFF."), 2000));
        }
      };
      self.btnOption.onpointingend = function(e) {
        if (self.btnOption.isHitPoint(e.pointing.x, e.pointing.y)) {
          etv.playSE("se_push");
          // オプションウィンドウの表示
          openOptionDlg();
        }
      };
      self.btnHelp.onpointingend = function(e) {
        if (self.btnHelp.isHitPoint(e.pointing.x, e.pointing.y)) {
          // ヘルプの表示/非表示
          showHelp(ETN_HELP.HELP);
          // var helpDiv = document.getElementById('help');
          // helpDiv.style.display = (helpDiv.style.display == "block" ? "none" : "block");
          etv.playSE("se_push");
        }
      };
    }
    // 2pointモードの確認ボタン
    else if (gm.state == gm.STATE_CONTACT && etv.pointState == etv.POINT_STATE_CONFIRM) {
      self.btn2pOk.onpointingend = function(e) {
        if (self.btn2pOk.isHitPoint(e.pointing.x, e.pointing.y)) {
          // 仮アピアの確定
          etv.pointState = etv.POINT_STATE_SELECT;
          self.setButtonPanel(self);
          gm.processPlayEvent(new Action(gm.gameState.nextSide, Action.PLAY, etv.tmpAppearPosLog.col, etv.tmpAppearPosLog.row));
        }
      };
      self.btn2pCancel.onpointingend = function(e) {
        if (self.btn2pCancel.isHitPoint(e.pointing.x, e.pointing.y)) {
          // 仮アピアのキャンセル
          etv.pointState = etv.POINT_STATE_SELECT;
          self.setButtonPanel(self);
          etv.playSE("se_cancel");
          // 前回仮アピアマーカーをクリアする
          if (etv.tmpAppearPosLog != null) {
            var tmpAppearPosPhs = ViewUtl.toPosPhs(etv.tmpAppearPosLog);
            self.shpMarker.canvas.clear(tmpAppearPosPhs.x, tmpAppearPosPhs.y, etv.cellWidth, etv.cellHeight);
          }

        }
      };
    }
    // ジャッジメント確認ボタン
    else if (gm.state == gm.STATE_CONFIRM_JUDGE) {
      self.btnOk.onpointingend = function(e) {
        if (self.btnOk.isHitPoint(e.pointing.x, e.pointing.y)) {
          // BGM停止
          etv.stopBGM();
          // 終局同意
          gm.processPlayEvent(new Action(gm.gameState.nextSide, Action.FIN_OK, null, null));
        }
      };
      self.btnNg.onpointingend = function(e) {
        if (self.btnNg.isHitPoint(e.pointing.x, e.pointing.y)) {
          // estimate結果マーカーのクリア(全マーカーをクリアしているが、その後の処理で必要なマーカーは再描画される?)
          self.shpMarker.canvas.clear();
          etv.estimatedResult = null;
          etv.playSE("se_cancel");

          // 終局非同意
          gm.processPlayEvent(new Action(gm.gameState.nextSide, Action.FIN_NG, null, null));
        }
      };
    }
    // ジャッジメント結果終了ボタン
    else if (gm.state == gm.STATE_GAME_OVER) {
      self.btnEnd.onpointingend = function(e) {
        if (self.btnEnd.isHitPoint(e.pointing.x, e.pointing.y)) {
          // 対局結果登録・Goodies取得処理が完了している場合
          if (gm.dataRegistDone) {
            // 未表示の獲得特典がある場合は表示
            if (gm.judgeResult.getGoodies.length > 0) {
              var goodies = gm.judgeResult.getGoodies.shift();

              // 獲得特典の表示
              // 2度目以降の表示でもCSSアニメーションを再開させるためにdivを更新して使用する
              // http://csspro.digitalskill.jp/%E3%83%81%E3%83%A5%E3%83%BC%E3%83%88%E3%83%AA%E3%82%A2%E3%83%AB/css-webkit-%E3%82%A2%E3%83%8B%E3%83%A1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3/
              var goodiesDivBefore = document.getElementById('goodies');
              var goodiesDiv = goodiesDivBefore.cloneNode(true);
              goodiesDivBefore.parentNode.insertBefore(goodiesDiv, goodiesDivBefore);
              goodiesDivBefore.parentNode.removeChild(goodiesDivBefore);
              goodiesDiv.innerHTML = goodies.kindName + ": " + goodies.goodiesName + " " + goodies.getMessage;
              goodiesDiv.style.display = "block";
              etv.playSE("se_goodies");
            }
            // 未表示の獲得特典がなければ結果画面に遷移
            else {
              // ページ遷移する
              window.onbeforeunload = null;  // 対局中ページ遷移警告を解除する
              // modeはGETパラメータで良いが、cpuLevelはPOSTパラメータで渡したいため、form要素を作ってsubmitする
              // http://pk-brothers.com/547/
              var form = document.createElement( 'form' );
              document.body.appendChild( form );
              var input1 = document.createElement( 'input' );
              input1.setAttribute( 'type' , 'hidden' );
              input1.setAttribute( 'name' , 'cpuLevel' );
              input1.setAttribute( 'value' , gm.cpuLevel );
              form.appendChild( input1 );
              var input2 = document.createElement( 'input' );
              input2.setAttribute( 'type' , 'hidden' );
              input2.setAttribute( 'name' , 'winner' );
              input2.setAttribute( 'value' , gm.judgeResult.winner );
              form.appendChild( input2 );
              var input3 = document.createElement( 'input' );
              input3.setAttribute( 'type' , 'hidden' );
              input3.setAttribute( 'name' , 'size' );
              input3.setAttribute( 'value' , gm.gameState.worldSizeCol );
              form.appendChild( input3 );
              form.setAttribute( 'action' , "result.php?ver=" + resultVer +
                                            (gm.gameMode != 0 ? ("&md=" + gm.gameMode) : "") +
                                            (gm.isKidsMode ? "&kids" : "")
                               );
              form.setAttribute( 'method' , 'post' );
              form.submit();
              // location.href = "result.php" + gm.gameMode != 0 ? ("?md=" + gm.gameMode) : "";
            }
          }
          else {
            alert("対局結果登録中です。しばらくお待ちください。");
          }
        }
      };
    }
    // 投了確認ボタン(htmlボタン)
    btnGiveUpOk.addEventListener("click", function(){
      // 投了OK: 投了する
      gm.processPlayEvent(new Action(gm.gameState.nextSide, Action.GIVEUP, null, null));
      divGiveUpConfirm.style.visibility = "hidden";
    })
    btnGiveUpNg.addEventListener("click", function(){
      divGiveUpConfirm.style.visibility = "hidden";
    })


  },

  // 情報部の配置と描画
  // drawAllInfo = trueのとき、全情報描画する(初期配置&サイズ変更時)。falseのとき、Play状態変化時の情報描画のみ
  setInfoPanel: function(self, drawAllInfo) {
    var INFO_SPACE = 2;  // info部の各パネル間のスペース
    var COMMON_INFO_SIZE = etv.matterSize / 2; // info部中央の共通情報部の大きさ

    if (drawAllInfo) {
      // 各情報部の配置座標 ※添字0=共通部
      etv.infoX = new Array(3);
      etv.infoY = new Array(3);
      etv.infoWidth = new Array(3);
      etv.infoHeight = new Array(3);

      // 背景テクスチャの再描画
      ViewUtl.clearTexture(self.shpInfo, etv.backTexture);

      // ウィンドウの描画
      // 座標値の計算
      if (etv.isWindowPortrait == true) {
        // 共通情報部
        etv.infoX[0] = self.shpInfo.width / 2 - COMMON_INFO_SIZE;
        etv.infoY[0] = 0 + INFO_SPACE;
        etv.infoWidth[0] = COMMON_INFO_SIZE * 2;
        etv.infoHeight[0] = self.shpInfo.height - INFO_SPACE * 2;
        // sideA情報部
        etv.infoX[SIDE.A] = 0 + INFO_SPACE;
        etv.infoY[SIDE.A] = 0 + INFO_SPACE;
        // sideB情報部
        etv.infoX[SIDE.B] = self.shpInfo.width / 2 + COMMON_INFO_SIZE + INFO_SPACE;
        etv.infoY[SIDE.B] = 0 + INFO_SPACE;
        // sideA, B共通
        etv.infoWidth[SIDE.A] = etv.infoWidth[SIDE.B] = self.shpInfo.width / 2 - COMMON_INFO_SIZE - INFO_SPACE * 2;
        etv.infoHeight[SIDE.A] = etv.infoHeight[SIDE.B] = self.shpInfo.height - INFO_SPACE * 2;
      }
      else {
        // 共通情報部
        etv.infoX[0] = 0 + INFO_SPACE;
        etv.infoY[0] = self.shpInfo.height / 2 - COMMON_INFO_SIZE;
        etv.infoWidth[0] = self.shpInfo.width - INFO_SPACE * 2;
        etv.infoHeight[0] = COMMON_INFO_SIZE * 2;
        // sideA情報部
        etv.infoX[SIDE.A] = 0 + INFO_SPACE;
        etv.infoY[SIDE.A] = 0 + INFO_SPACE;
        // sideB情報部
        etv.infoX[SIDE.B] = 0 + INFO_SPACE;
        etv.infoY[SIDE.B] = self.shpInfo.height / 2 + COMMON_INFO_SIZE + INFO_SPACE;
        // sideA, B共通
        etv.infoWidth[SIDE.A] = etv.infoWidth[SIDE.B] = self.shpInfo.width - INFO_SPACE * 2;
        etv.infoHeight[SIDE.A] = etv.infoHeight[SIDE.B] = self.shpInfo.height / 2 - COMMON_INFO_SIZE - INFO_SPACE * 2;
      }
      // 情報ウィンドウの描画
      self.shpInfo.canvas.globalAlpha = 0.7;
      self.shpInfo.canvas.fillStyle = "#1BB8BC";
      for (var s = 0; s <= SIDE.B; s++) {
        self.shpInfo.canvas.fillRect(etv.infoX[s], etv.infoY[s], etv.infoWidth[s], etv.infoHeight[s]);
      }
      self.shpInfo.canvas.globalAlpha = 1.0;

      // 共通情報表示
      // クリエイターA・Bの情報表示
      self.shpInfo.canvas.fillStyle = "white";
      // アバターサイズ（正方形）
      // abatarSize = Math.min(etv.infoWidth[SIDE.A], etv.infoHeight[SIDE.A]) - INFO_SPACE * 4;

      for (var side = SIDE.A; side <= SIDE.B; side++) {
        // 縦横比を保持して拡大縮小
        var abatarRatio = Math.min(etv.infoWidth[SIDE.A] / etv.abatarImg[side].width, etv.infoHeight[SIDE.A] / etv.abatarImg[side].height);
        var abatarWidth = abatarRatio * etv.abatarImg[side].width;
        var abatarHeight = abatarRatio * etv.abatarImg[side].height;

        // アバター画像
        self.shpInfo.canvas.drawImage(etv.abatarImg[side],
                                      etv.infoX[side] + (etv.infoWidth[side] - abatarWidth) / 2,
                                      etv.infoY[side] + (etv.infoHeight[side] - abatarHeight) / 2,
                                      abatarWidth, abatarHeight);

        // 以降の情報は、アバター画像と重なる場合の見易さを考慮して、影付きで表示
        self.shpInfo.canvas.context.save();
        self.shpInfo.canvas.context.shadowColor = "black";
        self.shpInfo.canvas.context.shadowOffsetX = 3;
        self.shpInfo.canvas.context.shadowOffsetY = 3;
        self.shpInfo.canvas.context.shadowBlur = 3;

        // マター画像（これも影付きで）
        ViewUtl.drawSpriteMatterDirectly(self.shpInfo, new ViewUtl.PosPhs(etv.infoX[side], etv.infoY[side]), side);

        // クリエイター名
        var creatorNameFontSize = etv.matterSize / 2;
        ViewUtl.fillTextAutoFit(self.shpInfo, gm.playerName[side],
                                etv.infoX[side], etv.infoY[side] + etv.infoHeight[side] - creatorNameFontSize * 1.5,
                                etv.infoWidth[side], creatorNameFontSize * 1.5,
                                etv.FONT_FAMILY, creatorNameFontSize);

        // 影付き解除
        self.shpInfo.canvas.context.restore();
      }

      // shpInfoを付加機能ボタンとして使用する（以下3状態をトグル）
      // ①通常表示    （world:  表示, matter:  表示)
      // ②背景確認    （world:  表示, matter:非表示) ：主にドレスアップ用
      // ③背景非表示  （world:非表示, matter:  表示) ：ゲームオブジェクトの視認性確保用
      self.shpInfo.onpointingend = function(e) {
        if (self.shpInfo.isHitPoint(e.pointing.x, e.pointing.y)) {
          // モード変更
          etv.displayMode++;
          if (etv.displayMode > etv.DISPLAY_MODE_WORLD_OFF) {
            etv.displayMode = etv.DISPLAY_MODE_NORMAL;
          }
          var modeStr;
          switch(etv.displayMode) {
            case etv.DISPLAY_MODE_NORMAL:
              modeStr = "通常表示";
              self.shpMatter.setVisible(true);
              self.shpMarker.setVisible(true);
              self.shpGrid.setVisible(true);
              self.shpWorld.setVisible(true);
              self.shpWorldCover.setVisible(true);
              self.shpWorldDimmer.setVisible(true);
              break;
            case etv.DISPLAY_MODE_WORLD_VIEW:
              modeStr = "背景確認モード";
              self.shpMatter.setVisible(false);
              self.shpMarker.setVisible(false);
              self.shpGrid.setVisible(false);
              self.shpWorld.setVisible(true);
              self.shpWorldCover.setVisible(true);
              self.shpWorldDimmer.setVisible(false);
              break;
            case etv.DISPLAY_MODE_WORLD_OFF:
              modeStr = "背景非表示モード";
              self.shpMatter.setVisible(true);
              self.shpMarker.setVisible(true);
              self.shpGrid.setVisible(true);
              self.shpWorld.setVisible(false);
              self.shpWorldCover.setVisible(false);
              self.shpWorldDimmer.setVisible(false);
              break;
          }
          etv.playSE("se_push");
          self.effects.push(new EtnToast(self.shpEffect, modeStr, 3000));
        }
      };
    }

    // 情報変化時描画
    // まず全クリアする(遅いなら範囲を限定してクリアする)
    self.shpInfoState.canvas.clear();

    // nextSideインジケーター
    self.shpInfoState.canvas.context.save();
    self.shpInfoState.canvas.fillStyle = "yellow";
    var nextSideIndicatorThickness = 5;
    self.shpInfoState.canvas.setShadow("yellow", 0, 0, 7);
    if (etv.isWindowPortrait)
      self.shpInfoState.canvas.fillRect(etv.infoX[0] + (gm.gameState.nextSide == SIDE.A ? 0 : etv.infoWidth[0] - nextSideIndicatorThickness),
                                        etv.infoY[0],
                                        nextSideIndicatorThickness,
                                        etv.infoHeight[0]);
    else
      self.shpInfoState.canvas.fillRect(etv.infoX[0],
                                        etv.infoY[0] + (gm.gameState.nextSide == SIDE.A ? 0 : etv.infoHeight[0] - nextSideIndicatorThickness),
                                        etv.infoWidth[0],
                                        nextSideIndicatorThickness);
    self.shpInfoState.canvas.context.restore();

    // 以降の情報は、アバター画像と重なる場合の見易さを考慮して、影付きで表示
    self.shpInfoState.canvas.context.save();
    self.shpInfoState.canvas.context.shadowColor = "black";
    self.shpInfoState.canvas.context.shadowOffsetX = 3;
    self.shpInfoState.canvas.context.shadowOffsetY = 3;
    self.shpInfoState.canvas.context.shadowBlur = 3;

    // プレイ数
    var playCountFontSize = etv.matterSize / 2;
    self.shpInfoState.canvas.fillStyle = "white";
    self.shpInfoState.canvas.context.textAlign = "end";
    ViewUtl.fillTextAutoFit(self.shpInfoState, gm.gameState.playCount.toString(),
                            etv.infoX[0] + etv.infoWidth[0] - nextSideIndicatorThickness, etv.infoY[0],
                            etv.infoWidth[0] - nextSideIndicatorThickness * 2, playCountFontSize,
                            etv.FONT_FAMILY, playCountFontSize);
    self.shpInfoState.canvas.context.textAlign = "start";

    for (var side = SIDE.A; side <= SIDE.B; side++) {
      // 累計バニッシュ数（右寄せ表示：alignの設定だけでなく、基点座標も矩形の右を指定する）（これも影付き）
      if (gm.state != gm.STATE_GAME_OVER) {
        var vanishCountFontSize = etv.matterSize / 2;
        self.shpInfoState.canvas.context.textAlign = "end";
        ViewUtl.fillTextAutoFit(self.shpInfoState, gm.gameState.vanishCount[side].toString(),
                                etv.infoX[side] + etv.infoWidth[side], etv.infoY[side],
                                vanishCountFontSize * 3, vanishCountFontSize,
                                etv.FONT_FAMILY, vanishCountFontSize);
        self.shpInfoState.canvas.context.textAlign = "start";
      }

      // コンタクト終了時：スコア表示
      if (gm.state == gm.STATE_GAME_OVER) {
        if (etv.estimatedResult != null) {  // 投了の場合はestimateしてないので飛ばす
          var resultFontSize = etv.matterSize / 2;
          ViewUtl.fillTextAutoFit(self.shpInfoState, etv.estimatedResult.sideScoreStr[side],
                                  etv.infoX[side], etv.infoY[side],
                                  etv.infoWidth[side], resultFontSize,
                                  etv.FONT_FAMILY, resultFontSize);  
        }
      }
    }
    // 影付き解除
    self.shpInfoState.canvas.context.restore();
  },

  // ワールドタッチ時のイベントリスナ（アピア）登録
  worldPointingEnd : function(e) {
    // コンタクト中のみ有効
    if (gm.state == gm.STATE_CONTACT) {
      // GameMasterへのイベント通知
      var posLog = ViewUtl.toPosLog(new ViewUtl.PosPhs(e.pointing.x - (etv.appWidth - etv.worldWidth) / 2,
                                                       e.pointing.y - (etv.appHeight - etv.worldHeight) / 2));
      if (posLog != null) {
        if (gm.lset.opModeIs2point == false) {
          // 1Pointモードの場合はそのままダイレクトに着手
          gm.processPlayEvent(new Action(gm.gameState.nextSide, Action.PLAY, posLog.col, posLog.row));
        }
        else {
          // 2Pointモードの場合
          // ポイントされた座標が合法なら、仮アピア座標として設定し、確認状態に遷移
          if (Rules.isLegal(gm.gameState, gm.gameState.nextSide, posLog)) {
            // 前回仮アピアマーカーをクリアする
            if (etv.tmpAppearPosLog != null) {
              var tmpAppearPosPhs = ViewUtl.toPosPhs(etv.tmpAppearPosLog);
              this.shpMarker.canvas.clear(tmpAppearPosPhs.x, tmpAppearPosPhs.y, etv.cellWidth, etv.cellHeight);
            }

            etv.tmpAppearPosLog = posLog;
            etv.playSE("se_candidate");

            // 仮アピアマーカーを描画する
            etv.drawMatter(this.shpMarker, etv.tmpAppearPosLog, gm.gameState.nextSide, true);
            // TODO: 仮にエターナリーマーカーを上書きしているので、別のマーカーにしたいならそうする
            ViewUtl.drawEternallyMarker(this.shpMarker, etv.tmpAppearPosLog);

            etv.pointState = etv.POINT_STATE_CONFIRM;
            etv.gameScene.setButtonPanel(etv.gameScene);
          }
        }
      }
    }
  },

  // 描画更新時の動作
  // ホバー位置の透過マター描画・エフェクト描画
  // スマホでのレスポンス低下防止のため、実際の描画を可能な限り条件で制限する
  worldUpdate : function(app) {
    var startTime = new Date();
    // 有効なエフェクトがあるか
    var isEffectEffetive = false;
    // 無効になったエフェクトがあるか
    var isEffectExpired = false;
    // 有効期限の過ぎたエフェクトを削除する
    for (var i = 0; i < this.effects.length; i++) {
      isEffectEffetive = true;
      if (this.effects[i].isExpired()) {
        // onExpire()メソッドが定義されていれば削除前にそれを呼ぶ
        if (this.effects[i].onExpired != undefined) {
          this.effects[i].onExpired();
        }
        this.effects.splice(i, 1);
        isEffectExpired = true;
      }
    }

    // エフェクトが有効 or 無効になったエフェクトがある場合、エフェクトレイヤ全体のクリア
    if (isEffectEffetive || isEffectExpired) {
      this.shpEffect.canvas.clear(0, 0, this.shpEffect.width, this.shpEffect.height);
    }

    // エフェクトが有効な場合、エフェクト描画
    if (isEffectEffetive) {
      for (var i = 0; i < this.effects.length; i++) {
        this.effects[i].execDrawing();
      }
    }

    // ホバーマターに関する処理（コンタクト状態のみ）
    if (gm.state == gm.STATE_CONTACT) {
      // 現在のホバー位置に対応する論理座標
      var gstPosLog = ViewUtl.toPosLog(new ViewUtl.PosPhs(app.pointing.x - (etv.appWidth - etv.worldWidth) / 2,
                                                          app.pointing.y - (etv.appHeight - etv.worldHeight) / 2));
      // 透過マター位置が変化したか？
      var isGhostUpdated = (gstPosLog == null && this.prvGstPosLog != null) ||
                           (gstPosLog != null && this.prvGstPosLog == null) ||
                           (gstPosLog != null && this.prvGstPosLog != null &&
                             (gstPosLog.col != this.prvGstPosLog.col || gstPosLog.row != this.prvGstPosLog.row));

      // 透過マター位置変化有りの場合、前回位置のみクリア
      if (isGhostUpdated && this.prvGstPosLog != null
          && gm.gameState.worldState[this.prvGstPosLog.col][this.prvGstPosLog.row] == SIDE.O) {
        var prvGstPosPhs = ViewUtl.toPosPhs(this.prvGstPosLog).matterShift(gm.gameState.nextSide);
        this.shpMatter.canvas.clear(prvGstPosPhs.x, prvGstPosPhs.y, etv.cellWidth, etv.cellHeight);
      }
    }

    var animationReflesh = false;
    // マターの平常時アニメーション
    if (etv.matterAnimation) {
      var d = new Date();
      // 前回アニメーションから時間経過しているか
      if (d - matterLastAnm > MATTER_ANM_INTERVAL) {
        for (var s = SIDE.A; s <= SIDE.B; s++) {
          matterPhase[s]++;
          // TODO: phaseはそもそもマターごとに定義できてはいけない
          if (matterPhase[s] >= MATTER_PHASES[s])
            matterPhase[s] = 0;
        }
        matterLastAnm = d;
        animationReflesh = true;

        // マターレイヤのクリア（全範囲クリア。遅い場合はマターのある座標だけにする）
        this.shpMatter.canvas.clear();

        // コマを進めてマターの再描画
        for (var col = 0; col < etv.cols; col++) {
          for (var row = 0; row < etv.rows; row++) {
            var side = gm.gameState.worldState[col][row];
            if (side != SIDE.O) {
              etv.drawMatter(this.shpMatter, new PosLog(col, row), side, false);
            }
          }
        }
      }
    }

    // 透過マター位置変更あった場合、透過マターを描画する
    // アニメーションコマで、透過マター再描画する
    if (gm.state == gm.STATE_CONTACT) {
      if (isGhostUpdated || animationReflesh) {
        // 透過マターの描画(操作によるアクティビティが有効(=人間の手番)で、ホバー位置にマターが無い場合のみ)
        if (gstPosLog != null && this.shpWorld.interactive == true
            && gm.gameState.worldState[gstPosLog.col][gstPosLog.row] == SIDE.O) {
          etv.drawMatter(this.shpMatter, gstPosLog, gm.gameState.nextSide, true);
        }
      }
      this.prvGstPosLog = gstPosLog;
    }

    // TODO: デバッグ用：描画に掛かった時間の表示
    var endTime = new Date();
    var time = endTime - startTime;
    this.shpEffect.canvas.clear(0, 0, 30, 10);  // 領域は適当
    this.shpEffect.canvas.fillStyle="black";
    this.shpEffect.canvas.font = "8px sans-serif";
    this.shpEffect.canvas.fillText(time, 0, 10);
  },
});


tm.define("PresentScene", {
  superClass: "tm.app.Scene",

  init: function() {
    this.superInit();

    var label = tm.app.Label(gm.getActionSGF()).addChildTo(this);
    label
        .setPosition(etv.appWidth / 2, etv.appHeight / 2)
        .setFillStyle("#888")
        .setFontSize(24)
        .setAlign("center")
        .setBaseline("middle");
  },
});

// 画面描画系ユーティリティ
function ViewUtl() {
};

  // 物理座標クラス
  ViewUtl.PosPhs = function(x, y) {
    this.x = x;
    this.y = y;

    // マター画像用の補正を適用する
    this.matterShift = function(side) {
      this.x += etv.cellWidth * etv.MATTER_COEFF_X[side];
      this.y += etv.cellHeight * etv.MATTER_COEFF_Y[side];
      return this;
    }
  };

  // フィールドの論理座標 → 物理座標 変換
  // 対応する物理座標領域の左上の物理座標を返す。
  ViewUtl.toPosPhs = function(posLog) {
    var posPhs = new ViewUtl.PosPhs();
    posPhs.x = etv.worldMarginWidth + etv.cellWidth * posLog.col;
    posPhs.y = etv.worldMarginHeight + etv.cellHeight * posLog.row;
    return posPhs;
  };

  // フィールドの物理座標 → 論理座標 変換
  // フィールド外（マージン部）の変換はnullを返す
  ViewUtl.toPosLog = function(posPhs) {
    var posLog = new PosLog();
    posLog.col = parseInt((posPhs.x - etv.worldMarginWidth) / etv.cellWidth, 10);
    posLog.row = parseInt((posPhs.y - etv.worldMarginHeight) / etv.cellHeight, 10);

    // 正常な論理座標に変換された場合のみposLogの変換結果を返す
    // 物理座標値がマージン幅以下のときは範囲外だがparseIntで0に丸まってしまうので物理座標値条件で弾く
    if (0 <= posLog.col && posLog.col <= etv.cols - 1 &&
        0 <= posLog.row && posLog.row <= etv.rows - 1 &&
        posPhs.x >= etv.worldMarginWidth && posPhs.y >= etv.worldMarginHeight) {
      return posLog;
    }
    else {
      return null;
    }
  };

  // 背景テクスチャを描画する
  ViewUtl.initBackTexture = function() {
    var tSize = etv.matterSize / 3;
    var tShp = new tm.app.Shape({ width: tSize * 2, height: tSize * 2 });
    var txtr = tShp.canvas;
    txtr.clearColor(worldBackColor);
    var tItvl = tSize / 7;
    txtr.lineWidth = tItvl / 2;

    for (var i = 0; i <= 7; i++) {
      txtr.strokeStyle = worldBackTextureColor[i % 2];

      txtr.drawLine(        i * tItvl        ,         0        ,         0        ,         i * tItvl);
      txtr.drawLine(tSize - i * tItvl        , tSize - 0        , tSize - 0        , tSize - i * tItvl);
      txtr.drawLine(        i * tItvl + tSize,         0 + tSize,         0 + tSize,         i * tItvl + tSize);
      txtr.drawLine(tSize - i * tItvl + tSize, tSize     + tSize, tSize     + tSize, tSize - i * tItvl + tSize);

      txtr.drawLine(tSize - i * tItvl + tSize,         0        , tSize - 0 + tSize,         i * tItvl);
      txtr.drawLine(        i * tItvl + tSize, tSize - 0        ,         0 + tSize, tSize - i * tItvl);
      txtr.drawLine(tSize - i * tItvl        ,         0 + tSize, tSize - 0        ,         i * tItvl + tSize);
      txtr.drawLine(        i * tItvl        , tSize - 0 + tSize,         0        , tSize - i * tItvl + tSize);
    }

    // 初期描画したワールドをキャッシュ(canvasとして保存)
    etv.backTexture = tShp.canvas.canvas;
  };


  // ワールド全体に指定画像ファイルを描画するfunction
  ViewUtl.drawImageWorld = function(layer, img) {
    layer.canvas.drawImage(img,
                           0, 0, img.width, img.height,
                           0, 0, layer.width, layer.height);
  };

  // ワールド全体に指定画像ファイルを指定透明度で描画するfunction
  ViewUtl.drawImageWorldOpaque = function(layer, img, opq) {
    layer.canvas.globalAlpha = opq;
    ViewUtl.drawImageWorld(layer, img);
    layer.canvas.globalAlpha = 1.0;
  }

  // ワールドに戦況に応じて部分的に透過な指定画像ファイルを描画するfunction (要はCostume用)
  ViewUtl.drawPartTransparentImageWorld = function(layer, img) {
    var BASE_INFL = 130;   // 透過度決定基準となる影響値(この値で完全透過になる)
    var ratio = img.width / layer.width;  // ワールド座標と画像の比率
    // 座標の透過度に応じて、透過前画像を重ね描きする
    // 同時にグリッドも描画する
    for (var col = 0; col < etv.cols; col++) {
      for (var row = 0; row < etv.rows; row++) {
        posPhs = ViewUtl.toPosPhs(new PosLog(col, row));
        if (etv.transparency != null) {
          // 勢力の自乗を透過度にする(自石から遠い部分はあまり透過させない)
          var transparancy = etv.transparency[SIDE.A][col][row] * etv.transparency[SIDE.A][col][row];
          // 自マターの場所は完全透過
          if (gm.gameState.worldState[col][row] == SIDE.A) {
            layer.canvas.globalAlpha = 0.0;
          }
          else {
            // 自勢力が一定値以上なら完全透過
            if (transparancy >= BASE_INFL) {
              layer.canvas.globalAlpha = 0.0;
            }
            else {
              // 勢力の強さに応じて透過度を上げる
              layer.canvas.globalAlpha = (BASE_INFL - transparancy) / BASE_INFL;  // TODO: 透過度への変換は取得時に行なう
            }
          }
        }
        layer.canvas.drawImage(img,
                               posPhs.x * ratio, posPhs.y * ratio, etv.cellWidth * ratio, etv.cellHeight * ratio,
                               posPhs.x, posPhs.y, etv.cellWidth, etv.cellHeight);

        layer.canvas.globalAlpha = 1.0;
      }
    }
  };

  // ワールドにeternary独自のワールドを描画するfunction (※Grid描画込)
  ViewUtl.drawEternaryWorld = function(layer) {
    // テクスチャで背景描画
    ViewUtl.clearTexture(layer, etv.backTexture);

    // 色の指定
    var COLOR_OCTA_NORMAL = "#FFFFFF";  // 普通のオクタの色（白色）
    var COLOR_OCTA_EDGE   = "#EEFFEE";  // 辺境（三線）のオクタの色（薄い緑色）
    var COLOR_OCTA_MIDDLE = "#FFF6D6";  // 中央のオクタの色（薄い橙色）
    var COLOR_OCTA_ED_MDL = "#EEEEDD";  // 辺境と中央の交点のオクタの色（辺境色と中央色の混色）
    var COLOR_LINE        = "#999999";  // オクタの輪郭の色（薄い灰色）
    var COLOR_DIAMOND     = "#EEEEEE";  // オクタの斜め方向の無効部分の色（さらに薄い灰色）

    for (var col = 0; col < etv.cols; col++) {
      for (var row = 0; row < etv.rows; row++) {
        posPhs = ViewUtl.toPosPhs(new PosLog(col, row));

        // 辺境・中央の判定
        // 辺境はワールドサイズに関係無く、三線の位置に設定する
        var isEdge   = (col + 1 == 3 || etv.cols - col == 3 ||
                        row + 1 == 3 || etv.rows - row == 3);
        var isMiddle = (col + 1 == (etv.cols + 1) / 2 ||
                        row + 1 == (etv.rows + 1) / 2);
        var octaColor;
        if (isEdge && isMiddle) {
          octaColor = COLOR_OCTA_ED_MDL;
        }
        else if (isEdge) {
          octaColor = COLOR_OCTA_EDGE;
        }
        else if (isMiddle) {
          octaColor = COLOR_OCTA_MIDDLE;
        }
        else {
          octaColor = COLOR_OCTA_NORMAL;
        }

        // 座標・寸法の変数短縮
        var cx = parseInt(posPhs.x);
        var cy = parseInt(posPhs.y);
        var cw = parseInt(etv.cellWidth);
        var ch = parseInt(etv.cellHeight);
        var xw = parseInt(etv.cellWidth / 5);
        var xh = parseInt(etv.cellHeight / 5);

        // オクタの着色
        layer.canvas.fillStyle = octaColor;
        layer.canvas.fillRect(cx, cy, cw, ch);

        // 斜め方向の無効印の描画
        layer.canvas.fillStyle = COLOR_DIAMOND;
        // 左上
        layer.canvas.fillTriangle(cx     , cy,
                                  cx + xw, cy,
                                  cx     , cy + xh);
        // 右上
        layer.canvas.fillTriangle(cx + cw     , cy,
                                  cx + cw - xw, cy,
                                  cx + cw     , cy + xh);
        // 左下
        layer.canvas.fillTriangle(cx     , cy + ch,
                                  cx + xw, cy + ch,
                                  cx     , cy + ch - xh);
        // 右下
        layer.canvas.fillTriangle(cx + cw     , cy + ch,
                                  cx + cw - xw, cy + ch,
                                  cx + cw     , cy + ch - xh);

        // オクタの輪郭の描画
        // TODO: アンチエイリアスを掛けずに常にソリッドな1pxの線を引く
        layer.canvas.strokeStyle = COLOR_LINE;
        layer.canvas.lineWidth = 1;
        layer.canvas.strokeRect(cx, cy, cw, ch);
      }
    }
  };

  // 伝統的なGridを描画するfunction
  ViewUtl.drawTraditionalGrid = function(layer) {
    layer.canvas.globalAlpha = etv.gameObjOpaque;

    // ソリッドなグリッドの描画
    layer.canvas.strokeStyle = "#111111";
    layer.canvas.fillStyle   = "#111111";
    layer.canvas.lineWidth = 1;

    var posPhsUL = ViewUtl.toPosPhs(new PosLog(0, 0));  // 左上セル
    var posPhsBR = ViewUtl.toPosPhs(new PosLog(etv.cols - 1, etv.rows - 1));  // 右下セル

    // 横グリッドの描画
    for (var row = 0; row < etv.rows; row++) {
      layer.canvas.drawLine(posPhsUL.x + etv.cellWidth / 2,
                            posPhsUL.y + etv.cellHeight / 2 + row * etv.cellHeight,
                            posPhsBR.x + etv.cellWidth / 2,
                            posPhsUL.y + etv.cellHeight / 2 + row * etv.cellHeight);
    }

    // 縦グリッドの描画
    for (var col = 0; col < etv.cols; col++) {
      layer.canvas.drawLine(posPhsUL.x + etv.cellWidth / 2 + col * etv.cellWidth,
                            posPhsUL.y + etv.cellHeight / 2,
                            posPhsUL.x + etv.cellWidth / 2 + col * etv.cellWidth,
                            posPhsBR.y + etv.cellHeight / 2);
    }

    // 星の描画
    var stars = [];
    //  天元: 両方の辺サイズがともに奇数なら描画
    if (etv.cols % 2 == 1 && etv.rows % 2 == 1) {
      stars.push(new PosLog((etv.cols + 1) / 2 - 1, (etv.rows + 1) / 2 - 1));
    }
    //  四隅: 両方の辺サイズ >= 9 なら描画
    if (etv.cols >= 9 && etv.rows >= 9) {
      // 辺サイズ < 11 なら 3線に。11 <= 辺サイズなら 4線に描画
      stars.push(new PosLog(                etv.cols >= 11 ? 3 : 2 ,                 etv.rows >= 11 ? 3 : 2 ));
      stars.push(new PosLog(etv.cols - 1 - (etv.cols >= 11 ? 3 : 2),                 etv.rows >= 11 ? 3 : 2 ));
      stars.push(new PosLog(                etv.cols >= 11 ? 3 : 2 , etv.rows - 1 - (etv.rows >= 11 ? 3 : 2)));
      stars.push(new PosLog(etv.cols - 1 - (etv.cols >= 11 ? 3 : 2), etv.rows - 1 - (etv.rows >= 11 ? 3 : 2)));
    }
    //  辺: 辺サイズ >= 19 かつ 奇数なら 4線(or 3線)中央に描画
    if (etv.cols >= 19 && etv.cols % 2 == 1) {
      stars.push(new PosLog((etv.cols + 1) / 2 - 1,                 etv.rows >= 11 ? 3 : 2 ));
      stars.push(new PosLog((etv.cols + 1) / 2 - 1, etv.rows - 1 - (etv.rows >= 11 ? 3 : 2)));
    }
    if (etv.rows >= 19 && etv.rows % 2 == 1) {
      stars.push(new PosLog(                etv.cols >= 11 ? 3 : 2 , (etv.rows + 1) / 2 - 1));
      stars.push(new PosLog(etv.cols - 1 - (etv.cols >= 11 ? 3 : 2), (etv.rows + 1) / 2 - 1));
    }

    for (var s = 0; s < stars.length; s++) {
      var posPhs = ViewUtl.toPosPhs(stars[s]);
      layer.canvas.fillCircle(posPhs.x + etv.cellWidth / 2,
                              posPhs.y + etv.cellHeight / 2,
                              etv.matterSize / 8, etv.matterSize / 8);
    }

    layer.canvas.globalAlpha = 1.0;
  };


  // 素の円形マターを描画する
  ViewUtl.drawSolidRoundMatter = function(layer, posLog, side, isTransparent) {
    layer.canvas.globalAlpha = etv.gameObjOpaque;

    layer.canvas.fillStyle = (side == SIDE.A) ? sideAColor : sideBColor;
    var posPhs = ViewUtl.toPosPhs(posLog);

    // 透明度の指定(一時的にglobalAlphaを変更してすぐ元に戻す。最適な方法ではないかも。)
    if (isTransparent) {
      layer.canvas.globalAlpha *= 0.5;
    }
    layer.canvas.fillCircle(posPhs.x + etv.cellWidth / 2 + (isTransparent ? etv.effOfsX : 0),
                            posPhs.y + etv.cellHeight / 2 + (isTransparent ? etv.effOfsY : 0),
                            etv.matterSize / 2);
    layer.canvas.globalAlpha = 1.0;
  };

  // スプライトアニメーションするマターを描画する
  ViewUtl.drawSpriteMatter = function(layer, posLog, side, isTransparent) {
    layer.canvas.globalAlpha = etv.gameObjOpaque;

    var posPhs = ViewUtl.toPosPhs(posLog).matterShift(side);
    // TODO: 賑やかにバラつかせるためのオフセットを指定できるようにする
    var phase = matterPhase[side];   // + phaseOfs;

    // 透明度の指定(一時的にglobalAlphaを変更してすぐ元に戻す。最適な方法ではないかも。)
    if (isTransparent) {
      if (layer.canvas == undefined) {
        "";
      }
      layer.canvas.globalAlpha *= 0.5;
    }
    // TODO:縦横比を保った拡大縮小になっていないので必要であれば直す
    layer.canvas.drawImage(matterImg[side],
                           MATTER_SPRITE_WIDTH[side] * (phase % MATTER_SPRITE_BREAK[side]),
                           MATTER_SPRITE_HEIGHT[side] * parseInt(phase / MATTER_SPRITE_BREAK[side]),
                           MATTER_SPRITE_WIDTH[side], MATTER_SPRITE_HEIGHT[side],
                           posPhs.x,
                           posPhs.y,
                           etv.cellWidth, etv.cellHeight);

    layer.canvas.globalAlpha = 1.0;
  };

  // スプライトアニメーションするマターのうちの一枚を直接描画する
  // infoパネルの凡例描画用
  // TODO: drawSpriteMatter()と共通化する。また、drawSolidRoundMatter系ともオブジェクト指向的に共有する
  ViewUtl.drawSpriteMatterDirectly = function(layer, posPhs, side) {
    var phase = 0; // 代表的なフェーズ

    // TODO:縦横比を保った拡大縮小になっていないので必要であれば直す
    layer.canvas.drawImage(matterImg[side],
                           MATTER_SPRITE_WIDTH[side] * (phase % MATTER_SPRITE_BREAK[side]),
                           MATTER_SPRITE_HEIGHT[side] * parseInt(phase / MATTER_SPRITE_BREAK[side]),
                           MATTER_SPRITE_WIDTH[side], MATTER_SPRITE_HEIGHT[side],
                           posPhs.x,
                           posPhs.y,
                           etv.cellWidth, etv.cellHeight);
  };



  // 直前アピアマーカーを描画する
  ViewUtl.drawLastMarker = function(layer, posLog) {
    layer.canvas.globalAlpha = etv.gameObjOpaque;

    var posPhs = ViewUtl.toPosPhs(posLog);
    layer.canvas.fillStyle = "red";
    layer.canvas.globalAlpha *= 0.7;
    layer.canvas.fillRect(posPhs.x + etv.cellWidth / 2 - etv.matterSize / 4,
                          posPhs.y + etv.cellHeight / 2 - etv.matterSize / 4,
                          etv.matterSize / 2, etv.matterSize / 2);

    layer.canvas.globalAlpha = 1.0;
  };

  // エターナリー座標マーカーを描画する
  ViewUtl.drawEternallyMarker = function(layer, posLog) {
    layer.canvas.globalAlpha = etv.gameObjOpaque;

    var posPhs = ViewUtl.toPosPhs(posLog);
    layer.canvas.strokeStyle = "red";
    layer.canvas.drawLine(posPhs.x + etv.cellWidth / 2 - etv.matterSize / 4,
                          posPhs.y + etv.cellHeight / 2 - etv.matterSize / 4,
                          posPhs.x + etv.cellWidth / 2 - etv.matterSize / 4 + etv.matterSize / 2,
                          posPhs.y + etv.cellHeight / 2 - etv.matterSize / 4 + etv.matterSize / 2);
    layer.canvas.drawLine(posPhs.x + etv.cellWidth / 2 - etv.matterSize / 4,
                          posPhs.y + etv.cellHeight / 2 - etv.matterSize / 4 + etv.matterSize / 2,
                          posPhs.x + etv.cellWidth / 2 - etv.matterSize / 4 + etv.matterSize / 2,
                          posPhs.y + etv.cellHeight / 2 - etv.matterSize / 4);

    layer.canvas.globalAlpha = 1.0;
  };

  // Estimate結果マーカーを描画する
  ViewUtl.drawEstimateMarker = function(layer) {
    layer.canvas.globalAlpha = etv.gameObjOpaque;
    layer.canvas.clear();

    var worldState = etv.estimatedResult.status;
    // 盤面状態判定の結果を表示する
    var diameter = Math.min(etv.cellWidth, etv.cellHeight);
    for (var col = 0; col < etv.cols; col++) {
      for (var row = 0; row < etv.rows; row++) {
        var posPhs = ViewUtl.toPosPhs(new PosLog(col, row));
        switch(worldState[col][row]) {
          case 1:  // alive : 活石 : 青 or 赤の●
            layer.canvas.fillStyle = gm.gameState.worldState[col][row] == SIDE.A ? "blue" : "red";  // SIDEに応じて色変更
            layer.canvas.fillCircle(posPhs.x + etv.cellWidth / 2, posPhs.y + etv.cellHeight / 2, diameter / 4);
            break;
          case 2:  // dead : 死石 ： 赤 or 青の×
            layer.canvas.fillStyle = gm.gameState.worldState[col][row] == SIDE.A ? "red" : "blue";  // SIDEに応じて色変更
            layer.canvas.fillStar(posPhs.x + etv.cellWidth / 2, posPhs.y + etv.cellHeight / 2, diameter / 2, 4, 0.25, 45);
            break;
          case 3:  // seki : セキ活き : 青 or 赤の○
            layer.canvas.strokeStyle = gm.gameState.worldState[col][row] == SIDE.A ? "blue" : "red";  // SIDEに応じて色変更
            layer.canvas.strokeCircle(posPhs.x + etv.cellWidth / 2, posPhs.y + etv.cellHeight / 2, diameter / 4);
            break;
          case 4:  // white_territory : 白地 : 赤の■
            layer.canvas.fillStyle = "red";
            layer.canvas.fillRect(posPhs.x + etv.cellWidth / 2 - diameter / 4, posPhs.y + etv.cellHeight / 2 - diameter / 4,
                                  diameter / 2, diameter / 2);
            break;
          case 5:  // black_territory : 黒地 : 青の■
            layer.canvas.fillStyle = "blue";
            layer.canvas.fillRect(posPhs.x + etv.cellWidth / 2 - diameter / 4, posPhs.y + etv.cellHeight / 2 - diameter / 4,
                                  diameter / 2, diameter / 2);
            break;
          case 6:  // dame : ダメ : 描画無し
            // layer.canvas.fillStyle = "yellow";
            // layer.canvas.fillRect(posPhs.x + etv.cellWidth / 2 - diameter / 4, posPhs.y + etv.cellHeight / 2 - diameter / 4,
            //                       diameter / 2, diameter / 2);
            break;
        }
      }
    }
    layer.canvas.globalAlpha = 1.0;
  };

  // Shapeを全てテクスチャで塗りつぶす
  ViewUtl.clearTexture = function(shape, textureImg) {
    try {
      shape.canvas.fillStyle = shape.canvas.context.createPattern(textureImg, 'repeat');
    }
    catch (e) {
      console.log("clearTexture() createPattern()");
      console.log("textureImg = " + textureImg );
      console.log(e);
    }
    shape.canvas.fillRect(0, 0, shape.width, shape.height);
  };

  // 指定矩形内に収まるようにテキストを描画する
  // 引数は順に、描画対象shape, 描画文字列, 矩形の左上のx, y, 幅, 高さ, フォントスタイル(サイズ以外), 希望するフォントサイズ(px)
  // TODO:たまに最後の１文字がはみ出る（修正するためにはちゃんとフロー書いてスパ見直さないとダメかも）
  // TODO:コードが汚い。計測と描画で同じようでちょいちょい違うコードが重複してる
  ViewUtl.fillTextAutoFit = function(layer, message, x, y, width, height, fontStyle, preferredFontPx) {
    // テスト用：テスト用メッセージの上書き
    // message = "新しい朝が来た　希望の朝だ　喜びに胸を開け　大空あおげ　ラジオの声に　健(すこ)やかな胸を　この香る風に　開けよ それ　一　二　三";
    // message = "The quick brown fox jumps over the lazy dog";

    // フォントサイズ補正関数
    var getSmallerFontSize = function(fontPx, message, lineStartCharIdx) {
      // 全体文字列のうち、今回収まった文字数の比率
      var ratio = (lineStartCharIdx - 1) / message.length;
      // 比率が1から大きく離れる（全然収まらない）場合、一発で合わせようとすると小さすぎになってしまうので
      // 一旦弱めに調整を掛けて、刻んで寄せることを目指す
      if (ratio < 2/3) {
        ratio *= 3/2;
      }
      // 幅だけでなく高さも縮まることを考慮して縮小する。newFontPx^2 = fontPx^2 * ratio
      var newFontPx = Math.floor(Math.sqrt(fontPx * fontPx * ratio));
      if (newFontPx == fontPx) {
        newFontPx--;
      }
      return newFontPx;
    };

    // 文字列全体が矩形内に収まったかどうか
    var isFit = false;
    // フォントサイズ。まずは希望のフォントサイズで計測する
    var fontPx = Math.floor(preferredFontPx);
    // 行の高さ
    var lineHeight;

    // 領域高さがフォントサイズ未満の場合ははじめに調整しておく
    if (height < fontPx) {
      fontPx = height;
    }

    // フォント自動縮小の判定ループ
    while (isFit == false && fontPx > 0) {
      // canvasへのフォント設定
      layer.canvas.font = fontPx + "px " + fontStyle
      // 行の高さはフォントのpx指定の1.2倍らしいのでそれに従ってみる
      // http://d.hatena.ne.jp/tsugehara/20130307/1362646718
      lineHeight = Math.ceil(fontPx * 1.2);

      // 行（文字描画のy方向オフセット）
      var lineOffset = 0;
      // その行を何文字目から開始するか
      var lineStartCharIdx = 0;
      // メッセージ高さ領域をオーバーしたか
      var isOver = false;

      // 対象文字を1文字ずつ増やしながら文字幅測定し、矩形幅を超えたらその1文字前までを1行として描画する
      for (var c = lineStartCharIdx; c < message.length; c++) {
        if (layer.canvas.context.measureText(message.substring(lineStartCharIdx, c)).width > width) {
          // ライン送り
          lineOffset += lineHeight;
          // 今回描画できなかった文字を、次の行の先頭文字とする
          lineStartCharIdx = c - 1;
          // インデックスを戻す（反則的...）
          c--;

          // 矩形高さに収まっていない場合、オーバーする文字数の比率からフォントサイズ再設定し、
          // もう一度初めから測定をやり直す
          if (lineOffset > height) {
            fontPx = getSmallerFontSize(fontPx, message, lineStartCharIdx);
            isOver = true;
            break;
          }
        }
      }
      // 全文字測定後、最終行を含めた行高さが矩形高さに収まっていれば終了。
      if (lineOffset + lineHeight <= height) {
        isFit = true;
      }
      // 最終行で行高さをオーバーした場合（フォントサイズ未調整）、ここでフォントサイズ調整する
      else if (isOver == false) {
        fontPx = getSmallerFontSize(fontPx, message, lineStartCharIdx);
      }
    }

    // canvasへの最終フォント設定、行高さ設定
    // (良く分からないけどはみ出るので、対症療法で雑に0.85掛けする)
    fontPx = Math.floor(fontPx * 0.85);
    layer.canvas.font = fontPx + "px " + fontStyle
    lineHeight = Math.ceil(fontPx * 1.2);

    // 文字列描画
    var lineOffset = 0;
    var lineStartCharIdx = 0;
    var isOver = false;

    for (var c = lineStartCharIdx; c < message.length; c++) {
      if (layer.canvas.context.measureText(message.substring(lineStartCharIdx, c)).width > width) {
        // ライン送り
        lineOffset += lineHeight;

        // 矩形高さに収まっていれば文字列描画する
        if (lineOffset <= height) {
          layer.canvas.fillText(message.substring(lineStartCharIdx, c - 1), x, y + lineOffset);
        }

        // 今回描画できなかった文字を、次の行の先頭文字とする
        lineStartCharIdx = c - 1;
        // インデックスを戻す（反則的...）
        c--;
      }
    }
    // 最終行を書き出す
    layer.canvas.fillText(message.substring(lineStartCharIdx, message.length), x, y + lineOffset + lineHeight);
  };

// Option画面(ローカル設定)関係の処理

function initOptionDlg() {
  // 濃度調整のnumberとrangeの値同期イベントハンドラ
  numBackOpaque.addEventListener("input", function(){ rngBackOpaque.value = numBackOpaque.value; });
  rngBackOpaque.addEventListener("input", function(){ numBackOpaque.value = rngBackOpaque.value; });
  numObjOpaque.addEventListener("input", function(){ rngObjOpaque.value = numObjOpaque.value; });
  rngObjOpaque.addEventListener("input", function(){ numObjOpaque.value = rngObjOpaque.value; });

  // Dimmerの濃度調整処理
  var changeDressupOpaque = function() {
    // NumberとRangeの値は別のinputイベントハンドラで同期済の前提
    etv.worldDimmerOpaque = 1.0 - numBackOpaque.value / 100;
    etv.gameObjOpaque = numObjOpaque.value / 100;
    if (etv.gameScene) {
      // 再描画
      etv.gameScene.setArrangement(etv.gameScene, true);
    }
  }
  // 透明度変更時のイベントハンドラ登録（即時反映）
  numBackOpaque.addEventListener("input", changeDressupOpaque);
  rngBackOpaque.addEventListener("input", changeDressupOpaque);
  numObjOpaque.addEventListener("input", changeDressupOpaque);
  rngObjOpaque.addEventListener("input", changeDressupOpaque);

  // 待ち時間なしにしたら待ち時間を変更不可にする
  rbNoWait  .addEventListener("input", function(){ numMeanTime.disabled = btnMeanTimeInc.disabled = btnMeanTimeDec.disabled = rbNoWait.checked; });
  rbTimeWait.addEventListener("input", function(){ numMeanTime.disabled = btnMeanTimeInc.disabled = btnMeanTimeDec.disabled = rbNoWait.checked; });

  // 待ち時間増減ボタン
  btnMeanTimeInc.addEventListener("click", function(){ numMeanTime.value = Math.min((parseFloat(numMeanTime.value) + 0.5), 10).toFixed(1); });
  btnMeanTimeDec.addEventListener("click", function(){ numMeanTime.value = Math.max((parseFloat(numMeanTime.value) - 0.5),  0).toFixed(1); });

  // 待ち時間を入力したら待ちありにする
  numMeanTime.   addEventListener("input", function(){ rbTimeWait.checked = true; rbNoWait.checked = false; });
  btnMeanTimeInc.addEventListener("click", function(){ rbTimeWait.checked = true; rbNoWait.checked = false; });
  btnMeanTimeDec.addEventListener("click", function(){ rbTimeWait.checked = true; rbNoWait.checked = false; });

  // スマホ等ではinputを直接入力不能とする(フォーカスされるとソフトウェアキーボードが出てリサイズされ、オプションDlgが閉じちゃうから)
  if (isSmartDevice()) {
    numMeanTime.readOnly = true;
    numBackOpaque.readOnly = true;
    numObjOpaque.readOnly = true;
  }

  // ボタン押下時の処理
  btnOptionOk.addEventListener("click", function(){
    // 設定値を適用＆保存
    gm.lset.opModeIs2point = rb2point.checked;
    gm.lset.thinkTimeMean = rbTimeWait.checked ? parseInt(numMeanTime.value * 1000) : 0;
    gm.lset.thinkTimeDiff = rbTimeWait.checked ? parseInt(numMeanTime.value *  500) : 0;  // ばらつきは平均値に応じて設定(画面枠削減のため)
    gm.lset.playEffect = rbEffectOn.checked;
    // 透明度は値変更時に反映済なのでそれをセット
    gm.lset.worldDimmerOpaque = etv.worldDimmerOpaque;
    gm.lset.gameObjOpaque     = etv.gameObjOpaque;
    // 保存
    gm.lsetUtl.set(gm.lset);
    // 効果音
    etv.playSE("se_push");
    // ダイアログ閉じる
    showOptionDlg(false);
  });
  btnOptionNg.addEventListener("click", function(){
    // 保存されていた設定値に戻す
    etv.worldDimmerOpaque = gm.lset.worldDimmerOpaque;
    etv.gameObjOpaque     = gm.lset.gameObjOpaque;
    // 再描画
    etv.gameScene.setArrangement(etv.gameScene, true);
    // 効果音
    etv.playSE("se_cancel");
    // ダイアログ閉じる
    showOptionDlg(false);
  });
  // 【デバッグ用】
  btnOptionDelete.addEventListener("click", function(){
    // ローカルストレージを削除
    gm.lsetUtl.delete();
  });

  // 初期表示に透明度設定値を反映する
  setOptionDlgValue();
  changeDressupOpaque();
}

function openOptionDlg(){
  setOptionDlgValue();
  showOptionDlg(true);
}

function showOptionDlg(isOpen, isInvisible) {
  if (!isInvisible) {
    divOption.style.visibility = "visible";   // 画面サイズ変更時に非表示にしてる場合があるので再表示する
  }

  var translateX, translateY;
  if (etv.isWindowPortrait) {
    // 縦画面
    translateX = "-50%";
    translateY = (isOpen ? ("-" + divOption.offsetHeight) : 0) + "px";
  }
  else {
    // 横画面
    translateX = (isOpen ? ("-" + divOption.offsetWidth) : 0) + "px";
    translateY = "-50%";
  }
  divOption.style.transform = "translate(" + translateX + "," + translateY + ")";
}  

// 現在の設定値をフォームにセット
function setOptionDlgValue(){
  rb2point.checked = gm.lset.opModeIs2point;
  rb1point.checked = !rb2point.checked;
  rbNoWait.checked =  parseInt(gm.lset.thinkTimeMean) == 0 && parseInt(gm.lset.thinkTimeDiff) == 0;
  rbTimeWait.checked = !rbNoWait.checked;
  numMeanTime.value = (gm.lset.thinkTimeMean / 1000).toFixed(1);
  // numDiffTime.value = (gm.lset.thinkTimeDiff / 1000).toFixed(1);
  rbEffectOn.checked = gm.lset.playEffect;
  rbEffectOff.checked = !rbEffectOn.checked;
  numMeanTime.disabled = btnMeanTimeInc.disabled = btnMeanTimeDec.disabled = rbNoWait.checked;
  numBackOpaque.value = rngBackOpaque.value = ((1.0 - gm.lset.worldDimmerOpaque) * 100).toFixed();
  numObjOpaque.value = rngObjOpaque.value = (gm.lset.gameObjOpaque * 100).toFixed();
}
