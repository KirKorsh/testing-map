import React from 'react';

const DataDebugger = ({ lineData, roadCrosData, semaphoresData }) => {
  const analyzeData = (data, name) => {
    if (!data) return `No ${name} data`;
    
    return {
      type: data.type,
      featureCount: data.features?.length || 0,
      firstFeature: data.features?.[0] || 'No features',
      geometryType: data.features?.[0]?.geometry?.type,
      coordinates: data.features?.[0]?.geometry?.coordinates
    };
  };

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      left: 10,
      background: 'white',
      padding: 10,
      zIndex: 1000,
      fontSize: '12px'
    }}>
      <h4>Data Debug Info:</h4>
      <pre>Line Data: {JSON.stringify(analyzeData(lineData, 'line'), null, 2)}</pre>
      <pre>Road Cross Data: {JSON.stringify(analyzeData(roadCrosData, 'roadCross'), null, 2)}</pre>
      <pre>Semaphores Data: {JSON.stringify(analyzeData(semaphoresData, 'semaphores'), null, 2)}</pre>
    </div>
  );
};

export default DataDebugger;