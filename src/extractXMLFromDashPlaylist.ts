async function extractXMLFromDashPlaylist(url: string) {
  // Fetch the dash playlist data
  const response = await fetch(url);
  const dashData = await response.text();

  return dashData;
}

export default extractXMLFromDashPlaylist;