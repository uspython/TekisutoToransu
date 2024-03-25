export interface OCRResponse {
  modelVersion: string;
  captionResult: {
    text: string;
    confidence: number;
  };
  metadata: {
    width: number;
    height: number;
  };
  readResult: {
    blocks: Block[];
  };
}

interface Block {
  lines: Line[];
}

interface Line {
  text: string;
  boundingPolygon: PolygonPoint[];
  words: Word[];
}

interface PolygonPoint {
  x: number;
  y: number;
}

interface Word {
  text: string;
  boundingPolygon: PolygonPoint[];
  confidence: number;
}
