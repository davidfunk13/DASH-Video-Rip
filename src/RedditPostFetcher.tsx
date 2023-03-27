import React, { FC, useState } from "react";
import extractDashMediaObject from "./utils/extractDashMediaObject";
import extractDashStreamsFromMpd from "./utils/extractDashStreamsFromMpd";
import extractDashXMLFromPlaylist from "./utils/extractXMLFromDashPlaylist";
import StreamInfo from "./tyoes/StreamInfo";
import VideoPlayer from "./VideoPlayer";

interface Stream {
    bandwidth: number;
    url: string;
}

// function getHighestQualityStreams(streams: StreamInfo[]): { videoStream: Stream, audioStream: Stream } {
//     let highestVideoBandwidth = 0;
//     let highestVideoUrl = '';
//     let highestAudioBandwidth = 0;
//     let highestAudioUrl = '';

//     streams.forEach((stream) => {
//         if (stream.contentType === 'video' && stream.bandwidth > highestVideoBandwidth) {
//             highestVideoBandwidth = stream.bandwidth;
//             highestVideoUrl = stream.baseurl;
//         } else if (stream.contentType === 'audio' && stream.bandwidth > highestAudioBandwidth) {
//             highestAudioBandwidth = stream.bandwidth;
//             highestAudioUrl = stream.baseurl;
//         }
//     });

//     return {
//         videoStream: { bandwidth: highestVideoBandwidth, url: highestVideoUrl },
//         audioStream: { bandwidth: highestAudioBandwidth, url: highestAudioUrl },
//     };
// }
// //   v.redd.it

const RedditPostFetcher: FC<{}> = () => {
    const [postUrl, setPostUrl] = useState("");
    const [streams, setStreams] = useState<StreamInfo[]>([]);
    const [urlBase, setUrlBase] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        try {
            const response = await fetch(`${postUrl}.json`);
            const json = await response.json();
            const dashMedia = extractDashMediaObject(json);
            if (dashMedia?.dash_url) {
                const urlBase = dashMedia.dash_url.replace(/\/[^/]*$/, '/');
                setUrlBase(urlBase);
                const xml = await extractDashXMLFromPlaylist(dashMedia.dash_url);
                const parsed = await extractDashStreamsFromMpd(xml);
                console.log(parsed);
                setStreams(parsed);
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostUrl(event.target.value);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>
                    Paste a Reddit post URL:
                    <input type="text" value={postUrl} onChange={handleInputChange} />
                </label>
                <button type="submit">Fetch post</button>
            </form>
            <VideoPlayer urlBase={urlBase} streams={streams} />
        </>
    );
};

export default RedditPostFetcher;
