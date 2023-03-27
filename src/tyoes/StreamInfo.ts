interface StreamInfo {
    contentType: string;
    mimeType: string;
    bandwidth: number;
    codecs: string;
    width: number;
    height: number;
    frameRate: number;
    initializationRange: string;
    indexRange: string;
    file_name: string;
    urlBase?: string;
    uniqueId: string;
  }

export default StreamInfo;