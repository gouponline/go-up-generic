<?php
// https://github.com/jkk/eidogo/blob/master/backend/gnugo.php
// を元に改変

// PHPエラーを表示する設定
// 開発時用。本番運用時は消す。
ini_set("display_errors", On);
error_reporting(E_ALL);

include 'common.php';

// Gnugoサーバのホームパスの指定
define("PATH_HOME", "/home/username/");
// Gnugo起動コマンドの指定
define("COMMAND_EXEC", "sudo nice -n 20 ");
// Gnugoサーバのtmpフォルダの指定
define("GNUGO_TMP", "gnugotmp");
// Gnugoのデフォルトバージョンの指定
define("GNUGO_DEF_VER", "2.6");
// スコア推定に使用するGnugoバージョンの指定
define("ESTIMATE_GNUGO_VER", "3.8");

$sgf = decodeSGF($_REQUEST['sgf']);
$color = $_REQUEST['move'] == "W" ? "white" : "black";
$size = (int)$_REQUEST['size'];
$komi = (float)($_REQUEST['komi'] ? $_REQUEST['komi'] : 0);
$level = isset($_REQUEST['level']) ? (int)$_REQUEST['level'] : 0;
$gnugoVer = isset($_GET['ver']) ? $_GET['ver'] : GNUGO_DEF_VER;

// give gnugo our current game state
$sgf_file = @tempnam(PATH_HOME . GNUGO_TMP, "sgf");
file_put_contents($sgf_file, $sgf);

// スコア推定・盤面状態判定
if ($_REQUEST['move'] == "est") {
    $gnugo = COMMAND_EXEC . PATH_HOME . "gnugo-" . ESTIMATE_GNUGO_VER . "/bin/gnugo";

    // スコア推定
    $scoreStr = shell_exec($gnugo . " --score --boardsize $size --chinese-rules --komi $komi --infile $sgf_file");
    // score文字列を勝者、スコアに分解する
    // (GnuGoのscore結果文字列は、"Black wins by xx.x points","White wins by xx.x points","Jigo"のいずれか)
    if (strstr($scoreStr, "Black wins by")) {
      $winner = 1;  // SIDE.A
      preg_match("/\d+\.\d/", $scoreStr, $matches);
      $score = floatval($matches[0]);
    }
    else if (strstr($scoreStr, "White wins by")) {
      $winner = 2;  // SIDE.B
      preg_match("/\d+\.\d/", $scoreStr, $matches);
      $score = floatval($matches[0]);
    }
    else {  // "Jigo"(持碁)・それ以外
      $winner = 0;  // SIDE.O
      $score = 0.0;
    }

    // 盤面状態判定
    // 調査する状態の文字列を配列化
    $stateStr = array("alive", "dead", "seki", "white_territory", "black_territory", "dame");

    // 状態配列の初期化
    for ($c = 0; $c < $size; $c++)
      for ($r = 0; $r < $size; $r++)
        $state[$c][$r] = 0;

    // 状態の取得
    for ($s = 0; $s < count($stateStr); $s++) {
      $command_file = @tempnam(PATH_HOME . GNUGO_TMP, "cmd");
      file_put_contents($command_file, "final_status_list $stateStr[$s]\nquit\n");

      $result = shell_exec($gnugo . " --level $level --boardsize $size --chinese-rules --mode gtp --infile $sgf_file --gtp-input $command_file");

      unlink($command_file);

      // 結果リスト中の座標を正規表現で抽出し配列化する
      preg_match_all("/([A-Z])([0-9]+)/", $result, $matches);
      for ($i = 0; $i < count($matches[0]); $i++) {
        $x = strtolower($matches[1][$i]);
        if (ord($x) >= ord('i'))
          $x = chr(ord($x)-1);
        $x = ord($x) - ord('a');
        $y = $size - (int)$matches[2][$i];

        $state[$x][$y] = $s + 1;
      }
    }
    unlink($sgf_file);

    $result = array("winner" => $winner, "score" => $score, "status" => $state);
}
// 次の一手生成
else {
    $gnugo = COMMAND_EXEC . PATH_HOME . "gnugo-" . $gnugoVer . "/bin/gnugo";
    $move = "";

    // gnugoエンジンより座標文字列の取得
    // 新しめのgnugo:gtpによる取得
    if ($gnugoVer != "1.2" && $gnugoVer != "1.6" && $gnugoVer != "2.0" && $gnugoVer != "2.6") {
        // tell gnugo to generate a move
        $command_file = @tempnam(PATH_HOME . GNUGO_TMP, "cmd");
        file_put_contents($command_file, "loadsgf $sgf_file\ngenmove_$color\nquit\n");

        // gnugo3.6以上では勝手に投了するので、しないようにする
        $neverResign = "";
        if ($gnugoVer == "3.6" || $gnugoVer == "3.8") {
          $neverResign = "--never-resign";
        }

        $result = shell_exec($gnugo . " --level $level --chinese-rules --mode gtp --quiet " . $neverResign . " < $command_file");

        unlink($sgf_file);
        unlink($command_file);

        // $move = substr($result, 2, strpos($result, "\n")-2);
        if (preg_match("/\= (black|white)\n\n\= (\w+)\n/", $result, $matches)) {
            list(,,$move) = $matches;
        }
    }
    // gnugo 3.0未満対応ロジック (GTPではなくasciiモードで次の一手を生成する)
    // ※gnugo2.0は、phpから呼ばれたときもGoModemProtocolモードではなくASCIIモードで起動するようにソースを改変してコンパイルする必要がある。
    //   main.c で int gmp = isatty(0); とかやっているところを、int gmp = 0; に書き換える。
    else {
      $result = shell_exec($gnugo . " -l $sgf_file 2>&1");  // 結果はstderrに出力されるので、リダイレクトでstdinに出力させる

      unlink($sgf_file);

      // 通常着手例: white (o) move G12
      // パス例    : white (o) move : PASS!
      if (preg_match("/[\W\w]*\n(black \(X\)|white \(o\)) move \:?\s?(\w+)/", $result, $matches)) {
          list(,,$move) = $matches;
      }
    }

    if (preg_match("/([A-Z])([0-9]+)/", $move, $matches)) {
        // convert the move to SGF coordinates
        list(,$x, $y) = $matches;
        $x = strtolower($x);
        if (ord($x) >= ord('i')) {
            $x = chr(ord($x)-1);
        }
        $y = chr(($size - $y) + ord('a'));
        $result = "$x$y";
    } elseif (strtoupper($move) == "PASS") {
        $result = "tt";
    } elseif (strpos($move, "resign") !== false) {
        $result = "resign";
    } else {
        $result = "ERROR!\n" . "gnugo move [" . $move . "]\n" . "gnugo result [" . $result . "]";
    }

}
// 結果を返す
// JSONP形式で返す
// http://www.brandons.jp/blog/jquery-jsonp-php/
// マルチバイト文字を返すと文字コード配慮が必要なので、返さないように（必要ないだろうし）
$output = array(
  "result" => $result
);
header('Content-Type: text/javascript; charset=utf-8');

echo sprintf("%s(%s)", $_GET['callback'], json_encode($output));


?>
