import { useState } from "react";
import "./index.css"; // use index.css for all styles

export default function App() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔎 Search Wikipedia
  const searchWikipedia = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        query
      )}&format=json&origin=*`;

      const res = await fetch(apiUrl);
      const data = await res.json();
      setResults(data.query.search);
    } catch (err) {
      console.error(err);
      setError("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ⌨️ Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") searchWikipedia();
  };

  return (
    <div className="wiki-app">
      <h1>Wikipedia Viewer</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Wikipedia..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={searchWikipedia}>Search</button>
        <button
          onClick={() =>
            window.open(
              "https://en.wikipedia.org/wiki/Special:Random",
              "_blank"
            )
          }
        >
          Random
        </button>
      </div>

      {/* Messages */}
      {loading && <p>🔎 Searching for "{query}"...</p>}
      {error && <p>{error}</p>}

      {/* Results */}
      <div id="results">
        {!loading && !error && results.length === 0 && query && (
          <p>No results found.</p>
        )}
        {results.map((item) => {
          const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(
            item.title
          )}`;
          const snippet = item.snippet.replace(/<\/?[^>]+(>|$)/g, "");
          return (
            <div key={item.pageid} className="result-item">
              <a href={url} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
              <p>{snippet}...</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
