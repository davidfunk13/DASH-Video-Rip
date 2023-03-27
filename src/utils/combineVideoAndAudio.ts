function combineVideoAndAudio(videoUrl: RequestInfo | URL, audioUrl: RequestInfo | URL, urlBase: string): MediaSource | null {
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
        videoSourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.64001f"');
        audioSourceBuffer = mediaSource.addSourceBuffer('audio/mp4; codecs="mp4a.40.2"');

        fetch(urlBase + videoUrl)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                appendVideo(buffer);
                return fetch(urlBase + audioUrl);
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