/*
 * 環境に依存する設定
 */

// サーバURL(負荷分散対応)
// GnuGo I/F (gnugoif.php) サーバURL
var ETN_GNUGO_IF_URL   = (function(){
      // 分散先GnuGoサーバリスト
      var gnugoServers = ["https://WEB_HOST/gnugoif.php",];
      return gnugoServers[new Date().getTime() % gnugoServers.length];
    })();
// DataBase I/F (dbif.php) サーバURL
var ETN_DB_IF_URL      = "https://WEB_HOST/dbif.php";
// Session I/F (sessionif.php) サーバURL
var ETN_SESSION_IF_URL = "https://WEB_HOST/sessionif.php";

// 汎用：サーバURL
var ETN_SERVER_URL      = "https://WEB_HOST/";

