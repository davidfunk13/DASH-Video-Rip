import React, { FC, useState } from "react";
import extractDashStreamsFromMpd from "./utils/extractDashStreamsFromMpd";
import extractDashXMLFromPlaylist from "./utils/extractXMLFromDashPlaylist";
import StreamInfo from "./tyoes/StreamInfo";
import VideoPlayer from "./VideoPlayer";
import extractDashMediaObjectFromListingArray from "./utils/extractDashMediaObjectFromListingArray";

const RedditPostFetcher: FC<{}> = () => {
    const [postUrl, setPostUrl] = useState("");
    const [streams, setStreams] = useState<StreamInfo[]>([]);
    const [urlBase, setUrlBase] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        //we need a function to determine and support different url types and responses. 

        // if the url is shortened, like this https://v.redd.it/o3c3s5fhj5qa1,
        // use this kind of format to fetch. https://www.reddit.com/api/info.json?url=https://v.redd.it/o3c3s5fhj5qa1
        // this returns the post "T3" itself! not the array of listings.
        
        // if url is longform like this https://www.reddit.com/r/Catloaf/comments/122yq48/im_not_sure_if_this_is_allowed_on_this_sub_but
        // slap a .json on the end (how the app is now, default.) 
        // this returns an array of listings [{kind:"Listing", data: {kind: "t1,"t3".....}}].
        // needs to be filtered.

        // if the url is like this it ALSO RETURNS A LISTING ARRAY AND NEEDS TO BE FILTERED.
        // https://www.reddit.com/video/o3c3s5fhj5qa1

        try {
            //this is how we'll do a default post type that returns a listing array.
            const response = await fetch(`${postUrl}.json`);
        
            const json = await response.json();

            //response will be different based on url, so we'll need to decide how to handle that!
            const dashMedia = extractDashMediaObjectFromListingArray(json);
            
            if (dashMedia?.dash_url) {
                const urlBase = dashMedia.dash_url.replace(/\/[^/]*$/, '/');
                const xml = await extractDashXMLFromPlaylist(dashMedia.dash_url);
                const parsed = await extractDashStreamsFromMpd(xml);
                setUrlBase(urlBase);
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
