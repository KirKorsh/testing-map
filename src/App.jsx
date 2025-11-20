import React, { memo } from 'react';
import MapComponent from './components/Map/MapComponent';
import './App.css';

const App = memo(() => {
  return (
    <div className="app">
      <MapComponent />
    </div>
  );
});

App.displayName = 'App';
export default App;