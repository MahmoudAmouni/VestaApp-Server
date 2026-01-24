export const VESTA_CONFIG = {
  API_URL: 'http://127.0.0.1:8002/api/agent/chat',
  
  SILENCE_THRESHOLD: -60,
  SILENCE_DURATION: 1750, 
  VOLUME_THRESHOLD: 15,
  
  ANIMATION_DURATION: 2000,
  RIPPLE_DURATION: 2000,
  DOT_BOUNCE_DURATION: 400,
  
  COLORS: {
    primary: '#E7523C',
  },
  
  RECORDER_POLL_INTERVAL: 200, 
  
  TTS_MODEL: 'tts-1-hd',
  TTS_VOICE: 'nova',
} as const;

export const VESTA_IMAGES = {
  listening: require('@/assets/images/vesta_listenning.png'),
  thinking: require('@/assets/images/vesta_thinking.png'),
  speaking: require('@/assets/images/vesta_speaking.png'),
} as const;
