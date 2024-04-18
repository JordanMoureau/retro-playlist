import { useCallback, useState } from "react";

export default function SearchBar({ searchCall }) {
  const [search, setSearch] = useState("top songs");

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setSearch(e.target.value);
  }, []);

  const searched = useCallback(
    (e) => {
      e.preventDefault();
      searchCall(search);
      setSearch("");
    },
    [searchCall, search]
  );

  return (
    <div className="search-bar">
      {/* <form onSubmit={handleSearch}> */}
      <input
        value={search}
        placeholder="Search for songs"
        onChange={handleSearch}
      />
      <button onClick={searched} disabled={search === "" ? "true" : ""}>
        Submit
      </button>
      {/* </form> */}
    </div>
  );
}
