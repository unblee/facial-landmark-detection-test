// パッケージの example を web カメラ対応にした感じ
// https://github.com/justadudewhohacks/opencv4nodejs/blob/master/examples/facemark.js

const cv = require("opencv4nodejs");
const fetch = require("node-fetch");
const fs = require("fs");

main();

async function main() {
  const modelFile = "lbfmodel.yaml";
  if (!isExistFile(modelFile)) {
    console.log("Downloading pre-trained model file...");
    // pre-trained model
    const url =
      "https://raw.githubusercontent.com/kurnianggoro/GSOC2017/master/data/lbfmodel.yaml";
    await download(url, modelFile);
    console.log("Downloading completed!");
  }

  const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

  // create the facemark object with the landmarks model
  const facemark = new cv.FacemarkLBF();
  facemark.loadModel(modelFile);

  // give the facemark object it's face detection callback
  facemark.setFaceDetector(frame => {
    const { objects } = classifier.detectMultiScale(frame, 1.12);
    return objects;
  });

  const webcamPort = 0;
  const delay = 1;
  const cap = new cv.VideoCapture(webcamPort);
  setInterval(() => {
    let frame = cap.read();

    // retrieve faces using the facemark face detector callback
    const gray = frame.bgrToGray();
    const faces = facemark.getFaces(gray);

    // use the detected faces to detect the landmarks
    const faceLandmarks = facemark.fit(gray, faces);

    for (let i = 0; i < faceLandmarks.length; i++) {
      const landmarks = faceLandmarks[i];
      for (let x = 0; x < landmarks.length; x++) {
        frame.drawCircle(landmarks[x], 1, new cv.Vec(0, 255, 0), 1, cv.LINE_8);
      }
    }
    cv.imshow("facial landmarks detection", frame);
    const key = cv.waitKey(delay);
  }, 0);
}

function isExistFile(path) {
  try {
    fs.statSync(path);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") return false;
  }
}

async function download(url, dest) {
  const res = await fetch(url);
  const out = fs.createWriteStream(dest);

  await new Promise((resolve, reject) => {
    res.body.pipe(out);
    res.body.on("error", () => {
      reject();
    });
    out.on("finish", () => {
      resolve();
    });
  });
}
