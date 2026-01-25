import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchBlogTopic, BlogTopic } from "../api";
import Header from "./Header";
import Footer from "./Footer";

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
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-200">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-8 py-16 w-full">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-[0.3em]">
                Loading Entry...
              </span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-200">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-8 py-16 w-full">
          <div className="bg-black border border-red-500/30 rounded-lg p-12 text-center terminal-glow">
            <span className="material-symbols-outlined text-red-400 text-4xl mb-4">
              error
            </span>
            <p className="text-red-400 font-mono">
              {error || "Entry not found"}
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 mt-6 text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>
              Return to Journal
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-200">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-8 py-16 w-full">
        {/* Back Navigation */}
        <div className="mb-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Journal
          </Link>
        </div>

        <article>
          {/* Article Header */}
          <header className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                Journal Entry
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-8">
              {topic.title}
            </h1>
            <div className="flex items-center gap-6 text-[10px] font-mono text-slate-600 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  article
                </span>
                {topic.paragraphs?.length || 0} Sections
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
                Status: Published
              </div>
            </div>
          </header>

          {/* Article Content */}
          {!topic.paragraphs || topic.paragraphs.length === 0 ? (
            <div className="bg-black border border-white/10 rounded-lg p-12 text-center terminal-glow">
              <span className="material-symbols-outlined text-slate-600 text-4xl mb-4">
                draft
              </span>
              <p className="text-slate-500 font-mono text-sm">
                No content found in this entry.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {topic.paragraphs.map((paragraph, index) => (
                <section
                  key={paragraph.id}
                  className="bg-black border border-white/10 rounded-lg overflow-hidden terminal-glow"
                >
                  {/* Section Header */}
                  <div className="bg-slate-900/50 border-b border-white/5 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 tracking-wider">
                        SECTION_{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-white/20 text-sm">
                      terminal
                    </span>
                  </div>

                  {/* Section Content */}
                  <div className="p-8">
                    <h2 className="text-xl font-bold mb-6 text-primary flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg">
                        chevron_right
                      </span>
                      {paragraph.heading}
                    </h2>
                    <div className="text-slate-400 leading-relaxed whitespace-pre-wrap pl-8">
                      {paragraph.content}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-white/5">
            <div className="flex items-center justify-between">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">
                  arrow_back
                </span>
                All Entries
              </Link>
              <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                End of Entry
              </div>
            </div>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;
