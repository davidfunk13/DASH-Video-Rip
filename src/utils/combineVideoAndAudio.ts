import StreamInfo from "../tyoes/StreamInfo";

function combineVideoAndAudio(videoStream: StreamInfo, audioStream: StreamInfo, baseUrl: string) {
    const video = document.createElement('video');
    video.src = baseUrl + videoStream.file_name;
    video.setAttribute('crossorigin', 'anonymous');

    const audio = document.createElement('audio');
    audio.src = baseUrl + audioStream.file_name;
    audio.setAttribute('crossorigin', 'anonymous');
    const mediaSource = new MediaSource();
    const videoMime = `${videoStream.mimeType}; codecs="${videoStream.codecs}"`;
    const audioMime = `${audioStream.mimeType}; codecs="${audioStream.codecs}"`;
    const videoSourceBuffer = mediaSource.addSourceBuffer(videoMime);
    const audioSourceBuffer = mediaSource.addSourceBuffer(audioMime);

    video.addEventListener('loadedmetadata', () => {
        videoSourceBuffer.addEventListener('updateend', () => {
            if (!audio.paused && !video.paused && mediaSource.readyState === 'open') {
                const start = Math.max(videoSourceBuffer.buffered.start(0), audioSourceBuffer.buffered.start(0));
                const end = Math.min(videoSourceBuffer.buffered.end(0), audioSourceBuffer.buffered.end(0));
                if (start < end) {
                    const bufferedVideo = videoSourceBuffer.buffered;
                    const bufferedAudio = audioSourceBuffer.buffered;
                    // videoSourceBuffer.appendBuffer(bufferedVideo.slice(start, end));
                    // audioSourceBuffer.appendBuffer(bufferedAudio.slice(start, end));
                }
            }
        });

        videoSourceBuffer.addEventListener('error', () => {
            console.error('Error occurred while appending video buffer.');
        });
    });

    audio.addEventListener('loadedmetadata', () => {

        audioSourceBuffer.addEventListener('updateend', () => {
            if (!audio.paused && !video.paused && mediaSource.readyState === 'open') {
                const start = Math.max(videoSourceBuffer.buffered.start(0), audioSourceBuffer.buffered.start(0));
                const end = Math.min(videoSourceBuffer.buffered.end(0), audioSourceBuffer.buffered.end(0));
                if (start < end) {
                    const bufferedVideo = videoSourceBuffer.buffered;
                    const bufferedAudio = audioSourceBuffer.buffered;
                    // videoSourceBuffer.appendBuffer(bufferedVideo.slice(start, end));
                    // audioSourceBuffer.appendBuffer(bufferedAudio.slice(start, end));
                }
            }
        });

        audioSourceBuffer.addEventListener('error', () => {
            console.error('Error occurred while appending audio buffer.');
        });
    });

    // mediaSource.addEventListener('sourceopen', () => {
    //   const mime = `video/mp4; codecs="${video?.codec}"`;
    //   const videoSourceBuffer = mediaSource.addSourceBuffer(mime);

    //   const mime2 = `audio/mp4; codecs="${audio?.codec}"`;
    //   const audioSourceBuffer = mediaSource.addSourceBuffer(mime2);

    //   document.body.appendChild(video);
    //   document.body.appendChild(audio);
    //   video.play();
    //   audio.play();
    // });

    // video.addEventListener('ended', () => {
    //   video.pause();
    //   audio.pause();
    // });

    // video.addEventListener('error', () => {
    //   console.error('Error occurred while loading video.');
    // });

    // audio.addEventListener('error', () => {
    //   console.error('Error occurred while loading audio.');
    // });

    // document.body.appendChild(mediaSource);
}

export default combineVideoAndAudio;
