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
  const pdfWidth: number = (width ?? deviceWidth) - 32;
  const pdfHeight: number = (height ?? deviceHeight) - 250;

  if (!uri) return null;

  return (
    <View style={{ flex: 1 }} className={classname}>
      <Pdf
        source={{ uri }}
        trustAllCerts={false}
        page={1}
        horizontal
        maxScale={6.0}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={{ flex: 1, width: pdfWidth, height: pdfHeight }}
      />
    </View>
  );
};

export default PDFViewer;
