export default function Playlist({
  playlist,
  setPlaylist,
  onSave,
  playlistName,
  setPlaylistName,
}) {
  function handleRemove(id) {
    setPlaylist((playlist) => playlist.filter((song) => song.id !== id));
  }

  // function namePlaylist(e) {
  //   e.preventDefault();
  //   setPlaylistName(e.target.value);
  //   console.log(namePlaylist);
  // }

  return (
    <div className="playlist-container">
      <form
        onChange={(e) => setPlaylistName(e.target.value)}
        value={playlistName}
      >
        <input placeholder="My Playlist" required />
      </form>

      <div className="playlist">
        {playlist.map((song) => (
          <div className="box width" key={song.id}>
            <h2>{song.name}</h2>
            <h3>by {song.artist}</h3>
            <p> from {song.album}</p>
            <button onClick={() => handleRemove(song.id)}> - </button>
          </div>
        ))}
        <AddToSpotify onSave={onSave} />
      </div>
    </div>
  );
}

function AddToSpotify({ onSave }) {
  return (
    <button className="spot-btn" onClick={onSave}>
      + Add to Spotify
    </button>
  );
}
