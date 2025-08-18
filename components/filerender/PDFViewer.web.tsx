import React from 'react';

interface PDFViewerProps {
  uri: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ uri }) => {
  if (!uri) return null;

  return (
    <div style={{ width: '100%', height: '100vh', background: '#fff', border: 'none' }}>
      <iframe
        src={uri}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          background: '#fff',
        }}
        title="PDF document"
      />
    </div>
  );
};

export default PDFViewer;
