import { VESTA_CONFIG } from '@/constants/vesta.constants';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import type { TTSRequest, VestaApiResponse } from './vesta.types';


export async function apiSendVoiceMessage(params: {
  audioUri: string;
  homeId: number;
  token: string;
}): Promise<string> {
  const { audioUri, homeId, token } = params;

  const formData = new FormData();
  formData.append('home_id', String(homeId));
  formData.append('laravel_token', token);

  if (Platform.OS === 'web') {
    const resp = await fetch(audioUri);
    const blob = await resp.blob();
    formData.append('audio', blob, 'voice_command.m4a');
  } else {
    formData.append('audio', {
      uri: Platform.OS === 'ios' ? audioUri.replace('file://', '') : audioUri,
      name: 'voice_command.m4a',
      type: 'audio/m4a',
    } as any);
  }

  const response = await fetch(VESTA_CONFIG.API_URL, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error: ${response.status} - ${text}`);
  }

  const data: VestaApiResponse = await response.json();
  
  return data.response || data.answer || data.message || data.text || JSON.stringify(data);
}


export async function apiTextToSpeech(params: TTSRequest): Promise<Blob> {
  const { text, apiKey } = params;

  if (!apiKey) {
    throw new Error('OpenAI API key is required for TTS');
  }

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: VESTA_CONFIG.TTS_MODEL,
      input: text,
      voice: VESTA_CONFIG.TTS_VOICE,
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI TTS Error: ${err}`);
  }

  return await response.blob();
}


export async function blobToFileUri(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      try {
        const base64data = (reader.result as string).split(',')[1];
        const fileUri = FileSystem.documentDirectory + `vesta_response_${Date.now()}.mp3`;
        await FileSystem.writeAsStringAsync(fileUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        resolve(fileUri);
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}
