import { useEffect, useRef, useState } from 'react';
import * as tmPose from '@teachablemachine/pose';

const IndexPage = () => {
  const [model, setModel] = useState(null);
  const [webcam, setWebcam] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [maxPredictions, setMaxPredictions] = useState(0);
  const [labels,setLabels] = useState([])
  const canvasRef = useRef(null);
//   const [status, setStatus] = useState("other");
  const status = useRef('other')
  const count = useRef(0);

  useEffect(() => {
    async function init() {
      const modelURL = "/models/squat/model.json";
      const metadataURL = "/models/squat/metadata.json";

      // Load the model and metadata
      const loadedModel = await tmPose.load(modelURL, metadataURL);
      setModel(loadedModel);
      setMaxPredictions(loadedModel.getTotalClasses());

      // Setup the webcam
      const size = 200;
      const flip = true;
      const webcamInstance = new tmPose.Webcam(size, size, flip);
      await webcamInstance.setup();
      await webcamInstance.play();
      setWebcam(webcamInstance);

      if (canvasRef?.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        setCtx(context);
    }

 
      window.requestAnimationFrame(loop);
    }

    async function loop() {
      if (webcam) {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
      }
    }

    async function predict() {
      if (!model || !webcam) return;

      const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
      const prediction = await model.predict(posenetOutput);

      if (prediction[0].probability.toFixed(2) > 0.80) {
        if (status.current == "squat") {
            count.current += 1;
         }
        status.current = "stand";
      } else if (prediction[1].probability.toFixed(2) > 0.80) {
        status.current = "squat";
      } else if (prediction[2].probability.toFixed(2) === 1.00) {
        status.current = "bent";
      } else { 
        status.current = "other";
      }

 
      setLabels(prediction);

      drawPose(pose);
    }

    function drawPose(pose) {
      if (ctx && webcam && webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        if (pose) {
          const minPartConfidence = 0.5;
          tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
          tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
      }
    }

    init();
  }, [model, webcam, ctx, maxPredictions, status, count, canvasRef]);

  return (
    <div>
      <h1>Pose Detection</h1>
      <div className='flex justify-between p-3'>
        <canvas width={300} height={300} ref={canvasRef} id="canvas"></canvas>
        <div>
            {/* <div className='text-md'>
                {labels.map((el,index)=><div key={index}>{el.className}: {el.probability.toFixed(2)}</div>)}
            </div> */}
            <div>Count: {count.current}</div>
            <div>Status: {status.current}</div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
