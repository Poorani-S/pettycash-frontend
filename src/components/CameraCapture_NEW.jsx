import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

/**
 * CameraCapture
 * Opens the device camera, captures ONE image, immediately stops the camera,
 * shows a preview, and passes the File back to the parent via onCapture(file).
 *
 * Key fix: <video> and <canvas> are ALWAYS in the DOM (just hidden) so refs
 * are always valid when startCamera() runs.
 */
const CameraCapture = ({ onCapture, label = "Capture Receipt" }) => {
  const [phase, setPhase] = useState("idle"); // idle | loading | preview | captured
  const [capturedUrl, setCapturedUrl] = useState(null);
  const [capturedFileName, setCapturedFileName] = useState(null);
  const [camError, setCamError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  //  stop all tracks + clear video source 
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // clean up on unmount
  useEffect(() => () => stopStream(), [stopStream]);

  //  open camera 
  const startCamera = async () => {
    setCamError(null);
    setPhase("loading");

    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError("Camera is not supported in this browser.");
      setPhase("idle");
      return;
    }

    try {
      // prefer rear camera, fall back to any
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;

      // videoRef is always mounted (hidden in DOM), so this is safe
      const video = videoRef.current;
      video.srcObject = stream;

      // wait for metadata (gives us videoWidth/videoHeight)
      await new Promise((resolve, reject) => {
        const tid = setTimeout(
          () => reject(new Error("Camera timed out — try again.")),
          8000
        );
        video.onloadedmetadata = () => {
          clearTimeout(tid);
          resolve();
        };
      });

      await video.play();
      setPhase("preview");
    } catch (err) {
      stopStream();
      let msg = "Unable to access camera.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")
        msg = "Camera permission denied. Enable camera access in browser settings.";
      else if (err.name === "NotFoundError")
        msg = "No camera found on this device.";
      else if (err.name === "NotReadableError")
        msg = "Camera is already in use by another app.";
      else if (err.message)
        msg = err.message;
      setCamError(msg);
      setPhase("idle");
      toast.error(msg);
    }
  };

  //  take the photo 
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      toast.error("Camera not ready — please try again.");
      return;
    }
    if (!video.videoWidth || !video.videoHeight) {
      toast.error("Video stream not ready yet. Please wait a moment.");
      return;
    }

    // draw current frame to canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    // stop camera IMMEDIATELY — light off
    stopStream();

    // convert canvas  blob  File
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.size === 0) {
          toast.error("Failed to capture image — please try again.");
          setPhase("idle");
          return;
        }

        const timestamp = Date.now();
        const fileName = `camera-capture-${timestamp}.jpg`;
        const file = new File([blob], fileName, {
          type: "image/jpeg",
          lastModified: timestamp,
        });

        const previewUrl = URL.createObjectURL(blob);
        setCapturedUrl(previewUrl);
        setCapturedFileName(fileName);
        setPhase("captured");

        if (typeof onCapture === "function") {
          onCapture(file, fileName);
        }

        toast.success("Image captured and ready for submission!");
      },
      "image/jpeg",
      0.92
    );
  };

  //  close camera 
  const handleClose = () => {
    stopStream();
    setPhase("idle");
    setCamError(null);
  };

  //  retake 
  const retake = () => {
    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    setCapturedUrl(null);
    setCapturedFileName(null);
    setCamError(null);
    startCamera(); // this also sets phase = "loading"
  };

  //  render 
  return (
    <div className="space-y-3">

      {/* Always-mounted video + canvas (hidden until preview phase) */}
      <video
        ref={videoRef}
        className={`w-full aspect-video object-cover rounded-xl ${phase === "preview" ? "block" : "hidden"}`}
        autoPlay
        playsInline
        muted
      />
      <canvas ref={canvasRef} className="hidden" />

      {/*  Error banner  */}
      {camError && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{camError}</span>
        </div>
      )}

      {/*  IDLE: open camera button  */}
      {phase === "idle" && (
        <button
          type="button"
          onClick={startCamera}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
           {label}
        </button>
      )}

      {/*  LOADING  */}
      {phase === "loading" && (
        <div className="flex items-center justify-center gap-2 py-6 text-purple-700 font-medium bg-gray-50 rounded-xl">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Opening camera
        </div>
      )}

      {/*  PREVIEW: capture / close buttons below video  */}
      {phase === "preview" && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={capturePhoto}
            className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
             Capture Photo
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
            Close
          </button>
        </div>
      )}

      {/*  CAPTURED: preview image + file name + retake  */}
      {phase === "captured" && capturedUrl && (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border-4 border-green-500 shadow-lg">
            <img
              src={capturedUrl}
              alt="Captured"
              className="w-full object-contain max-h-72"
            />
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
               Captured
            </div>
          </div>

          <div className="bg-green-50 border border-green-300 rounded-lg px-4 py-3 flex items-center gap-2 text-green-800 text-sm font-medium">
            <svg className="w-5 h-5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="truncate"> {capturedFileName} – ready to submit</span>
          </div>

          <button
            type="button"
            onClick={retake}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retake Photo
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
