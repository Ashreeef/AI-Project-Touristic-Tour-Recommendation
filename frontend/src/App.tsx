
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { DestinationsPage } from './pages/DestinationsPage';
import { HotelsPage } from './pages/HotelsPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ItineraryResultsPage } from './pages/ItineraryResultsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <div className="smooth-scroll">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/results" element={<ItineraryResultsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
