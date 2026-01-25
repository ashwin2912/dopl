import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchBlogTopics, BlogTopic } from "../api";
import Header from "./Header";
import Footer from "./Footer";

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
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-200">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-8 py-16 w-full">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-[0.3em]">
                Loading Journal Entries...
              </span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-200">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-8 py-16 w-full">
          <div className="bg-card-dark border border-red-500/30 rounded-lg p-8 text-center">
            <span className="material-symbols-outlined text-red-400 text-3xl mb-4">
              error
            </span>
            <p className="text-red-400">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-200">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-8 py-16 w-full">
        {/* Back Navigation */}
        <div className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
              Knowledge Base
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Journal <span className="text-primary italic">Archive</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Thoughts, insights, and technical deep-dives on software
            engineering, AI systems, and the future of technology.
          </p>
        </div>

        {/* Topics Grid */}
        {topics.length === 0 ? (
          <div className="bg-black border border-white/10 rounded-lg p-12 text-center terminal-glow">
            <span className="material-symbols-outlined text-slate-600 text-4xl mb-4">
              article
            </span>
            <p className="text-slate-500 font-mono text-sm">
              No journal entries found.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, index) => (
              <Link
                key={topic.id}
                to={`/blog/${topic.docId}`}
                className="group block"
              >
                <article className="h-full flex flex-col bg-black border border-white/10 rounded-lg p-6 hover:border-primary/50 transition-all duration-300 terminal-glow">
                  {/* Entry Number */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] text-primary font-mono font-bold uppercase tracking-wider">
                      Entry_{String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="material-symbols-outlined text-white/20 text-sm group-hover:text-primary transition-colors">
                      arrow_outward
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-semibold leading-tight mb-4 group-hover:text-primary transition-colors flex-1">
                    {topic.title}
                  </h2>

                  {/* Footer */}
                  <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-600 text-sm">
                      description
                    </span>
                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                      Read Entry
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Stats */}
        {topics.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
              Total Entries: {topics.length}
            </div>
            <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
              Archive Status: Active
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogTopics;
