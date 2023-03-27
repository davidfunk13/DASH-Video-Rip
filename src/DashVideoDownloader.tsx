import React, { useRef, useEffect, useState } from 'react';

const DashVideoDownloader = ({ videoSrc, audioSrc, filename }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [combinedData, setCombinedData] = useState<Uint8Array>();

  useEffect(() => {
    const combineData = async () => {
      const videoResponse = await fetch(videoSrc);
      const videoBuffer = await videoResponse.arrayBuffer();
      const audioResponse = await fetch(audioSrc);
      const audioBuffer = await audioResponse.arrayBuffer();

      const combinedData = new Uint8Array(videoBuffer.byteLength + audioBuffer.byteLength);
      combinedData.set(new Uint8Array(videoBuffer), 0);
      combinedData.set(new Uint8Array(audioBuffer), videoBuffer.byteLength);

      setCombinedData(combinedData);
    };

    combineData();
  }, [audioSrc, videoSrc]);

  const handleDownload = () => {
    if (combinedData) {
      const blob = new Blob([combinedData], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
      <video ref={videoRef} src={videoSrc} controls></video>
      <audio ref={audioRef} src={audioSrc} controls></audio>
      <button onClick={handleDownload}>Download Combined Video</button>
    </>
  );
};

export default DashVideoDownloader;
