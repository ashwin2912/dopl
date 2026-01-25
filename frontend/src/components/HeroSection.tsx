import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchBlogTopics, BlogTopic } from "../api";

interface HeroSectionProps {
  bio: string;
  loading: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ bio, loading }) => {
  const [blogTopics, setBlogTopics] = useState<BlogTopic[]>([]);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const topics = await fetchBlogTopics();
        setBlogTopics(topics.slice(0, 3)); // Show only first 3
      } catch (error) {
        console.error("Failed to load blog topics:", error);
      }
    };
    loadTopics();
  }, []);

  return (
    <section className="flex flex-col lg:flex-row gap-12 mb-24">
      {/* Left: Portrait Image */}
      <div className="lg:w-[15%] flex-shrink-0">
        {/* Portrait Image - Add your image to frontend/public/portrait.jpg */}
        <div
          className="w-20 h-20 rounded-full grayscale hover:grayscale-0 transition-all duration-500 bg-cover bg-center border border-white/10"
          style={{
            backgroundImage: "url('/potrait.jpeg')",
            backgroundColor: "#333",
          }}
        ></div>
      </div>

      {/* Middle: Main Heading and Bio */}
      <div className="lg:w-[55%] flex flex-col gap-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl lg:text-5xl font-bold tracking-tight mb-8 leading-[1.1]">
            {loading ? (
              "Loading..."
            ) : (
              <>
                Building systems to expand{" "}
                <span className="text-primary italic">human capability</span>
              </>
            )}
          </h1>
          <p className="text-lg leading-relaxed font-light text-slate-500 dark:text-slate-400">
            {loading
              ? "Loading bio..."
              : bio ||
                "Full-stack engineer specializing in the intersection of generative AI and intuitive interface design."}
          </p>
        </div>
      </div>

      {/* Right: Journal Sidebar */}
      <div className="lg:w-[30%] flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Journal
          </span>
          <span className="material-symbols-outlined text-sm opacity-50">
            more_vert
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {blogTopics.map((topic) => (
            <Link
              key={topic.id}
              className="group block"
              to={`/blog/${topic.docId}`}
            >
              <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-card-dark/50 border border-slate-100 dark:border-white/5 hover:border-primary/30 transition-all">
                <h3 className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
                  {topic.title}
                </h3>
              </div>
            </Link>
          ))}
          {blogTopics.length === 0 && !loading && (
            <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-card-dark/50 border border-slate-100 dark:border-white/5">
              <span className="text-sm text-slate-500">
                No journal entries yet
              </span>
            </div>
          )}
        </div>
        <Link
          className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2 mt-2"
          to="/blog"
        >
          All Entries
          <span className="material-symbols-outlined text-xs">
            arrow_right_alt
          </span>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
