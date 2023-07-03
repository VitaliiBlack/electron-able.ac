import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Layout from './Components/Layout/Layout';
import BrowserViewHighlight from './Pages/BrowserViewHighlight';
import Highlight from './Pages/Highlight';
import HightedList from './Pages/HightedList';
import QuotePage from './Pages/QuotePage';
import './Styles/index.scss';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Highlight />} />
          <Route path="/BrowserView" element={<BrowserViewHighlight />} />
          <Route path="/Highlighted" element={<HightedList />} />
          <Route path="/Highlighted/:id" element={<QuotePage />} />
        </Route>
      </Routes>
    </Router>
  );
}
