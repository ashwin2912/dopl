import React from "react";

interface HeaderProps {
  name?: string;
  bio?: string;
  loading?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  name = "DIGITAL TWIN",
  bio = "",
  loading = false,
}) => {
  return (
    <header className="bg-retro-blue text-retro-light p-8 border-b-4 border-black">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-mono font-bold tracking-wider mb-6 text-white">
          {loading ? "LOADING..." : name}
        </h1>
        {bio && !loading && (
          <div className="bg-retro-light text-retro-dark p-6 border-2 border-black shadow-md">
            <p className="text-sm font-mono whitespace-pre-wrap text-left">
              {bio}
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
