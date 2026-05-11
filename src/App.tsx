import { Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./contexts/ThemeContext";
import { VisitorTracker } from "./components/VisitorTracker";
import { Dashboard, Filters, FreeLanding, LandingPage, Links, MediaKit, Services } from "./pages";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable={false}>
        <VisitorTracker />
        <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/filters" element={<Filters />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/mediakit" element={<MediaKit />} />
          <Route path="/links" element={<Links />} />
          <Route path="/free" element={<FreeLanding />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
