import "./styles.css";
import { useState } from "react";
import Playlist from "./components/Playlist";
import SearchBar from "./components/SearchBar";
import Track from "./components/Track";
import ErrorMessage from "./components/ErrorMessage";

const CLIENT_ID = "517f22b742da48ce9e13e8e1f4999546";

const redirectUri = "http://retro-playlist.netlify.app/callback/";

export default function App() {
  const [playlist, setPlaylist] = useState([]);

  const [TracklistData, setTracklistData] = useState([]);

  let accessToken;

  const Spotify = {
    getAccessToken() {
      if (accessToken) {
        return accessToken;
      }

      const accessTokenMatch =
        window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
      if (accessTokenMatch && expiresInMatch) {
        accessToken = accessTokenMatch[1];
        //const expiresIn = Number(expiresInMatch[1]);
        // window.setTimeout(() => (accessToken = ""), expiresIn * 5000);
        //window.history.pushState("Access Token", null, "/"); // This clears the parameters, allowing us to grab a new access token when it expires.
        return accessToken;
      } else {
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        window.location = accessUrl;
      }
    },

    search(query) {
      const accessToken = Spotify.getAccessToken();
      return fetch(`https://api.spotify.com/v1/search?type=track&q=${query}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((jsonResponse) => {
          if (!jsonResponse.tracks) {
            return [];
          }
          return jsonResponse.tracks.items.map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
          }));
        });
    },

    savePlaylist(name, trackUris) {
      if (!name || !trackUris.length) {
        return;
      }

      const accessToken = Spotify.getAccessToken();
      const header = { Authorization: `Bearer ${accessToken}` };

      let userId;

      return fetch("https://api.spotify.com/v1/me", { headers: header })
        .then((response) => response.json())
        .then((jsonResponse) => {
          userId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: header,
            method: "POST",
            body: JSON.stringify({ name: name }),
          })
            .then((response) => response.json())
            .then((jsonResponse) => {
              const playlistId = jsonResponse.id;
              return fetch(
                `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                {
                  headers: header,
                  method: "POST",
                  body: JSON.stringify({ uris: trackUris }),
                }
              );
            });
        });
    },
  };

  const [playlistName, setPlaylistName] = useState("");

  // const savePlaylist = useCallback(() => {
  //   const trackUris = playlistTracks.map((track) => track.uri);
  //   Spotify.savePlaylist(playlistName, trackUris).then(() => {
  //     setPlaylistName("New Playlist");
  //     setPlaylistTracks([]);
  //   });
  // }, [playlistName, playlistTracks]);

  function savePlaylist() {
    const trackUris = playlist.map((track) => track.uri);
    return fetch(Spotify.savePlaylist(playlistName, trackUris)).then(() => {
      setPlaylist([]);
    });
  }

  // console.log(playlistName);
  // console.log(Spotify.userId);

  function searchCall(search) {
    Spotify.search(search).then(setTracklistData);
  }

  //add error handling for this and loader
  //any time you use await you need async

  // return fetch(Spotify.search(search).then(setTracklistData));

  function handleAdd(song) {
    const existingSong = playlist.find((s) => s.id === song.id);
    const newSong = playlist.concat(song);

    if (existingSong) {
      console.log("already added");
    } else {
      setPlaylist(newSong);
    }
  }

  return (
    <>
      <SearchBar searchCall={searchCall} />
      <div className="App">
        {accessToken ? (
          <ErrorMessage />
        ) : (
          <Track handleAdd={handleAdd} data={TracklistData} />
        )}
        <Playlist
          playlistName={playlistName}
          setPlaylistName={setPlaylistName}
          playlist={playlist}
          setPlaylist={setPlaylist}
          onSave={savePlaylist}
        />
      </div>
    </>
  );
}
