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
}) => {
  if (!uri) {
    console.warn("PDFViewer: No URI provided.");
    return null;
  }

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  // It takes the width and height props, defaulting to 100%.
  const iframeStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    border: 'none',
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
