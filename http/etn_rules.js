/*
 * eternary.Rules
 * ルール
 * ゲームルールに準拠した判定を行なうビジネスロジック
 */
// TODO: コードが汚い。(再帰内部関数と呼出部の重複コード、wormStonesとfindlibの重複コード）
function Rules() {
}
  // アヘッドウェイト
  Rules.AHEAD_WEIGHT = 7.5;

  // 指定した連の石リストを取得する
  // (Gnugo GTPコマンドと同等)
  Rules.wormStones = function(gs, posLog) {

    // 不正座標チェック
    if (posLog.col < 0 || gs.worldSizeCol <= posLog.col ||
        posLog.row < 0 || gs.worldSizeRow <= posLog.row) {
      return null;
    }

    // 連の石リスト（PosLogの配列）
    var wormList = [];

    // 指定座標の状態を取得する
    var side = gs.worldState[posLog.col][posLog.row];

    // 指定座標が空の場合、空配列を返す
    if (side == SIDE.O) {
      return wormList;
    }

    // 指定座標が空でない場合、自身を連リストに追加する
    wormList.push(posLog);

    // 指定座標を基点に、隣接する同色を連リストに収集する
    Rules.gatherNeighbors(gs, posLog, side, wormList);

    return wormList;
  };

  // 内部メソッド定義：指定座標を基点に、隣接する同色を連リストに収集
  Rules.gatherNeighbors = function(gs, basePosLog, baseSide, wormList) {
    var neighbors = Rules.getSpecifiedNeighbors(gs, basePosLog, baseSide);

    for (var i = 0; i < neighbors.length; i++) {
      var posLog = neighbors[i];

      // 既にリストにある座標の場合、リストに追加しない
      var isExist = false;
      for (var j = 0; j < wormList.length; j++) {
        if (wormList[j].equals(posLog)) {
          isExist = true;
          break;
        }
      }
      if (isExist) {
        continue;
      }

      // 連リストに追加し、そこを基点に収集を継続する
      wormList.push(posLog);
      Rules.gatherNeighbors(gs, posLog, baseSide, wormList);
    }
  };

    // wormStones() メイン処理開始

  // findlib  指定した座標にある連の呼吸点の座標リストを取得する
  // (Gnugo GTPコマンドと同等)
  Rules.findlib = function(gs, posLog) {
    // 連の座標リストを取得する
    var wormList = Rules.wormStones(gs, posLog);

    if (wormList == null) {
      return null;
    }

    var libertyList = [];

    // 連の全てのメンバーについて呼吸点探索する
    for (var i = 0; i < wormList.length; i++) {
      var posLog = wormList[i];

      var neighbors = Rules.getSpecifiedNeighbors(gs, posLog, SIDE.O);

      for (var j = 0; j < neighbors.length; j++) {
        var posLogNbr = neighbors[j];

        // 既にリストにある座標の場合、リストに追加しない
        var isExist = false;
        for (var k = 0; k < libertyList.length; k++) {
          if (libertyList[k].equals(posLogNbr)) {
            isExist = true;
            break;
          }
        }
        if (isExist) {
          continue;
        }

        // 呼吸点をリストに追加する
        libertyList.push(posLogNbr);
      }
    }

    return libertyList;
  };

  // 指定した座標にある連の呼吸点の数を取得する
  // (Gnugo GTPコマンドと同等)
  Rules.countlib = function(gs, posLog) {
    var libertyList = Rules.findlib(gs, posLog);

    if (libertyList == null) {
      return null;
    }
    else {
      return libertyList.length;
    }
  };

  // 着手後のマターバニッシュ処理を行なう
  // (独自)
  Rules.vanish = function(gs, posLog) {
    var vanishList = [];
    var side = gs.worldState[posLog.col][posLog.row];
    var oppSide = Rules.getOppositeSide(side);
    var neighbors = Rules.getSpecifiedNeighbors(gs, posLog, oppSide);

    for (var i = 0; i < neighbors.length; i++) {
      var posLogNbr = neighbors[i];

      // 呼吸点リストを取得し
      var libList = Rules.findlib(gs, posLogNbr);
      // 呼吸点が0であった場合
      if (libList.length == 0) {
        // 死石の連リストを取得する
        var wormList = Rules.wormStones(gs, posLogNbr);
        // 捕獲数を加算する
        gs.vanishCount[side] += wormList.length;
        // 捕獲リストに追加する
        vanishList = vanishList.concat(wormList);
        // フィールド上から死石を取り除く
        for (var j = 0; j < wormList.length; j++) {
          gs.worldState[wormList[j].col][wormList[j].row] = SIDE.O;
        }
      }
    }
    return vanishList;
  };

  // 指定した色を指定した座標に着手し、その様々な結果を返す
  // (独自) ※他のGTP標準コマンド等の実装実体
  Rules.checkMove = function(gs, side, posLog) {
    // 調査する結果(合法か、着手後の呼吸点数、捕獲リスト)
    var result = {isLegal : true, countlib : 0, vanishList : []};

    // 不正座標チェック
    if (posLog.col < 0 || gs.worldSizeCol <= posLog.col ||
        posLog.row < 0 || gs.worldSizeRow <= posLog.row) {
      result.isLegal = false;
      return result;
    }

    // 指定座標が空かどうかチェック
    if (gs.worldState[posLog.col][posLog.row] != SIDE.O) {
      result.isLegal = false;
      return result;
    }

    // エターナリーによる禁止点かどうかチェック
    if (posLog.equals(gs.eternallyPos)) {
      result.isLegal = false;
      return result;
    }

    // 仮にマターを置く（チェック後除去する）
    gs.worldState[posLog.col][posLog.row] = side;

    // 隣接する対抗勢力の捕獲処理（チェック後元に戻す）
    result.vanishList = Rules.vanish(gs, posLog);

    // 捕獲処理後の自身の呼吸点数チェック
    result.countlib = Rules.countlib(gs, posLog);

    // 合法かどうかチェック（捕獲処理後、呼吸点があれば合法）
    result.isLegal = result.isLegal && (result.countlib > 0);

    // 盤面復帰処理
    // 仮に置いたマターを除去
    gs.worldState[posLog.col][posLog.row] = SIDE.O;
    // 仮に捕獲した相手マターを配置
    for (var i = 0; i < result.vanishList.length; i++) {
      var vanished = result.vanishList[i];
      gs.worldState[vanished.col][vanished.row] = Rules.getOppositeSide(side);
    }
    // 捕獲数を減らす
    gs.vanishCount[side] -= result.vanishList.length;

    // 仮着手の結果を返す
    return result;
  };


  // 指定した色を指定した座標に着手した場合の、連の呼吸点の数を取得する
  // (Gnugo GTPコマンドと同等)
  Rules.accuratelib = function(gs, side, posLog) {
    return Rules.checkMove(gs, side, posLog).countlib;
  };

  // 指定した色の指定した座標への着手が合法かを判定する
  // (Gnugo GTPコマンドと同等)
  // TODO: コウ判定
  Rules.isLegal = function(gs, side, posLog) {
    return Rules.checkMove(gs, side, posLog).isLegal;
  };

  // 指定した座標に指定したsideを着手した場合の、
  // バニッシュ数をカウントする（独自）
  Rules.accurateVanish = function(gs, side, posLog) {
    return Rules.checkMove(gs, side, posLog).vanishList.length;
  };

  // 指定された座標に隣接する座標(4つ)のうち、指定された勢力である座標のリストを返す
  // もちろんフィールド外の座標はリストに含まれない。
  Rules.getSpecifiedNeighbors = function(gs, posLog, side) {
    var neighbors = [];
    var nbr = [new PosLog(posLog.col + 1, posLog.row),
               new PosLog(posLog.col - 1, posLog.row),
               new PosLog(posLog.col    , posLog.row + 1),
               new PosLog(posLog.col    , posLog.row - 1)];

    for (var i = 0; i < nbr.length; i++) {
      if (0 <= nbr[i].col && nbr[i].col < gs.worldSizeCol &&
          0 <= nbr[i].row && nbr[i].row < gs.worldSizeRow &&
          gs.worldState[nbr[i].col][nbr[i].row] == side) {
        neighbors.push(nbr[i]);
      }
    }

    return neighbors;
  };

  // 対抗勢力のSideの値を取得する
  Rules.getOppositeSide = function(side) {
    return (side == SIDE.A) ? SIDE.B : SIDE.A;
  };

  // 指定された座標がワールド内の正常な座標かどうかチェックする
  Rules.isInWorld = function(gs, col, row) {
    return (0 <= col && col < gs.worldSizeCol &&
            0 <= row && row < gs.worldSizeRow);
  };

