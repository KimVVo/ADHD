import React, { useState, useEffect, useRef } from 'react';
import { MdMusicNote } from 'react-icons/md';
import { IoVolumeLow } from 'react-icons/io5';

const musicOptions = {
  Lofi: 'q0ff3e-A7DY',
  Rain: 'IUfA_J4eES0',
  Fire: 'UgHKb_7884o',
  Nature: '29XymHesxa0',
  Piano: 'sAcj8me7wGI',
};

const BackgroundMusic = () => {
  const [showMusic, setShowMusic] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef(null);

  // Load YouTube API once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    } else if (!playerRef.current) {
      window.onYouTubeIframeAPIReady();
    }

    window.onYouTubeIframeAPIReady = () => {
      if (!playerRef.current) {
        playerRef.current = new window.YT.Player('yt-player', {
          height: '0',
          width: '0',
          events: {
            onReady: (event) => {
              setIsPlayerReady(true);
              event.target.setVolume(volume);
            },
          },
        });
      }
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  const handleMusicChange = (id) => {
    setCurrentTrack(id);
    if (playerRef.current && isPlayerReady) {
      playerRef.current.loadVideoById({
        videoId: id,
        suggestedQuality: 'small',
      });
      playerRef.current.setLoop(true); // Will only work if playlist is set
      playerRef.current.setVolume(volume);
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseInt(e.target.value, 10);
    setVolume(vol);
    if (playerRef.current && isPlayerReady) {
      playerRef.current.setVolume(vol);
    }
  };

  const stopAudio = () => {
    if (playerRef.current && playerRef.current.stopVideo) {
      playerRef.current.stopVideo();
    }
    setCurrentTrack(null);
  };

  return (
    <div className="absolute bottom-5 left-25 z-50">
      {/* Always mounted hidden player */}
      <div id="yt-player" style={{ display: 'none' }}></div>

      {/* Toggle Button */}
      <button
        className="text-white opacity-80 hover:opacity-90 -mr-4 shadow-2xl p-3 pr-6"
        onClick={() => setShowMusic(!showMusic)}
      >
        <MdMusicNote size={30} />
      </button>

      {/* Music Dropdown */}
      {showMusic && (
        <div className="absolute bottom-16 left-0 bg-white glass-effect shadow-lg rounded-lg p-1 w-45">
          {/* Volume Control */}
          <div className="flex items-center justify-between p-2 mb-2">
            <span className="text-xs text-white"><IoVolumeLow size={22} /></span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-blue-400"
            />
            <span className="text-xs text-white">{volume}</span>
          </div>

          {/* Music Options */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(musicOptions).map((type) => (
              <button
                key={type}
                onClick={() => handleMusicChange(musicOptions[type])}
                className={`h-12 w-20 rounded-md border-2 transition ${
                  currentTrack === musicOptions[type]
                    ? 'border-blue-400 shadow-lg'
                    : 'border-gray-500 hover:border-gray-400'
                }`}
                style={{
                  backgroundImage: `url(/images/Genres/${type.toLowerCase()}.jpg)`,
                  backgroundSize: 'cover',
                }}
              >
                <div className="h-full rounded-md lofi-overlay w-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{type}</span>
                </div>
              </button>
            ))}

            {/* "None" Button */}
            <button
              onClick={stopAudio}
              className={`h-12 w-20 rounded-md border-2 transition bg-black ${
                currentTrack === null
                  ? 'border-blue-400 shadow-lg'
                  : 'border-gray-500 hover:border-gray-400'
              }`}
            >
              <div className="h-full w-full rounded-md bg-black bg-opacity-30 flex items-center justify-center">
                <span className="text-white text-xs font-medium">None</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundMusic;
