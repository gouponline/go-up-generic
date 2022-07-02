<?php

// eternaryの全ページのphp冒頭で共通で行う、初期処理
function etnInit() {
  global $kids, $mode;

  // キッズモードのセット
  $kids = 0;

  // モード番号の指定
  $mode = 0;
}

// eternary内部リンク先ファイル名とURLパラメータ文字列から、<a>タグの属性定義部を生成する
//  リンク先ファイルの更新日時を URLパラメータverに設定する(iOSホーム起動時のキャッシュ強制クリア対応)
//  第3引数(省略可能)で、遷移前(onclick時)に実行されるスクリプトを追加可能
//  第4引数(省略可能)にfalseで、このページを履歴に積まず、リンク遷移後の戻るボタンでこのページに戻らないようにする
//  第5引数(省略可能)にtrueで、親要素へのclickイベント伝播を停止する(リンクの親要素にイベント設定している場合に使用)
function getInternalLinkAttr($dstFile, $urlParamStr = "", $preCallScript = "", $canBack = true, $stopPropagation = false) {
  global $kids, $mode;

  // リンク先URL
  $url = $dstFile;
  // 更新日時
  $url .= "?ver=" . date("ymdHi", filemtime($dstFile));
  // URLパラメータ
  if ($urlParamStr != "") {
    $url .= "&" . $urlParamStr;
  }
  // URL遷移関数記述
  $urlTravDesc = sprintf($canBack ? "window.location=\"%s\"" : "location.replace(\"%s\")", $url);

  // 属性(href, onclick)
  $attr = "href='" . $url . "' " .
          "onclick='" . $preCallScript . ";" .
                        $urlTravDesc . ";" .
                        ($stopPropagation ? "arguments[0].stopPropagation();" : "") . // 親要素へのイベント伝播停止
                        "return false;'";
  return $attr;
}


// eternary独自の短縮SGFを、通常のSGF形式に変換する
//   短縮SGF:                19,   7.5,                          jd    hc   __   ek   __
//   正規SGF: (;GM[1]FF[4]SZ[19]KM[7.5]RU[Chinese]AP[eternary];B[jd];W[hc];B[];W[ek];B[];)
// in  : ssgf : 短縮SGF文字列
// out :  sgf : 正規のSGF形式の文字列
function decodeSGF($ssgf) {
  // カンマ区切りで分割
  list($sz, $km, $bw) = explode(",", $ssgf);

  // SGFヘッダ部
  $sgf = "(;GM[1]FF[4]SZ[" . $sz . "]KM[" . $km . "]RU[Chinese]AP[eternary];";

  // SGF着手座標部
  $isBlack = true;
  for ($i = 0; $i < strlen($bw); $i += 2) {
    $pos = substr($bw, $i, 2);
    $sgf .= ($isBlack ? "B" : "W") . "[" . ($pos == "__" ? "" : $pos) . "];";
    $isBlack = !$isBlack;
  }

  // SGFフッタ部
  $sgf .= ")";

  return $sgf;
}


// ソーシャルサイトボタンのhtmlコードを生成する
// 対応サイト：Twitter, Facebook, google+, はてなブックマーク,
// in : url    : ソーシャルブックマーク対象とするページのURL
//      comment: コメントのテキスト(Twitterで使用)
// out: html: ソーシャルボタンのhtmlコード
function getSnsButtonCode($url, $comment) {
  // 複数のソーシャルプラグインをきれいに整列して表示(http://www.waldiz.com/article.php/20120218003102941)
  $html = ''.
//    '<div style="overflow:hidden;margin-top:15px;text-align:right;">' .
    // Twitter (ツイートボタン)
//    '	<div style="float:left;width:120px;height:20px;overflow:hidden;">' .
    '		<a href="https://twitter.com/share" class="twitter-share-button" data-url="' . $url . '" data-text="' . $comment . '" data-lang="ja">ツイート</a>' .
    '		<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>' .
//    '	</div>' .
    // はてなブックマーク
//    '	<div style="float:left;width:60px;height:20px;overflow:hidden;">' .
    '		<a href="https://b.hatena.ne.jp/entry/' . $url . '" class="hatena-bookmark-button" data-hatena-bookmark-title="' . $comment . '" data-hatena-bookmark-layout="standard" title="このエントリーをはてなブックマークに追加"><img src="https://b.st-hatena.com/images/entry-button/button-only.gif" alt="このエントリーをはてなブックマークに追加" width="20" height="20" style="border: none;" /></a><script type="text/javascript" src="https://b.st-hatena.com/js/bookmark_button.js" charset="utf-8" async="async"></script>' .
//    '	</div>' .
//    '</div>' .
    '<br>';  // 終端に改行1個。不適切であれば調整する。

    return $html;
}

// モバイルかどうか判別する(UserAgentでのOS判定)
function isMobile() {
  $ua = $_SERVER['HTTP_USER_AGENT'];
  return strpos($ua, "Android") !== false ||
         strpos($ua, "iPhone") !== false ||
         strpos($ua, "iPad") !== false ||
         strpos($ua, "Windows Phone") !== false;
}

// file_get_contents()などで
// SSL通信時の証明書の検証を行わないオプション(サーバの証明書がおかしくなった時のエラー対応)
// ※各file_get_contents()で、file_get_contents(URL, false, stream_context_create($ssloptions)); とする必要がある
// https://qiita.com/izanari/items/f4f96e11a2b01af72846
$ssloptions['ssl']['verify_peer']=false;
$ssloptions['ssl']['verify_peer_name']=false;

?>
