import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchBlogTopic, BlogTopic } from "../api";

const BlogDetail: React.FC = () => {
  const { docId } = useParams<{ docId: string }>();
  const [topic, setTopic] = useState<BlogTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTopic = async () => {
      if (!docId) return;

      try {
        const data = await fetchBlogTopic(docId);
        setTopic(data);
      } catch (err) {
        setError("Failed to load blog topic");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTopic();
  }, [docId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-retro-bg p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center text-retro-dark font-mono text-xl">
            LOADING...
          </div>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-retro-bg p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-red-100 border-2 border-black p-6 text-center">
            <p className="text-retro-dark font-mono">
              {error || "Topic not found"}
            </p>
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
            to="/blog"
            className="inline-block bg-retro-blue text-retro-light px-6 py-3 border-2 border-black font-mono hover:bg-retro-dark transition-colors"
          >
            ← BACK TO TOPICS
          </Link>
        </div>

        <h1 className="text-4xl font-mono font-bold text-retro-dark mb-8 text-center border-b-4 border-black pb-4">
          {topic.title}
        </h1>

        {!topic.paragraphs || topic.paragraphs.length === 0 ? (
          <div className="bg-retro-light border-2 border-black p-8 text-center">
            <p className="font-mono text-retro-dark">
              No content found in this topic.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {topic.paragraphs.map((paragraph) => (
              <div
                key={paragraph.id}
                className="bg-retro-light border-2 border-black p-8"
              >
                <h2 className="text-2xl font-mono font-bold text-retro-dark mb-4 border-b-2 border-black pb-2">
                  {paragraph.heading}
                </h2>
                <div className="font-mono text-retro-dark whitespace-pre-wrap">
                  {paragraph.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
