import React from 'react';

// --- Web-specific PDF Viewer ---
// This component will be used for web builds because of the `.web.js` extension.
// It uses an iframe to embed and display the PDF, which is the standard web approach.

interface PDFViewerProps {
  uri: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  uri,
  className = '',
  width = '100%',
  height = '100%'
}) => {
  // If no URI is provided, we render nothing.
  if (!uri) {
    console.warn("PDFViewer: No URI provided.");
    return null;
  }

  // Define the style for the iframe container.
  // This makes the iframe responsive and fit within its parent container.
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  // Define the style for the iframe itself.
  // It takes the width and height props, defaulting to 100%.
  const iframeStyle: React.CSSProperties = {
    width: width,
    height: height,
    border: 'none', // Remove the default border from iframes
  };

  return (
    <div style={containerStyle} className={className}>
      <iframe
        src={uri}
        style={iframeStyle}
        title="PDF Viewer"
      />
    </div>
  );
};


export default PDFViewer;
