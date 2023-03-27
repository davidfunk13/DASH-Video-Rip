interface RedditChildrenData {
    media?: RedditChildrenDataMedia
}

interface RedditObject {
    data: {
        children: {
            kind: string,
            data: RedditChildrenData
        }[]
    }
}

interface DashMediaObject {
    bitrate_kbps: number
    fallback_url: string
    height: number
    width: number
    scrubber_media_url: string
    dash_url: string
    duration: number
    hls_url: string
    is_gif: boolean
    transcoding_status: string
}

interface RedditChildrenDataMedia {
    reddit_video?: DashMediaObject
}

function extractDashMediaObjectFromListingArray(objects: RedditObject[]): DashMediaObject | null {
    for (const obj of objects) {
        if (obj.data.children[0].kind === 't3' && obj.data.children[0].data.media?.reddit_video) {
            return obj.data.children[0].data.media.reddit_video
        }
    }
    return null;
}

export default extractDashMediaObjectFromListingArray;
