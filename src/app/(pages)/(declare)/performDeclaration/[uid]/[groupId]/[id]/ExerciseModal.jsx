import { useEffect, useRef, useState } from 'react';
import * as tmPose from '@teachablemachine/pose';
import { createRoot } from "react-dom/client";

const ConfirmModal = ({exerciseType, minCount ,onConfirm, handleClose }) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
  
    setTimeout(async() => {
        if(count.current >= minCount){
        onConfirm();
        if(webcam.current){
            webcam.current.stop();
        }
        setTimeout(() => handleClose(), 1);
        setShowModal(false);
      }else{
        const res = confirm('모든 횟수를 채우지 못하면 완료 처리되지 않습니다. 종료하시겠습니까?');
        if(res){
            setTimeout(() => handleClose(), 1);
            setShowModal(false);
        }
      }}, 1);
  };



  useEffect(() => {
    setTimeout(() => setShowModal(true), 1);
  }, []);

  const [model, setModel] = useState(null);
  const webcam = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [maxPredictions, setMaxPredictions] = useState(0);
  const canvasRef = useRef(null);
//   const [status, setStatus] = useState("other");
  const status = useRef('other')
  const count = useRef(0);
  
  const close = async () => {
    const res = confirm('모든 횟수를 채우지 못하면 완료 처리되지 않습니다. 종료하시겠습니까?');
    if(res){
        setTimeout(() => handleClose(), 1);
        setShowModal(false);
        if(webcam.current){
            await webcam.current.stop();
        }
    }
    
  };

  const getModelUrl = (exerciseType)=>{
    switch(exerciseType){
        // "스쿼트", "런지", "푸시업", "브이업",'파이크 푸시업', '레그레이즈'
        case '스쿼트':
            return "/models/squat/model.json";
        case '런지':
            return "/models/lunge/model.json";
        case '푸시업':
            return "/models/pushup/model.json";
        case '브이업':
            return "/models/vup/model.json";
        case '파이크 푸시업':
            return '/models/pike/model.json';
        case '레그레이즈':
            return '/models/legraise/model.json';        
    }
  }
  const getMetadataUrl = (exerciseType)=>{
    switch(exerciseType){
        // "스쿼트", "런지", "푸시업", "브이업",'파이크 푸시업', '레그레이즈'
        case '스쿼트':
            return "/models/squat/metadata.json";
        case '런지':
            return "/models/lunge/metadata.json";
        case '푸시업':
            return "/models/pushup/metadata.json";
        case '브이업':
            return "/models/vup/metadata.json";
        case '파이크 푸시업':
            return '/models/pike/metadata.json';
        case '레그레이즈':
            return '/models/legraise/metadata.json';        
    }
  }

  useEffect(() => {
    async function init() {
      const modelURL = getModelUrl(exerciseType);
      const metadataURL = getMetadataUrl(exerciseType);

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
      webcam.current = webcamInstance;

      if (canvasRef?.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        setCtx(context);
    }

 
      window.requestAnimationFrame(loop);
    }

    async function loop() {
      if (webcam.current) {
        webcam.current.update();
        await predict();
        window.requestAnimationFrame(loop);
      }
    }

    async function predict() {
      if (!model || !webcam.current) return;

      const { pose, posenetOutput } = await model.estimatePose(webcam.current.canvas);
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

      drawPose(pose);
    }

    function drawPose(pose) {
      if (ctx && webcam.current && webcam.current.canvas) {
        ctx.drawImage(webcam.current.canvas, 0, 0);
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
    <>
      <div
        style={{
          position: "fixed",
          top: showModal ? "0" : "-100%",
          left: "0",
          right: "0",
          bottom: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: showModal ? "1" : "0",
          pointerEvents: showModal ? "auto" : "none",
          transition: "all 0.3s ease-in-out",
          zIndex: 15,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-secondary-700 mb-4 text-center">Exercise Check</h2>
              
              <div className="mb-6 text-center">
                <h3 className="text-xl font-semibold text-secondary-700 mb-2">{exerciseType}</h3>
                <p className="text-secondary-500 mb-2">Goal: {minCount} reps</p>
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="w-full max-w-md mb-4">
                  <canvas
                    width={400}
                    height={400}
                    ref={canvasRef}
                    id="canvas"
                    className="mx-auto border border-secondary-200 rounded-lg"
                  ></canvas>
                </div>
                <div className="w-full max-w-md">
                  <div className="bg-secondary-100 p-4 rounded-lg text-center">
                    <p className="text-lg font-semibold mb-2">Count: <span className="text-primary-500">{count.current}</span></p>
                    <p className="text-lg font-semibold">Status: <span className="text-accent-500">{status.current}</span></p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  className="bg-primary-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 transition duration-300"
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
                <button
                  className="bg-danger-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-danger-700 transition duration-300"
                  onClick={close}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


const confirmModal = (onConfirm, exerciseType, minCount) => {
  const handleClose = () => {
    const modalRoot = document.getElementById("modal-confirm-portal-wrapper");
    if (modalRoot) modalRoot.remove();
  };
  if (typeof window !== "undefined") {
    const subDiv = document.createElement("div");
    subDiv.id = "modal-confirm-portal-wrapper";
    document.body.appendChild(subDiv);

    const root = createRoot(subDiv);
    root.render(
      <ConfirmModal
        minCount={minCount}
        onConfirm={onConfirm}
        exerciseType={exerciseType}
        handleClose={handleClose}
      />
    );
  }
};

export default confirmModal;