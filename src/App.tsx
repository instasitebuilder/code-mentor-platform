import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Topics from "./pages/Topics";
import Together from "./pages/Together";
import TechnicalInterview from "./pages/TechnicalInterview";
import TopicDetail from "./pages/TopicDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/together/:sessionCode" element={<Together />} />
        <Route path="/technical" element={<TechnicalInterview />} />
        <Route path="/technical/:topicId" element={<TopicDetail />} />
      </Routes>
    </Router>
  );
}
