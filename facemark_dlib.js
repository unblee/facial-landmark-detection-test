// パッケージの example を web カメラ対応にした感じ
// https://github.com/justadudewhohacks/face-recognition.js/tree/master/examples

const cv = require("opencv4nodejs");
const fr = require("face-recognition").withCv(cv);

const webcamPort = 0;
const cap = new cv.VideoCapture(webcamPort);

const win = new fr.ImageWindow();
setInterval(() => {
  win.clearOverlay();
}, 100);

const detector = new fr.FrontalFaceDetector();
const predictor = fr.FaceLandmark68Predictor();

setInterval(() => {
  const frame = cap.read();

  // https://github.com/justadudewhohacks/face-recognition.js/issues/13#issuecomment-357607857
  const imageCv = fr.CvImage(frame);
  const imageRgb = fr.cvImageToImageRGB(imageCv);

  const faceRects = detector.detect(imageRgb);
  const shapes = faceRects.map(rect => predictor.predict(imageRgb, rect));
  win.setImage(imageRgb);
  win.renderFaceDetections(shapes);
}, 0);
