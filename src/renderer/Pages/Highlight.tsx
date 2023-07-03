import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import QuotesList from 'renderer/Components/QuotesList/QuotesList';

const Highlight = observer(() => {
  const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);
  const [inputValue, setInputValue] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [windowSize]);

  const handleSearch = () => {
    let url = inputValue;
    if (inputValue.substring(0, 4) !== 'http') {
      url = `https://${url}`;
    }
    setInputUrl(url);
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
          className="content-window"
          style={{
            height: windowSize[1] - 70,
          }}
        >
          <webview
            src={inputUrl}
            className="browser-window"
            // eslint-disable-next-line react/no-unknown-property
            useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.2 Mobile/15E148 Safari/604.1"
          />
        </div>
      </div>
    </div>
  );
});

export default Highlight;
