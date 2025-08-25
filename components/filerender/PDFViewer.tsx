import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import Pdf from 'react-native-pdf';

interface PDFViewerProps {
  uri: string;
  classname?: string;
  width?: number;
  height?: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ uri, classname, width, height }) => {
  const { width: deviceWidth, height: deviceHeight } = useWindowDimensions();

  // Use props if passed; subtract margins after fallback to device dimensions
  const pdfWidth: number = (width ?? deviceWidth);
  const pdfHeight: number = (height ?? deviceHeight) - 270;

  if (!uri) return null;

  return (
    <View style={{ flex: 1 }} className={classname}>
      <Pdf
        source={{ uri: uri, cache: true }}
        trustAllCerts={false}
        page={1}
        horizontal
        maxScale={6.0}
        style={{ flex: 1, width: pdfWidth, height: pdfHeight }}
      />
    </View>
  );
};

export default PDFViewer;
