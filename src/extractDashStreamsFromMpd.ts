import { DOMParser } from 'xmldom';
import StreamInfo from './tyoes/StreamInfo';

async function parseMPD(mpdXML: string): Promise<StreamInfo[]> {
  const parser = new DOMParser();
  const mpd = parser.parseFromString(mpdXML, 'text/xml');
  const streamInfoList: StreamInfo[] = [];

  const adaptationSets = mpd.getElementsByTagName('AdaptationSet');
  for (let i = 0; i < adaptationSets.length; i++) {
    const adaptationSet = adaptationSets[i];
    const contentType = adaptationSet.getAttribute('contentType');
    const mimeType = adaptationSet.getAttribute('mimeType');
    const representations = adaptationSet.getElementsByTagName('Representation');
    for (let j = 0; j < representations.length; j++) {
      const representation = representations[j];
      const id = representation.getAttribute('id');
      const bandwidth = Number(representation.getAttribute('bandwidth'));
      const codecs = representation.getAttribute('codecs');

      let width = 0;
      let height = 0;
      if (contentType === 'video') {
        width = Number(representation.getAttribute('width'));
        height = Number(representation.getAttribute('height'));
      }

      let frameRate = 0;
      if (representation.getAttribute('frameRate')) {
        frameRate = Number(representation.getAttribute('frameRate'));
      }

      const file_name = representation.getElementsByTagName('BaseURL')[0].textContent;
      const initializationRange = representation.getElementsByTagName('Initialization')[0].getAttribute('range');
      const indexRange = representation.getElementsByTagName('SegmentBase')[0].getAttribute('indexRange');
      const uniqueId = file_name + '-' + bandwidth;

      const streamInfo: StreamInfo = {
        contentType,
        mimeType,
        bandwidth,
        codecs,
        width,
        height,
        frameRate,
        initializationRange,
        indexRange,
        file_name,
        uniqueId,
      };

      streamInfoList.push(streamInfo);
    }
  }

  return streamInfoList;
}

export default parseMPD;
