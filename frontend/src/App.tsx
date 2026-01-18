import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Header from "./components/Header";
import ChatInterface from "./components/ChatInterface";
import BlogTopics from "./components/BlogTopics";
import BlogDetail from "./components/BlogDetail";
import { fetchBio } from "./api";
import "./styles/retro.css";

function HomePage() {
  const [name, setName] = useState("ASHWIN'S DIGITAL TWIN");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBio = async () => {
      try {
        const data = await fetchBio();
        if (data.name) {
          setName(data.name);
        }
        setBio(data.bio);
      } catch (error) {
        console.error("Failed to load bio:", error);
        // Use defaults if bio fetch fails
      } finally {
        setLoading(false);
      }
    };

    loadBio();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-retro-bg">
      <Header name={name} bio={bio} loading={loading} />
      <div className="p-4 bg-retro-dark border-b-2 border-black">
        <Link
          to="/blog"
          className="inline-block bg-retro-blue text-retro-light px-6 py-3 border-2 border-black font-mono hover:bg-retro-light hover:text-retro-dark transition-colors"
        >
          READ MY BLOG →
        </Link>
      </div>
      <ChatInterface />
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
