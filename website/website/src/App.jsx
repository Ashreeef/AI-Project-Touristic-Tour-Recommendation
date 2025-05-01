import { BrowserRouter, Routes, Route } from "react-router-dom";
import ItineraryPage from "./pages/Home"; 
import Result from "./pages/Result"; // Your target page component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ItineraryPage />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

