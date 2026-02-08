import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Music, ChevronLeft, ChevronRight } from 'lucide-react';

interface SpotifyPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: number;
  genre?: string;
  spotifyUrl: string;
}

interface SpotifyEmbedPlayerProps {
  playlist?: SpotifyPlaylist;
}

const SpotifyEmbedPlayer: React.FC<SpotifyEmbedPlayerProps> = ({ playlist }) => {
  const allPlaylists: SpotifyPlaylist[] = [
    {
      id: '2wXcoMxk6fKzI0ugHbIoe9',
      name: 'Cooking Vibes',
      description: 'Perfect background music for cooking sessions',
      tracks: 25,
      genre: 'Chill',
      spotifyUrl: 'https://open.spotify.com/playlist/2wXcoMxk6fKzI0ugHbIoe9'
    },
    {
      id: '0tgRz1amABveir7gBY2JE3',
      name: 'Kitchen Beats',
      description: 'Upbeat tunes to energize your cooking',
      tracks: 32,
      genre: 'Pop',
      spotifyUrl: 'https://open.spotify.com/playlist/0tgRz1amABveir7gBY2JE3'
    },
    {
      id: '4TvVpoyxF9kmnu1GLikiQp',
      name: 'Upbeat Hip Hop',
      description: 'Curated playlist for culinary enthusiasts',
      tracks: 28,
      genre: 'Jazz',
      spotifyUrl: 'https://open.spotify.com/playlist/4TvVpoyxF9kmnu1GLikiQp'
    },
    {
      id: '26ebEk7vV0OenGcypVT9mX',
      name: 'Bollywood Nostalgia',
      description: 'High-energy music for meal prep',
      tracks: 45,
      genre: 'Electronic',
      spotifyUrl: 'https://open.spotify.com/playlist/26ebEk7vV0OenGcypVT9mX'
    },
    {
      id: '26Zi3qLKC9cAWDs7wbbSzc',
      name: 'Feel Good Dinner',
      description: 'Feel-good tracks for dinner time',
      tracks: 38,
      genre: 'Feel Good',
      spotifyUrl: 'https://open.spotify.com/playlist/26Zi3qLKC9cAWDs7wbbSzc'
    },
    {
      id: '46LwxpknVk3mJVyFPuE7Uc',
      name: 'Sade Special',
      description: 'Smooth jazz for cooking and dining',
      tracks: 42,
      genre: 'Jazz',
      spotifyUrl: 'https://open.spotify.com/playlist/46LwxpknVk3mJVyFPuE7Uc'
    },
    {
      id: '4S2OI796NEnw3PXzUNDaSi',
      name: 'Groovy Beats',
      description: 'Timeless songs for the kitchen',
      tracks: 35,
      genre: 'Classic',
      spotifyUrl: 'https://open.spotify.com/playlist/4S2OI796NEnw3PXzUNDaSi'
    },
    {
      id: '0LyufXlq2NizZkJFbP9MUy',
      name: 'Soft Jazz',
      description: 'Party vibes for cooking with friends',
      tracks: 50,
      genre: 'Party',
      spotifyUrl: 'https://open.spotify.com/playlist/0LyufXlq2NizZkJFbP9MUy'
    }
  ];

  const playlists = playlist ? [playlist] : allPlaylists;
  const [currentIndex, setCurrentIndex] = useState(0);
  const playlistsPerPage = 2;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + playlistsPerPage) % playlists.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - playlistsPerPage + playlists.length) % playlists.length);
  };

  const getVisiblePlaylists = () => {
    const visible = [];
    for (let i = 0; i < playlistsPerPage; i++) {
      const index = (currentIndex + i) % playlists.length;
      visible.push(playlists[index]);
    }
    return visible;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            The Perfect Playlists for You
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {playlists.length} playlists
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
            disabled={playlists.length <= playlistsPerPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="text-sm text-muted-foreground">
            {Math.floor(currentIndex / playlistsPerPage) + 1} / {Math.ceil(playlists.length / playlistsPerPage)}
          </div>
          
          <button
            onClick={nextSlide}
            className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
            disabled={playlists.length <= playlistsPerPage}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Horizontal Ribbon of Playlists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getVisiblePlaylists().map((playlist) => (
            <div key={playlist.id} className="space-y-3">
              {/* Playlist Info */}
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm truncate">{playlist.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {playlist.description}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {playlist.tracks} tracks
                    </Badge>
                    {playlist.genre && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {playlist.genre}
                      </Badge>
                    )}
                  </div>
                </div>
                <a
                  href={playlist.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-1 text-primary hover:bg-primary/10 rounded transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Smaller Spotify Embedded Player */}
              <div className="rounded-lg overflow-hidden border border-border">
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=1`}
                  width="100%"
                  height="155"
                  frameBorder="0"
                  allow="encrypted-media"
                  className="w-full"
                  title={`${playlist.name} - Spotify Playlist`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Playlist Indicators */}
        {playlists.length > playlistsPerPage && (
          <div className="flex justify-center gap-1">
            {Array.from({ length: Math.ceil(playlists.length / playlistsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * playlistsPerPage)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / playlistsPerPage) === index
                    ? 'bg-primary'
                    : 'bg-muted hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpotifyEmbedPlayer;
