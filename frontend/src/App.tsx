import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ChatInterface from "./components/ChatInterface";
import { fetchBio } from "./api";
import "./styles/retro.css";

function App() {
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
      <ChatInterface />
    </div>
  );
}

export default App;
