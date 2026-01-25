import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import ChatInterface from "./components/ChatInterface";
import BlogTopics from "./components/BlogTopics";
import BlogDetail from "./components/BlogDetail";
import { fetchBio } from "./api";

function HomePage() {
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBio = async () => {
      try {
        const data = await fetchBio();
        setBio(data.bio);
      } catch (error) {
        console.error("Failed to load bio:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBio();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <main className="flex-1 max-w-7xl mx-auto px-8 py-16 w-full">
        <HeroSection bio={bio} loading={loading} />
        <ChatInterface />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) {
    console.error(
      "VITE_RECAPTCHA_SITE_KEY is not set in environment variables",
    );
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey || ""}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogTopics />} />
          <Route path="/blog/:docId" element={<BlogDetail />} />
        </Routes>
      </Router>
    </GoogleReCaptchaProvider>
  );
}

export default App;
