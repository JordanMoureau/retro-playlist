export default function Track({ data, setPlaylist, playlist, handleAdd }) {
  return (
    <div className="tracks">
      {data.map((song) => (
        <div className="box" key={song.id}>
          <h2>{song.name}</h2>
          <h3>by {song.artist}</h3>
          <p> from {song.album}</p>
          <button onClick={() => handleAdd(song)}> + </button>
        </div>
      ))}
    </div>
  );
}
