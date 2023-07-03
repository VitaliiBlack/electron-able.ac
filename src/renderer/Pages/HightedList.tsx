import { useEffect, useState } from 'react';
import QuotesList from 'renderer/Components/QuotesList/QuotesList';

function HightedList() {
  const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [windowSize]);

  return <QuotesList isFullscreen windowSize={windowSize} />;
}

export default HightedList;
