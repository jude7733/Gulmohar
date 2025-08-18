import React from 'react';
import { SafeAreaView, ScrollView, useWindowDimensions } from 'react-native';
import Pdf from 'react-native-pdf';

interface PDFViewerProps {
  uri: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ uri }) => {
  const { width, height } = useWindowDimensions();
  if (!uri) return null;

  return (
    <SafeAreaView
      style={{ flex: 1, width, height }}
    >
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
        style={{ flex: 1, width, height }}
      />
    </SafeAreaView>
  );
};

export default PDFViewer;
