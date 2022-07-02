/*
 * eternary - 
 * 次世代囲碁ゲームクライアント
 */
 
/*
 * 定数
 */

/* エフェクト画像 */
// TODO: ファイルパスの管理方法を検討する
// TODO: 可変にする
var EFFECT_IMG_FILE = "wing.png";
var CUT_IN_IMG_FILE = "sprite-miku-alpha.png";


/**
  * グローバル変数
  */

/* エフェクト画像 */
var effectImg;
var cutInImg;


// エフェクトクラス
// TODO:汎化して作成する

// 円が広がるエフェクト
// TODO:継承うまくいかないのでベタ
function EffectCircle(layer, posLog) {
  // エフェクトを描画するレイヤ(Shape)
  this.layer = layer;
  // エフェクトに起因になった論理座標の物理座標変換
  var posPhs = ViewUtl.toPosPhs(posLog);
  // エフェクトを開始した時刻[ms]
  var startTime = new Date();
  // エフェクトの有効期限が超過したかを返す
  this.isExpired = function() {
    return new Date() - startTime > duration;
  };
  // エフェクト描画を行なう（描画実体はdraw()で定義する）
  this.execDrawing = function() {
    var elapsedTime = new Date() - startTime;
    draw(elapsedTime / duration);
  };

  // 以下が独自部分
  // エフェクトが有効な時間[ms]
  var duration = 1000;

  // エフェクト描画の定義
  var draw = function(progressRate) {
    layer.canvas.strokeStyle = 'rgba(255, 128, 128, ' + (1.0 - 0.9 * progressRate) + ')';
    layer.canvas.lineWidth = 5;
    layer.canvas.strokeCircle(posPhs.x + etv.cellWidth / 2 + etv.effOfsX, posPhs.y + etv.cellHeight / 2 + etv.effOfsY, 
                              etv.cellWidth * 10 * progressRate);
  };
}
// 継承関係の設定(http://qiita.com/LightSpeedC/items/d307d809ecf2710bd957 の正しい継承)
// TODO:継承うまくいかない
// EffectCircle.super_ = Effect;
// EffectCircle.prototype = Object.create(Effect.prototype, {
//     constructor: {
//       value: EffectCircle,
//       enumerable: false,
//       writable: true,
//       configurable: true
//     }
//   });

// 画像を貼るエフェクト
// TODO:継承うまくいかないのでベタ
function EffectPicture(layer, posLog) {
  // エフェクトを描画するレイヤ(Shape)
  this.layer = layer;
  // エフェクトに起因になった論理座標の物理座標変換
  var posPhs = ViewUtl.toPosPhs(posLog);
  // エフェクトを開始した時刻[ms]
  var startTime = new Date();
  // エフェクトの有効期限が超過したかを返す
  this.isExpired = function() {
    return new Date() - startTime > duration;
  };
  // エフェクト描画を行なう（描画実体はdraw()で定義する）
  this.execDrawing = function() {
    var elapsedTime = new Date() - startTime;
    draw(elapsedTime / duration);
  };

  // 以下が独自部分
  // エフェクトが有効な時間[ms]
  var duration = 3000;

  // 使用する画像のアセットキー名
  var picName = "effectPic";

  // エフェクト描画の定義
  var draw = function(progressRate) {
    layer.canvas.globalAlpha = 1.0 - 0.9 * progressRate;
    layer.canvas.drawImage(effectImg, 
                           posPhs.x + etv.cellWidth  / 2 - effectImg.width  / 2 + etv.effOfsX, 
                           posPhs.y + etv.cellHeight / 2 - effectImg.height / 2 - 100 * progressRate + etv.effOfsY);
    layer.canvas.globalAlpha = 1.0;
  };
}

// 星が飛び散るエフェクト
// TODO:継承うまくいかないのでベタ
function EffectStarsSplash(layer, posLog, isMany) {
  // エフェクトを描画するレイヤ(Shape)
  this.layer = layer;
  // エフェクトに起因になった論理座標の物理座標変換
  var posPhs = ViewUtl.toPosPhs(posLog);
  // エフェクトを開始した時刻[ms]
  var startTime = new Date();
  // エフェクトの有効期限が超過したかを返す
  this.isExpired = function() {
    return new Date() - startTime > duration;
  };
  // エフェクト描画を行なう（描画実体はdraw()で定義する）
  this.execDrawing = function() {
    var elapsedTime = new Date() - startTime;
    draw(elapsedTime / duration);
  };

  // 以下が独自部分
  // エフェクトが有効な時間[ms]
  duration = 1500;

  // 標準のx座標距離基準値
  var baseX = etv.cellWidth;
  var baseY = etv.cellHeight;
  var baseR = etv.cellWidth;

  // 出現する星の数
  var number = isMany ? (3 + tm.util.Random.randint(0, 5)) : (1 + tm.util.Random.randint(0, 1));
  // 星ごとのゆらぎ設定値
  var params = [];

  // ゆらぎ設定値の設定
  for (var i = 0; i < number; i++) {
    var param = {
      // 飛び散る方向(+1/-1)
      direction : (tm.util.Random.randbool() ? 1 : -1),
      // 色
      color : "hsl(" + tm.util.Random.randint(0, 360) + ", 100%, 50%)",
      // x距離補正係数
      xCoeff : tm.util.Random.randfloat(0.5, 1.2),
      // y距離補正係数
      yCoeff : tm.util.Random.randfloat(0.5, 1.2),
      // 大きさ補正係数
      rCoeff : tm.util.Random.randfloat(0.5, 1.2),
      // 回転数
      spin : tm.util.Random.randfloat(-3.0, 3.0),
    };
    params.push(param);
  }

  // エフェクト描画の定義
  var draw = function(progressRate) {
    layer.canvas.globalAlpha = 1.0 - 0.9 * progressRate;
    // 星の描く放物線：y=-x^2 (始点(着手位置)を(x,y)=(-2, -4)とする。頂点は(0, 0)。最終地点は(3, -9)。)
    // y = x^2の値の計算
    var x = progressRate * 5 - 2;  // 時間とともに -2→0→ 3に推移
    var y = - x * x;                              // 時間とともに -4→0→-9に推移
    // 始点を(0, 0)となるように、またy座標はcanvasと合わせて上方向が減方向となるよう補正
    var xx = x + 2;        // 時間とともに 0→ 2→5に推移
    var yy = - (y + 4);    // 時間とともに 0→-4→5に推移

    // 星の数だけ描画
    for (var i = 0; i < number; i++) {
      var param = params[i];

      var posX = posPhs.x + etv.cellWidth  / 2 + param.xCoeff * (baseX * xx * param.direction) + etv.effOfsX;
      var posY = posPhs.y + etv.cellHeight / 2 + param.yCoeff * (baseY * yy) + etv.effOfsY;
      layer.canvas.fillStyle = param.color;
      layer.canvas.fillStar(posX, posY, baseR * param.rCoeff, 5, 0, param.spin * 360 * progressRate);
    }
    layer.canvas.globalAlpha = 1.0;
  };
}

// モダンスタイリッシュな半透明トーストを表示するエフェクト
// TODO:継承うまくいかないのでベタ
// 引数変えてるので、継承チャレンジするとき注意
function EtnToast(layer, message, time) {
  // エフェクトを描画するレイヤ(Shape)
  this.layer = layer;
  // エフェクトを開始した時刻[ms]
  var startTime = new Date();
  // エフェクトの有効期限が超過したかを返す
  this.isExpired = function() {
    return new Date() - startTime > duration;
  };
  // エフェクト描画を行なう（描画実体はdraw()で定義する）
  this.execDrawing = function() {
    var elapsedTime = new Date() - startTime;
    draw(elapsedTime);
  };

  // 以下が独自部分
  // エフェクトが有効な時間[ms]
  var duration = time;

  // エフェクト描画の定義
  var draw = function(elapsedTime) {

    layer.canvas.globalAlpha = 0.7;
    layer.canvas.fillStyle = "#1BB8BC";

    // テスト：表示位置(高さ)のバラし
    var toastY = etv.appHeight / 2 + ETN_TOAST_SLOT_Y_POS[self.useSlot] * etv.appHeight / 4;

    // トースト高さ
    var toastHeight = etv.appHeight / 6;
    var toastAppearHeight = 10;  // 出現時の高さ

    // タイミング定数[ms]
    var TIME_APPEAR = 150;   // 出現完了時刻
    var TIME_EXPAND = 300;   // 拡大完了時刻

    // ①出現時：画面右から細いウィンドウがスライドイン
    if (elapsedTime < TIME_APPEAR) {
      layer.canvas.fillRoundRect(etv.appWidth / 4 * elapsedTime / TIME_APPEAR, toastY - toastAppearHeight / 2,
                                 etv.appWidth / 2, toastAppearHeight, 15);
    }
    // ②拡大時：画面中央でウィンドウの幅が上下に広がる
    else if (TIME_APPEAR <= elapsedTime && elapsedTime < TIME_EXPAND) {
      var expandHeight = toastAppearHeight + (toastHeight - toastAppearHeight) * (elapsedTime - TIME_APPEAR) / (TIME_EXPAND - TIME_APPEAR);
      layer.canvas.fillRoundRect(etv.appWidth / 4, toastY - expandHeight / 2,
                                 etv.appWidth / 2, expandHeight, 15);
    }
    // ③滞留時：メッセージを表示して指定時間留まる
    else if (TIME_EXPAND <= elapsedTime && elapsedTime < TIME_EXPAND + time) {
      layer.canvas.fillRoundRect(etv.appWidth / 4, toastY - toastHeight / 2, etv.appWidth / 2, toastHeight, 15);
      layer.canvas.fillStyle = "white";

      // 文字を自動調整して描画
      ViewUtl.fillTextAutoFit(layer, message, etv.appWidth / 4 + 10, toastY - toastHeight / 2, etv.appWidth / 2 - 10, toastHeight, 
                              "'Helvetica-Light', 'Meiryo', sans-serif", etv.matterSize);
    }

    layer.canvas.globalAlpha = 1.0;
  };

  // エフェクト有効期限超過時の処理（任意）
  this.onExpired = function() {
    etnToastSlot[self.useSlot] = false;
  };

  // EtnToast作成時に、使用スロットの決定
  this.useSlot = 0;
  for (var s = 0; s < etnToastSlot.length; s++) {
    if (etnToastSlot[s] == false) {
      this.useSlot = s;
      break;
    }
  }
  etnToastSlot[this.useSlot] = true;

  var self = this;
}
// EtnToastの表示スロット
var etnToastSlot = [false, false, false];
var ETN_TOAST_SLOT_Y_POS = [ 0, 1, -1 ];


// スプライトアニメーションエフェクトのテスト
// TODO:継承うまくいかないのでベタ
function MikuMikuWalk(layer, posLog) {
  // エフェクトを描画するレイヤ(Shape)
  this.layer = layer;
  // エフェクトに起因になった論理座標の物理座標変換
  var posPhs = ViewUtl.toPosPhs(posLog);
  // エフェクトを開始した時刻[ms]
  var startTime = new Date();
  // エフェクトの有効期限が超過したかを返す
  this.isExpired = function() {
    return new Date() - startTime > duration;
  };
  // エフェクト描画を行なう（描画実体はdraw()で定義する）
  this.execDrawing = function() {
    var elapsedTime = new Date() - startTime;
    draw(elapsedTime / duration);
  };

  // 以下が独自部分
  // エフェクトが有効な時間[ms]
  var duration = 5000;

  // スプライトシートの定義
  // http://tmlife.net/programming/javascript/tmlib-js-animationsprite-top-forwarding-animation.html
  var ss = tm.asset.SpriteSheet({
    image: "cutin",
    frame: {
      width: 250,
      height: 250,
      count: 36
    },
    animations: {
      "cutin" : [0, 35, "cutin", 5]
    }
  });

  var anm;
  // アニメーションスプライトオブジェクトの生成
  var createSprite = function(x, y) {
    anm = tm.app.AnimationSprite(ss, 250, 250);
    anm.position.set(x, y);
    anm.gotoAndPlay("cutin");

    layer.addChild(anm);

    return anm;
  };

  var first = true;

  // エフェクト描画の定義
  var draw = function(progressRate) {
    if (first) {
      // createSprite(posPhs.x + etv.cellWidth  / 2 + etv.effOfsX - layer.width / 2, 
      //              posPhs.y + etv.cellHeight / 2 + etv.effOfsY - layer.height / 2);
      createSprite(0, 0);
      first = false;
    }
  };

  // エフェクト有効期限超過時の処理（任意）
  this.onExpired = function() {
    layer.removeChild(anm);
  };
}

// スプライトアニメーションエフェクトのテスト2
// TODO:継承うまくいかないのでベタ
function SakiTsumo(layer, posLog) {
  // エフェクトを描画するレイヤ(Shape)
  this.layer = layer;
  // エフェクトに起因になった論理座標の物理座標変換
  var posPhs = ViewUtl.toPosPhs(posLog);
  // エフェクトを開始した時刻[ms]
  var startTime = new Date();
  // エフェクトの有効期限が超過したかを返す
  this.isExpired = function() {
    return new Date() - startTime > duration;
  };
  // エフェクト描画を行なう（描画実体はdraw()で定義する）
  this.execDrawing = function() {
    var elapsedTime = new Date() - startTime;
    draw(elapsedTime / duration);
  };

  // 以下が独自部分
  // エフェクトが有効な時間[ms]
  var duration = 700*3;

  // スプライトシートの定義
  // http://tmlife.net/programming/javascript/tmlib-js-animationsprite-top-forwarding-animation.html
  var ss = tm.asset.SpriteSheet({
    image: "cutin2",
    frame: {
      width: 512+1,
      height: 288,
      count: 10
    },
    animations: {
      "cutin2" : [0, 9, "cutin2", 2]
    }
  });

  var anm;
  // アニメーションスプライトオブジェクトの生成
  var createSprite = function(x, y) {
    anm = tm.app.AnimationSprite(ss, 512, 288);
    anm.position.set(x, y);
    anm.gotoAndPlay("cutin2");

    layer.addChild(anm);

    return anm;
  };

  var first = true;

  // エフェクト描画の定義
  var draw = function(progressRate) {
    if (first) {
      // createSprite(posPhs.x + etv.cellWidth  / 2 + etv.effOfsX - layer.width / 2, 
      //              posPhs.y + etv.cellHeight / 2 + etv.effOfsY - layer.height / 2);
      createSprite(0, 0);
      first = false;
    }
  };

  // エフェクト有効期限超過時の処理（任意）
  this.onExpired = function() {
    layer.removeChild(anm);
  };
}

// 画面暗転エフェクト
// TODO:継承うまくいかないのでベタ
function EffectBlackDown(layer, posLog) {
  // エフェクトを描画するレイヤ(Shape)
  this.layer = layer;
  // エフェクトに起因になった論理座標の物理座標変換
  // var posPhs = ViewUtl.toPosPhs(posLog);   // 画面全体に掛かるため不要
  // エフェクトを開始した時刻[ms]
  var startTime = new Date();
  // エフェクトの有効期限が超過したかを返す
  this.isExpired = function() {
    return new Date() - startTime > duration;
  };
  // エフェクト描画を行なう（描画実体はdraw()で定義する）
  this.execDrawing = function() {
    var elapsedTime = new Date() - startTime;
    draw(elapsedTime / duration);
  };

  // 以下が独自部分
  // エフェクトが有効な時間[ms]
  duration = Number.MAX_VALUE;   // ずっと有効
  var EXPAND_TIME = 800;   // 暗転部分が広がるまでの時間[ms]

  // エフェクト描画の定義
  var draw = function(progressRate) {
    var elapsedTime = new Date() - startTime;
    var blackDownHeight = layer.height * (elapsedTime > EXPAND_TIME ? 1.0 : elapsedTime / EXPAND_TIME);

    var grad = layer.canvas.context.createLinearGradient(0, 0, 0, blackDownHeight);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    layer.canvas.fillStyle = grad;
    layer.canvas.fillRect(0, 0, layer.width, blackDownHeight);
  };
}

// 紙吹雪エフェクト
// 参考：http://jsdo.it/tsubao/iR2g
// TODO:継承うまくいかないのでベタ
function EffectPaperParticle(layer, posLog) {
  // エフェクトを描画するレイヤ(Shape)
  this.layer = layer;
  // エフェクトに起因になった論理座標の物理座標変換
  // var posPhs = ViewUtl.toPosPhs(posLog);   // 画面全体に掛かるため不要
  // エフェクトを開始した時刻[ms]
  var startTime = new Date();
  // エフェクトの有効期限が超過したかを返す
  this.isExpired = function() {
    return new Date() - startTime > duration;
  };
  // エフェクト描画を行なう（描画実体はdraw()で定義する）
  this.execDrawing = function() {
    var elapsedTime = new Date() - startTime;
    draw(elapsedTime / duration);
  };

  // 以下が独自部分
  // エフェクトが有効な時間[ms]
  duration = Number.MAX_VALUE;   // ずっと有効

  var tickets = [];
  for (var i = 0; i < 10; i++) {
    tickets.push(new Ticket(tm.util.Random.randint(0, layer.width), 0));
  }

  // エフェクト描画の定義
  var draw = function(progressRate) {
    var elapsedTime = new Date() - startTime;

    tickets.push(new Ticket(tm.util.Random.randint(0, layer.width), 0));
    
    for (var t = 0; t < tickets.length; t++) {
      tickets[t].dropAndDraw();
      if (tickets[t].y > layer.height) {
        tickets.splice(t, 1);  // 落ちきったticketを配列から削除
      }
    }
  };

  function Ticket(initialX, initialY) {
    var TICKET_SIZE = 10;

    this.x = initialX;
    this.y = initialY;
    this.color = "hsl(" + tm.util.Random.randint(0, 360) + ", 100%, 50%)";

    this.dropAndDraw = function() {
      this.y += 10;
      layer.canvas.fillStyle = this.color;
      layer.canvas.fillRect(this.x, this.y, TICKET_SIZE, TICKET_SIZE);
    };
  }
}
