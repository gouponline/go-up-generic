# go-up-generic
[初心者向け囲碁対局サイトGo-Up!](https://go-up.online/) の基本部分のソースコードと、  
使用している囲碁CPU(GnuGo+自作ルーチン)のバイナリ、ソースコードを公開します。  

これを参考にして、囲碁を始めようと思った人が無理なく  
楽しみながら上達できるサイトが増えるとよいと思います。

## 内容
- gnugo  
  - src (ソースコード)
    - archive - 元のGnuGoのzip
    - modified_source - 統一的なI/Fで動作させるために修正したソースの差分
  - bin (CentOS8でビルドしたバイナリ。Webサーバの特定のディレクトリに配置)
- http (Webサーバのhttp公開ディレクトリに配置するもの)

## 説明
### 囲碁CPUについて
#### GnuGo
- 元のGnuGoは以下よりダウンロードしたものです。
  - 公式
    - [GnuGoの公式ftpサイト](http://ftp.gnu.org/gnu/gnugo/)
  - 古いバージョン(公式には存在しない)
    - [osdnの非公式プロジェクト(※現在は消滅)](http://osdn.jp/projects/sfnet_londerings/releases/)
	- [sourceforgeの非公式プロジェクト](https://sourceforge.net/projects/londerings/files/go/old_gnugo/)
- 古いGnuGoはGTP Version2に未対応だったり、SGF読込機能、路数変更機能がなかったりするので、
  必要に応じてGnuGoソース(C言語)を修正しました。
- httpフォルダ内のgnugoif.phpで、  
  バージョンによるI/Fの違いを吸収して、統一的に着手を生成できるようにしています。
  - ここを参考にすると、弱めなCPUが利用可能になります！

#### 自作囲碁ルーチン
- http/etn_cmn.js の中に 2つ存在しています  
  (JavaScript。go-upではこの2つだけクライアント側で動作している。)
  - RandomPlayer()
    - ランダムに着手するCPU
    - レベル「入門」で使用している
  - PrimitivePlayer()
    - とても簡易的な思考ルーチンを持ったCPU
	- 自分がアタリなら逃げる、相手がアタリなら取る・たくさん取れる方を取る、  
	  アタリに突っ込まない、目っぽいところは潰さない、  
	  まだ自陣や敵陣ではないっぽいところに打つ、いきなり一線や二線には打たない、  
	  、くらいのことは考えます
	- 二手以上先は読まないので、シチョウやウッテガエシがばしばし決まります。
	- レベル「初級」で使用している

#### ルーチン混合
- http/etn_cmn.js の ChimeraPlayer() は、  
  2つ以上の異なるCPUをミックスして、強さを調整できます
  - ペア碁みたいな感じです
  - ある手番で弱い方のCPUが見逃したところを、次の手番で強いCPUが打ったりするので、  
    不自然な感覚・手加減されてる感覚を持たれる可能性があります
  - 既存のCPUの棋力に開きがある18～10級で、止む無く採用しています

#### 棋力  
|CPU|Go-Upレーティング値|KGS段級位(2015年頃の)|
|----------|----------|----------|
|RandomPlayer()|21,500|30K未満|
|PrimitivePlayer()|32,996|30K未満|
|GnuGo1.2|41,720|26K|
|liberty1.0|52,814|18K|
|GnuGo2.0|68,108|12K|
|GnuGo2.6|未計測|未計測(11K位)|
|GnuGo3.0 Lv0|75,187|9.5K|
|GnuGo3.2 Lv0|81,105|9K|
|GnuGo3.4 Lv0|未計測|未計測(9K位)|
|GnuGo3.6 Lv0|82,724|8.5K|
|GnuGo3.8 Lv0|82,898|8K|
|GnuGo3.8 Lv5|87,128|7.5K|
|GnuGo3.8 Lv10|88,101|7K|


### その他のコードについて
- Go-Up!の レベル選択・対局・対局結果 のページを簡素化して、
  そのソースやリソースを公開しています。
- あくまで参考としてご使用ください。
  - 流用はそのままだとださいので、デザインなど大幅に変えた方が良いと思います。
  - 以下のファイルは、設定情報を更新する必要があります
    - environment.js (サーバURL)
    - gnugoif.php  (GnuGoバイナリパスなど)
    - menu_head.php  (fontawesomeの固有コード)
    - result.php  (対局結果ツイートボタンのURLなど)
  - 検索エンジンに重複サイトと判定されることを防ぐため、各ページのphpに  
    &lt;meta name="robots" content="noindex,nofollow"&gt;  を入れています。  
    Googleへのindex等を望む場合、デザインなどを大きく変更した後に、上記記述を外していただけますようお願いします。
  - 画像などは、参考のため含めております。
    一応フリーの画像を使用しているはずですが、完全ではないかも知れません。
    サイト公開の際には、ご確認・ご注意をお願いします。
  - 黒番固定になっています…  
    白番もできるようにするには、うまくソースを修正ください。  
	etn_cmn.js内のuserSideという変数を活用すると少し楽だと思います。
  - ソースは囲碁用語を極力使わない、
    別の言葉に置き換えて書かれているので分かりづらいです。  
	一応、対応表を置いておきます。

	|囲碁用語|eternary用語|etn英語名|
	|----------|----------|----------|
	|囲碁|エターナリー|eternary|
	|対局|コンタクト|contact|
	|盤面|ワールド|world|
	|石|マター|matter|
	|敵(石)|アザー|other (side)|
	|捕獲|バニッシュ|vanish|
	|アゲハマ|バニッシュド|vanished|
	|死石|フローズン|frozen|
	|コウ|エターナリー|eternally|
	|色|サイド|side|
	|黒(石)|A|(side)A|
	|白(石)|B|(side)B|
	|手番|ターン|turn|
	|対局者|クリエイター|creator|
	|陣地|ドメイン|domain|
	|パス|パス|pass|
	|投了|ギブアップ|give up|
	|終局|ジャッジメント|judgement|
	|コミ|アヘッド ウェイト|ahead weight|
	|目（眼）|ボイド|void|
	|二眼|マルチボイド|multi void|
	|打つ|アピア|appear|
	|着手|アクティビティ|activity|
	|罫線|グリッド|grid|
	|呼吸点|ライフライン|lifeline|
	|罫線|オクタ|octa|
	|呼吸点|リバティ|liberty|

