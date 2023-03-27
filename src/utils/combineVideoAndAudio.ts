import StreamInfo from "../tyoes/StreamInfo";

function combineVideoAndAudio(videoStream: StreamInfo, audioStream: StreamInfo, urlBase: string): MediaSource | null {
    const mediaSource = new MediaSource();

    let videoSourceBuffer: SourceBuffer, audioSourceBuffer: SourceBuffer;

    const appendVideo = (segment) => {
        if (mediaSource.readyState !== "open") return;
        videoSourceBuffer.appendBuffer(segment);
    };

    const appendAudio = (segment) => {
        if (mediaSource.readyState !== "open") return;
        audioSourceBuffer.appendBuffer(segment);
    };

    const onSourceOpen = () => {
        console.log(videoStream, audioStream)
        videoSourceBuffer = mediaSource.addSourceBuffer(`${videoStream.mimeType}; codecs="${videoStream.codecs}"`);
        audioSourceBuffer = mediaSource.addSourceBuffer(`${audioStream.mimeType}; codecs="${audioStream.codecs}"`);

        const videoUrl = urlBase + videoStream.file_name;
        const audioUrl = urlBase + audioStream.file_name;

        fetch(videoUrl)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                appendVideo(buffer);
                return fetch(audioUrl);
            })
            .then((response) => response.arrayBuffer())
            .then((buffer) => appendAudio(buffer))
            .catch((error) => console.error(error));
    };

    mediaSource.addEventListener("sourceopen", onSourceOpen);

    const videoElement = document.getElementById("video-player") as HTMLVideoElement;

    if (!videoElement) {
        return null;
    }

    videoElement.src = URL.createObjectURL(mediaSource);
    videoElement.controls = true;

    return mediaSource;
}

export default combineVideoAndAudio;