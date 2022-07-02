gcc4.0以上では、同一変数にexternとstaticが両方宣言されているとエラーを出す。
http://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q1160976416
http://blog.livedoor.jp/odaxsen/archives/594112.html
http://thebbl.hideyosi.com/material/99.html

patternsフォルダでは、
mkpat.c が *.dbファイル を読み込んで、*.c を自動生成するが、
自動生成ソースでexternとstaticの重複が発生する。
(初めのextern宣言が、後のstatic宣言(定義)のプロトタイプ宣言的な役割をする)

そのため、mkpat.c で extern宣言をコメントアウトするように修正する。

しかし、それでは
read_attack.c と read_defend.c の 2つでエラーになる(定義順がクロスしているため)ため、
そこは手動で修正する。(使用するstatic関数のプロトタイプ宣言を追加)

