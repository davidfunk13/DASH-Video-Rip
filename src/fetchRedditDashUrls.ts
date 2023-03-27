interface DashUrls {
    video: string;
    audio: string;
  }
  
  async function fetchRedditDashUrls(postUrl: string): Promise<DashUrls> {
    const apiUrl = `https://www.reddit.com/api/info.json?url=${postUrl}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const post = data.data.children[0].data;
    const media = post.media?.reddit_video;
    if (!media) {
      throw new Error('No DASH video found in post');
    }
    const videoUrl = `${media.dash_url}?${media.dash_manifest}`;
    const audioUrl = `${media.audio_url}?${media.dash_manifest}`;
    return { video: videoUrl, audio: audioUrl };
  }
  
  export default fetchRedditDashUrls;