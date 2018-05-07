# facial-landmark-detection-test

**Caution: This is an experimental repository**

web カメラを使った facial landmark detection(顔器官検出) のテスト

使用ライブラリは以下の 2 つ

* https://github.com/justadudewhohacks/opencv4nodejs
* https://github.com/justadudewhohacks/face-recognition.js

Linux(ArchLinux) でしか動作確認していない

## Usage

```console
$ yarn install
$ node facemark_cv.js   # justadudewhohacks/opencv4nodejs
$ node facemark_dlib.js # justadudewhohacks/face-recognition.js
```

## note

`facemark_dlib.js` を使うと描写がちらつくが、これは検出された特徴点の描写を無理やり消してるからで検出自体のタイムラグはそれほどないと思う
