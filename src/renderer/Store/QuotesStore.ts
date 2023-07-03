import { makeAutoObservable } from 'mobx';

export interface Quote {
  id: string;
  link: string;
  text: string;
  createdAt: Date;
}

class QuotesStore {
  private quotes: Quote[] = [];

  constructor() {
    makeAutoObservable(this);
    if (localStorage.getItem('quotes')) {
      this.loadQuotes();
    }
  }

  public addQuote(quote: Quote) {
    this.quotes.push(quote);
    this.saveQuotes();
    window.showNotification('Quote added', quote.text);
  }

  public getQuotes() {
    return this.quotes;
  }

  public getQuote(id: string): Quote | undefined {
    const returnValue = this.quotes.find((quote) => quote.id === id);
    return returnValue;
  }

  public deleteQuote(id: string) {
    const deleted = this.quotes.find((quote) => quote.id === id);
    this.quotes = this.quotes.filter((quote) => quote.id !== id);
    this.saveQuotes();
    window.showNotification('Quote deleted', deleted?.text!);
  }

  public updateQuote(quote: Quote) {
    this.quotes = this.quotes.map((q) => {
      if (q.id === quote.id) {
        return quote;
      }
      return q;
    });
  }

  public loadQuotes() {
    if (localStorage.getItem('quotes')) {
      this.quotes = JSON.parse(localStorage.getItem('quotes') || '');
    } else {
      this.quotes = [];
    }
  }

  public saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(this.quotes));
  }
}

export default new QuotesStore();
