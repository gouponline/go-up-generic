// ヘルプコードの定義
var ETN_HELP = {};
ETN_HELP.HELP     =   1;  // 通常操作ヘルプ
ETN_HELP.TUTORIAL = 100;  // チュートリアル


// ヘルプの表示
function showHelp(helpCode) {
  var helpDiv = document.getElementById('help');  // help表示先Div

  var helpContent = null;  // ヒアドキュメントでのhtml代入: http://qiita.com/_shimizu/items/837b529de9f3302e315c

  switch(helpCode) {
    // 通常操作ヘルプ
    case ETN_HELP.HELP:
      // 画面中央に大きく表示
      helpDiv.style.top  = "50%";
      helpDiv.style.left = "50%";
      helpDiv.style.width  = "80%";
      helpDiv.style.height = "90%";
      helpDiv.style.backgroundColor = "rgba(27, 184, 188, 0.9)";
helpContent = (function () {/*
<span style="font-size: large;">簡易ヘルプ</span><br>
■ルール<br>
<a href="tutorial.html" target="_blank">チュートリアル</a>で解説しています。<br>
※以下のサイトでは更に詳しく説明されています。<br>
・<a href="https://way-to-go.gitlab.io/#/ja/intro" target="_blank">インタラクティブ囲碁入門</a><br>
・<a href="https://yasashiigo.com/" target="_blank">やさしい囲碁入門講座</a><br>
・<a href="https://hikarugo.com/" target="_blank">世界一やさしい囲碁ブログ</a><br>
・<a href="https://play.google.com/store/apps/details?id=com.webserva.wings.android.puzzlego" target="_blank">StonePuzzle(Androidアプリ)</a><br>
<br>
■操作<br>
◎石を置く<br>
・1タッチモード: PC等での初期操作方法<br>
　盤上の石を置きたい場所をクリック or タッチすると即座に石が置かれる。<br>
　操作数が少ないモード。<br>
・2タッチモード: スマートフォン・タブレット等での初期操作方法<br>
　盤上の石を置きたい場所をクリック or タッチすると、仮置きされる。<br>
　OKボタンを押すと確定する。<br>
　別の場所に変更したい場合は、その場所をクリック or タッチする。<br>
　操作ミスが少ないモード。<br>
<br>
◎ボタン説明<br>
・Undo: 一つ前の着手を元に戻します。<br>
・Pass: パスします。（双方のパスで終局判定に移ります。）<br>
・Sound: BGM・効果音のOn/Offを切り替えます。<br>
・Option: 設定変更画面を開きます。(設定は端末毎に保存されます)<br>
・Help: このヘルプを表示します。<br>
※キャラ画像部クリック or タッチで、表示モード切替(通常→背景確認→背景非表示)
*/}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
      break;
    // チュートリアル
    case ETN_HELP.TUTORIAL:
      // 入門で対局途中に表示されるチュートリアルは、内容いまいちだし・邪魔だし・iPhoneだと異常に遅くなるので、もう使用しない
      // (別立てのチュートリアルを作成したのでもう不要)
      break;
      // 以下、旧コードそのまま

      // 入門レベル時・自分の手番でのみ表示
      if (gm.cpuLevel != 0 || gm.gameState.nextSide != SIDE.A) {
        return;
      }

      // 画面脇に小さめに表示
      helpDiv.style.top  = "80%";
      helpDiv.style.left = "65%";
      helpDiv.style.width  = "60%";
      helpDiv.style.height = "20%";
      helpDiv.style.backgroundColor = "rgba(27, 184, 188, 0.7)";
      switch(gm.gameState.playCount) {
        case 1:
        case 2:
helpContent = (function () {/*
Go-Up!へようこそ！<br>
入門では簡単ですが囲碁のルールを説明します。
*/}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
          break;
        case 3:
        case 4:
helpContent = (function () {/*
石を白黒交互に、碁盤の線の交わった点に打ちます。<br>
オセロのように、マス目の中ではありません。<br>
*/}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
          break;
        case 5:
        case 6:
helpContent = (function () {/*
置いた石は四方の線で呼吸していて、四方の1つでも開いていれば生きてます。<br>
盤の端っこ(辺)や角(隅)では、呼吸できる線が1つ・2つ少ないです。
*/}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
          break;
        case 7:
        case 8:
helpContent = (function () {/*
呼吸できる点(呼吸点)を全て相手の石でふさがれると、死んでしまい盤上から取り除かれます。<br>
辺や隅は追い詰められやすくて不利ですね！
*/}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
          break;
        case 9:
        case 10:
helpContent = (function () {/*
同じ色の石をくっつけると、繋がった石(群)の周り全てが呼吸点になります。<br>
呼吸点が少なくなったら、石をつなげて助け出しましょう！
*/}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
          break;
        case 11:
        case 12:
helpContent = (function () {/*
ただし石が繋がるのは上下左右のみで、斜めに置いても繋がったとみなされません。
*/}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
          break;
        case 13:
        case 14:
helpContent = (function () {/*
はじめから呼吸ができないところに石は置けません。（自殺できません。）<br>
ただし、相手の石が取れる場所には置くことができます。
*/}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
          break;
        case 15:
        case 16:
helpContent = (function () {/*
群の中に相手が呼吸できない場所(眼)が2つ以上あると、絶対に取られません。(「二眼」といいます)<br>
しっかりした眼を作ることが、石を活かすコツです。
*/}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
          break;
        case 17:
        case 18:
helpContent = (function () {/*
取ったり取られたりを永遠に繰り返す形になる場合、一旦別の場所に打たないといけません。<br>
「コウ」というルールで、画面上に「×」マークが付きます。
*/}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
          break;
        case 19:
        case 20:
helpContent = (function () {/*
コウは難しく奥が深いルールなので、今は気にしなくて構いません。<br>
うまく使うと二手連続で打てるようなことにもなるので、研究してみてください。
*/}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
          break;
        case 21:
        case 22:
helpContent = (function () {/*
打ちたいところがなくなったら、「パス」します。(「Pass」ボタン)<br>
両者連続パスすると、対局終了となります。
*/}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
          break;
        case 23:
        case 24:
helpContent = (function () {/*
終局時に、どうやっても活きられない石は自動判定されます。（×が付く）<br>
自動判定に問題なければ、OKボタンを押します。
*/}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
          break;
        case 25:
        case 26:
helpContent = (function () {/*
勝敗は、取った石の数ではなく、自分の石で囲んだ陣地の広さで決まります。<br>
そのため、時には自分の石を囮にして陣地を増やすのもテクニックです。
*/}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
          break;
        case 27:
        case 28:
helpContent = (function () {/*
いかに効率良く石が死なないぎりぎりで広く囲うか、良い場所に相手より先に打てるかがポイントになります。<br>
楽しんでください！
*/}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, "");
          break;
      }
  }

  if (helpContent != null) {
    // 内容を設定して、閉じるリンクを加えて、表示
    helpDiv.innerHTML = helpContent; // + "<p><div style='font-size:large; text-align:center;'><a href='javascript:void(0);' onclick='document.getElementById(\"help\").style.display=\"none\";'>閉じる</a></span>";
    helpDiv.style.display = "block";
  }
}
