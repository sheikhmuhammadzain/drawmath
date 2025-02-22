import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './LandingPage';
import EquationSolver from './components/EquationSolver';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/solve" element={<EquationSolver />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;