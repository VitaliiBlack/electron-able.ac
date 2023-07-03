import { createRoot } from 'react-dom/client';
import { v4 as uuidv4 } from 'uuid';
import App from './App';
import QuotesStore from './Store/QuotesStore';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

window.electronHandler.ipcRenderer.on('save-selected', (e) => {
  if (e) {
    QuotesStore.addQuote({
      id: uuidv4(),
      text: e.content.selectionText,
      link: e.content.pageURL,
      createdAt: new Date(),
    });
  }
});
