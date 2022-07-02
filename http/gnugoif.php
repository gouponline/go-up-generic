<?php
// https://github.com/jkk/eidogo/blob/master/backend/gnugo.php
// �����ɉ���

// PHP�G���[��\������ݒ�
// �J�����p�B�{�ԉ^�p���͏����B
ini_set("display_errors", On);
error_reporting(E_ALL);

include 'common.php';

// Gnugo�T�[�o�̃z�[���p�X�̎w��
define("PATH_HOME", "/home/username/");
// Gnugo�N���R�}���h�̎w��
define("COMMAND_EXEC", "sudo nice -n 20 ");
// Gnugo�T�[�o��tmp�t�H���_�̎w��
define("GNUGO_TMP", "gnugotmp");
// Gnugo�̃f�t�H���g�o�[�W�����̎w��
define("GNUGO_DEF_VER", "2.6");
// �X�R�A����Ɏg�p����Gnugo�o�[�W�����̎w��
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

// �X�R�A����E�Ֆʏ�Ԕ���
if ($_REQUEST['move'] == "est") {
    $gnugo = COMMAND_EXEC . PATH_HOME . "gnugo-" . ESTIMATE_GNUGO_VER . "/bin/gnugo";

    // �X�R�A����
    $scoreStr = shell_exec($gnugo . " --score --boardsize $size --chinese-rules --komi $komi --infile $sgf_file");
    // score����������ҁA�X�R�A�ɕ�������
    // (GnuGo��score���ʕ�����́A"Black wins by xx.x points","White wins by xx.x points","Jigo"�̂����ꂩ)
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
    else {  // "Jigo"(����)�E����ȊO
      $winner = 0;  // SIDE.O
      $score = 0.0;
    }

    // �Ֆʏ�Ԕ���
    // ���������Ԃ̕������z��
    $stateStr = array("alive", "dead", "seki", "white_territory", "black_territory", "dame");

    // ��Ԕz��̏�����
    for ($c = 0; $c < $size; $c++)
      for ($r = 0; $r < $size; $r++)
        $state[$c][$r] = 0;

    // ��Ԃ̎擾
    for ($s = 0; $s < count($stateStr); $s++) {
      $command_file = @tempnam(PATH_HOME . GNUGO_TMP, "cmd");
      file_put_contents($command_file, "final_status_list $stateStr[$s]\nquit\n");

      $result = shell_exec($gnugo . " --level $level --boardsize $size --chinese-rules --mode gtp --infile $sgf_file --gtp-input $command_file");

      unlink($command_file);

      // ���ʃ��X�g���̍��W�𐳋K�\���Œ��o���z�񉻂���
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
// ���̈�萶��
else {
    $gnugo = COMMAND_EXEC . PATH_HOME . "gnugo-" . $gnugoVer . "/bin/gnugo";
    $move = "";

    // gnugo�G���W�������W������̎擾
    // �V���߂�gnugo:gtp�ɂ��擾
    if ($gnugoVer != "1.2" && $gnugoVer != "1.6" && $gnugoVer != "2.0" && $gnugoVer != "2.6") {
        // tell gnugo to generate a move
        $command_file = @tempnam(PATH_HOME . GNUGO_TMP, "cmd");
        file_put_contents($command_file, "loadsgf $sgf_file\ngenmove_$color\nquit\n");

        // gnugo3.6�ȏ�ł͏���ɓ�������̂ŁA���Ȃ��悤�ɂ���
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
    // gnugo 3.0�����Ή����W�b�N (GTP�ł͂Ȃ�ascii���[�h�Ŏ��̈��𐶐�����)
    // ��gnugo2.0�́Aphp����Ă΂ꂽ�Ƃ���GoModemProtocol���[�h�ł͂Ȃ�ASCII���[�h�ŋN������悤�Ƀ\�[�X�����ς��ăR���p�C������K�v������B
    //   main.c �� int gmp = isatty(0); �Ƃ�����Ă���Ƃ�����Aint gmp = 0; �ɏ���������B
    else {
      $result = shell_exec($gnugo . " -l $sgf_file 2>&1");  // ���ʂ�stderr�ɏo�͂����̂ŁA���_�C���N�g��stdin�ɏo�͂�����

      unlink($sgf_file);

      // �ʏ풅���: white (o) move G12
      // �p�X��    : white (o) move : PASS!
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
// ���ʂ�Ԃ�
// JSONP�`���ŕԂ�
// http://www.brandons.jp/blog/jquery-jsonp-php/
// �}���`�o�C�g������Ԃ��ƕ����R�[�h�z�����K�v�Ȃ̂ŁA�Ԃ��Ȃ��悤�Ɂi�K�v�Ȃ����낤���j
$output = array(
  "result" => $result
);
header('Content-Type: text/javascript; charset=utf-8');

echo sprintf("%s(%s)", $_GET['callback'], json_encode($output));


?>
