import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import HRInterview from './pages/HRInterview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/hr-interview" element={<HRInterview />} />
      </Routes>
    </Router>
  );
}

export default App;
