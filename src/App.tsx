import { Routes, Route } from 'react-router-dom';
import InputPage from './pages/InputPage';
import ReviewPage from './pages/ReviewPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Navbar />
      <main className="container mx-auto py-6">
        <Routes>
          <Route path="/" element={<InputPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
      <footer className="border-t py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by ABC Team. &copy; 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
