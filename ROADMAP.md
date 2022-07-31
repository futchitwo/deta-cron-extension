# TODO
- interval 廃止？
- day month
  - Use https://github.com/beemhq/aws-cron-parser
- cron api が 4XX 5XX エラーになったときの例外処理

# ISSUE
## improve
- クーロンクソ（n日後ができない）からやめる
  - 曜日とかは需要が不明だから分からん
  - 独自記法　OR 独自cronフィールド
  - 年やめようぜ
  - 前回実行を記憶する必要がある

## feature
- db から設定
- 同時実行しないオプション
- イベントの前後関係を保証するオプション

### いる？
- ○◯からランダム分経ったイベント
- 重複したらずらす

## bug

## other
- 順番前後を許容するか
  - コスパ悪いのでいまはなし
- 関数側からcronタイトル知りたい
  - cronタイトル
  - DetaBase 使う必要
    - `{ next: { title, baseTime } }`
- 複数予約vs一つ先だけ予約
  - 複数
    - 順番前後ができる
    - Baseが必要
    - 定時実行ジョブがいる？
  - ひとつ

# MEMO
## cronをいつ実行するか
- 毎週
- 毎日
- 毎時間
  - 最上層と TZいい感じに

get db

create cronlist

  get config
  
    set itr
  
    randomize
  
  create cron

  set cron
  
  set db

do function


