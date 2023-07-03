import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import QuotesStore from 'renderer/Store/QuotesStore';

export interface QuotesListProps {
  isFullscreen?: boolean;
  windowSize?: number[];
}

const QuotesList = observer((props: QuotesListProps) => {
  const { isFullscreen, windowSize } = props;
  const quotes = QuotesStore.getQuotes();
  return (
    <div
      className="highlighted-list"
      style={{
        height: !isFullscreen ? windowSize![1] - 170 : windowSize![1] - 70,
        width: isFullscreen ? windowSize![0] : '',
      }}
    >
      {quotes && quotes.length > 0 ? (
        quotes.map((quote) => (
          <div className="highlight-item" key={quote.id}>
            <div className="highlight-item-text">
              <div className="highlight-item-text-title-wrapper">
                <div className="highlight-item-text-title">
                  {quote.text.length > 10 ? `${quote.text.substring(0, 15)}...` : quote.text}
                </div>
                <a className="highlight-item-text-url" href={quote.link}>
                  {quote.link}
                </a>
              </div>
              <div className="highlight-item-text-content">
                {quote.text.length > 100 && !isFullscreen!
                  ? `${quote.text.substring(0, 120)}...`
                  : quote.text}
              </div>
            </div>
            <div className="highlight-item-buttons">
              <button
                type="button"
                className="highlight-item-button"
                onClick={() => {
                  QuotesStore.deleteQuote(quote.id);
                }}
              >
                Delete
              </button>
              <Link type="button" className="highlight-item-button" to={`/Highlighted/${quote.id}`}>
                Open
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="highlighted-list-empty">No highlighted quotes</div>
      )}
    </div>
  );
});

export default QuotesList;
