import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import QuotesList from 'renderer/Components/QuotesList/QuotesList';
import useResize from 'renderer/Hooks/useResize';

const BrowserViewHighlight = observer(() => {
  const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);
  const [inputValue, setInputValue] = useState('');

  const resize = useResize();

  useEffect(() => {
    const elementCoordinates = document.getElementById('content-window')?.getBoundingClientRect();
    setWindowSize([window.innerWidth, window.innerHeight]);
    const coordinates = {
      x: elementCoordinates?.x!,
      y: elementCoordinates?.y!,
      width: elementCoordinates?.width!,
      height: elementCoordinates?.height!,
    };

    window.electronHandler.ipcRenderer.sendOpen('browserViewOpen', coordinates);

    return () => {
      window.electronHandler.ipcRenderer.sendHide('browserViewHide', coordinates);
    };
  }, [resize]);

  const handleSearch = () => {
    let url = inputValue;
    if (inputValue.substring(0, 4) !== 'http') {
      url = `https://${url}`;
    }
    window.electronHandler.ipcRenderer.sendUrl('browserViewUrl', url);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="highlight-page">
      <div className="highlight-page-header">
        <div className="highlighted-list-title">Highlighted list</div>
        <div className="search-bar">
          <input type="text" className="search-bar-input" onInput={handleSearchInput} />
          <button type="button" className="search-bar-button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
      <div className="highlight-page-content">
        <QuotesList windowSize={windowSize} />
        <div
          id="content-window"
          className="content-window"
          style={{
            height: windowSize[1] - 70,
          }}
        />
      </div>
    </div>
  );
});

export default BrowserViewHighlight;
