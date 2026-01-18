import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchBlogTopics, BlogTopic } from "../api";

const BlogTopics: React.FC = () => {
  const [topics, setTopics] = useState<BlogTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const data = await fetchBlogTopics();
        setTopics(data);
      } catch (err) {
        setError("Failed to load blog topics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-retro-bg p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center text-retro-dark font-mono text-xl">
            LOADING BLOG TOPICS...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-retro-bg p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-red-100 border-2 border-black p-6 text-center">
            <p className="text-retro-dark font-mono">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-retro-bg p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-block bg-retro-blue text-retro-light px-6 py-3 border-2 border-black font-mono hover:bg-retro-dark transition-colors"
          >
            ← BACK TO HOME
          </Link>
        </div>

        <h1 className="text-4xl font-mono font-bold text-retro-dark mb-8 text-center border-b-4 border-black pb-4">
          BLOG TOPICS
        </h1>

        {topics.length === 0 ? (
          <div className="bg-retro-light border-2 border-black p-8 text-center">
            <p className="font-mono text-retro-dark">No blog topics found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                to={`/blog/${topic.docId}`}
                className="block bg-retro-light border-2 border-black p-6 hover:bg-retro-blue hover:text-retro-light transition-colors"
              >
                <h2 className="text-2xl font-mono font-bold">{topic.title}</h2>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTopics;
