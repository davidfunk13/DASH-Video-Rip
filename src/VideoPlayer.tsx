import React, { useRef, useEffect } from 'react';
import combineVideoAndAudio from './combineVideoAndAudio';
import StreamInfo from './tyoes/StreamInfo';


interface VideoPlayerProps {
  streams: StreamInfo[];
  urlBase: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ streams, urlBase }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    // Filter out any video or audio streams without a bandwidth specified
    const filteredStreams = streams.filter((stream) => stream.bandwidth);

    // Filter out any video streams without a width or height specified
    const filteredVideoStreams = filteredStreams.filter((stream) => stream.contentType === 'video' && stream.width && stream.height);

    // Sort video streams in descending order of quality
    filteredVideoStreams.sort((a, b) => b.bandwidth - a.bandwidth);

    // Pick the highest quality video stream
    const highestQualityVideo = filteredVideoStreams[0];

    // Filter out any audio streams
    const filteredAudioStreams = filteredStreams.filter((stream) => stream.contentType === 'audio');

    // Sort audio streams in descending order of quality
    filteredAudioStreams.sort((a, b) => b.bandwidth - a.bandwidth);

    // Pick the highest quality audio stream
    const highestQualityAudio = filteredAudioStreams[0];

    // Create the video source
    if (!highestQualityVideo || !highestQualityAudio) return;
console.log({ highestQualityVideo, highestQualityAudio})
    const output = combineVideoAndAudio(highestQualityVideo, highestQualityAudio, urlBase);
    // console.log({ output });
    // const videoSource = document.createElement('source');
    // videoSource.src = urlBase + `${highestQualityVideo.file_name}`;
    // videoSource.type = highestQualityVideo.mimeType;

    // // Create the audio source
    // const audioSource = document.createElement('source');
    // audioSource.src = urlBase + `${highestQualityAudio.file_name}`;
    // audioSource.type = highestQualityAudio.mimeType;
    // console.log(audioSource)
    // // Add the sources to the video element
    // videoEl.appendChild(videoSource);
    // videoEl.appendChild(audioSource);

    // // Play the video
    // videoEl.play();
  }, [streams]);

  return (
    <div>
      <video width={"100%"}
        height={"100%"}
        ref={videoRef}
        controls
      />
    </div>
  );
};

export default VideoPlayer;
