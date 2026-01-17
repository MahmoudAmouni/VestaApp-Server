// Vesta Configuration Constants

export const VESTA_CONFIG = {
  API_URL: 'http://127.0.0.1:8001/api/agent/chat',
  
  // Audio Detection
  SILENCE_THRESHOLD: -60,
  SILENCE_DURATION: 1750, // milliseconds
  VOLUME_THRESHOLD: 15,
  
  // Animation
  ANIMATION_DURATION: 2000,
  RIPPLE_DURATION: 2000,
  DOT_BOUNCE_DURATION: 400,
  
  // Colors
  COLORS: {
    primary: '#c45b3d',
  },
  
  // Recording
  RECORDER_POLL_INTERVAL: 200, // milliseconds
  
  // TTS
  TTS_MODEL: 'tts-1-hd',
  TTS_VOICE: 'nova',
} as const;

// Asset paths
export const VESTA_IMAGES = {
  listening: require('@/assets/images/vesta_listenning.png'),
  thinking: require('@/assets/images/vesta_thinking.png'),
  speaking: require('@/assets/images/vesta_speaking.png'),
} as const;
