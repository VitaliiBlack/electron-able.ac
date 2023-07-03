import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import QuotesStore from 'renderer/Store/QuotesStore';

const QuotePage = observer(() => {
  const { id } = useParams();
  const quote = QuotesStore.getQuote(id!);
  return (
    quote && (
      <div className="quote-page">
        <div className="quote-page-content">{quote?.text}</div>
        <div className="quote-page-link">{quote?.link}</div>
        <div className="quote-page-data">
          {new Date(quote?.createdAt).toLocaleDateString()} :{' '}
          {new Date(quote?.createdAt).toLocaleTimeString()}
        </div>
      </div>
    )
  );
});

export default QuotePage;
