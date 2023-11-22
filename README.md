# Overview

switch bot client
API version 1.1

# Install

```bash
npm i switchbot-handler
```

# Documents

[https://hiroshi-sugimura.github.io/switchbot-handler.js/](https://hiroshi-sugimura.github.io/switchbot-handler.js/)

# SwitchBot API Limit

- The amount of API calls per day is limited to 10000 times. Going over that limit will return "Unauthorized."

1日当たり1万回がAPIコールの上限になっているようです。
毎分コールすると$24[h] \times 60[min] = 1440[calls]$となりますが、実際には各デバイスで状態確認の通信をするので、およそ7デバイス以上あると上限に達するようです。

$10000[calls] / 1440[calls] = 6.94[calls]$

コール間隔を調整するか、状態確認デバイスを切り分けるべきです。


## Authors

神奈川工科大学  創造工学部  ホームエレクトロニクス開発学科; Dept. of Home Electronics, Faculty of Creative Engineering, Kanagawa Institute of Technology

杉村　博; SUGIMURA Hiroshi

## thanks

Thanks to Github users!

## License

MIT License

```
-- License summary --
o Commercial use
o Modification
o Distribution
o Private use
x Liability
x Warranty
```


## Log

- 1.0.1 setコマンドのdebug
- 1.0.0 少し開発が落ち着いた
- 0.0.2 状態設定できるようになった
- 0.0.1 データ取得できるようになったので公開
