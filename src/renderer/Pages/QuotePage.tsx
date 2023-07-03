import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import QuotesStore from 'renderer/Store/QuotesStore';

const QuotePage = observer(() => {
  const { id } = useParams();
  const quote = QuotesStore.getQuote(id!);
  return (
    quote && (
      <div
        style={{
          backgroundColor: 'white',
        }}
      >
        <div>{quote?.text}</div>
        <div>{quote?.link}</div>
        <div>
          {new Date(quote?.createdAt).toLocaleDateString()} :{' '}
          {new Date(quote?.createdAt).toLocaleTimeString()}
        </div>
      </div>
    )
  );
});

export default QuotePage;
