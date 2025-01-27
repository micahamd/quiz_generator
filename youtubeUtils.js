// YouTube utility functions
const youtubeUtils = {
  // Validate YouTube URL
  isValidYouTubeUrl: (url) => {
    const patterns = [
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /^(https?:\/\/)?(www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    ];
    return patterns.some(pattern => pattern.test(url));
  },

  // Extract video ID from URL
  extractVideoId: (url) => {
    const matches = url.match(/(?:v=|\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    return matches ? matches[1] : null;
  },

  // Initialize YouTube player
  initializePlayer: (containerId, videoId, onReady, onError) => {
    // Load YouTube API script if not already loaded
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    // Create player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      return new YT.Player(containerId, {
        height: '390',
        width: '640',
        videoId: videoId,
        events: {
          'onReady': onReady,
          'onError': onError
        }
      });
    };
  }
};

export default youtubeUtils;
