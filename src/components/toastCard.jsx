import React, { useState, useEffect, useRef } from 'react';

const ToastCard = ({ message, initialDuration, onClose }) => {
  const [duration, setDuration] = useState(initialDuration);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / duration) * 100;

      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        onClose();
      }
    };

    requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(updateProgress);
    };
  }, [duration, onClose]);

  const handleCancel = () => {
    setProgress(0);
    setDuration(0);
    onClose();
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-4 rounded shadow-md flex flex-col items-center">
      <div className="mb-2">{message}</div>
      <div className="bg-green-500 h-2 rounded" style={{ width: `${progress}%` }} />
      <button
        className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  );
};

export default ToastCard;
