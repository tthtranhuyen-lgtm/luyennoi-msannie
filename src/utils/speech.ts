// Speech synthesis and recognition utility for Chinese (zh-CN)
// Synchronized with pre-generated natural Mandarin neural voice (zh-CN-XiaoxiaoNeural)

import { AUDIO_MANIFEST } from '../data/audioManifest';

let currentAudio: HTMLAudioElement | null = null;
let currentOnEnd: (() => void) | null = null;
let currentObjectUrl: string | null = null;
let playbackToken = 0;

export function normalizeSpeechKey(text: string): string {
  return String(text || '')
    .replace(/\([^)]*[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ][^)]*\)/g, '')
    .replace(/[()（）[\]【】]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// High-quality fallback check (strictly excludes robotic desktop voices like Microsoft Huihui)
export function getNativeChineseVoice(): SpeechSynthesisVoice | null {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const topTier = voices.find(
      (v) =>
        v.lang &&
        v.lang.replace('_', '-').startsWith('zh') &&
        (v.name.includes('Natural') ||
          v.name.includes('Xiaoxiao') ||
          v.name.includes('Yunxi') ||
          v.name.includes('Yunjian') ||
          v.name.includes('Xiaoyi') ||
          v.name.includes('Google 普通话'))
    );
    if (topTier) return topTier;

    const appleVoice = voices.find(
      (v) =>
        v.lang &&
        v.lang.replace('_', '-').startsWith('zh') &&
        (v.name.includes('Ting-Ting') || v.name.includes('Sin-ji') || v.name.includes('Mei-Jia'))
    );
    return appleVoice || null;
  } catch {
    return null;
  }
}

export function getNativeVoiceDisplayName(): string {
  return 'Giọng bản xứ Phổ Thông (Xiaoxiao - Tự nhiên)';
}

function cleanupCurrentAudio(): void {
  if (currentAudio) {
    try {
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.removeAttribute('src');
    } catch {
      // ignore
    }
    currentAudio = null;
  }

  if (currentObjectUrl) {
    try {
      URL.revokeObjectURL(currentObjectUrl);
    } catch {
      // ignore
    }
    currentObjectUrl = null;
  }
}

function finishActivePlayback(token: number): void {
  if (token !== playbackToken) return;
  cleanupCurrentAudio();
  const cb = currentOnEnd;
  currentOnEnd = null;
  if (cb) {
    try {
      cb();
    } catch {
      // ignore
    }
  }
}

function playAudioFromUrl(
  url: string,
  rate: number,
  token: number,
  isBlobUrl: boolean,
  onStart?: () => void
): void {
  if (token !== playbackToken) {
    if (isBlobUrl) URL.revokeObjectURL(url);
    return;
  }

  cleanupCurrentAudio();

  const audio = new Audio(url);
  const clampedRate = Math.min(2.0, Math.max(0.5, rate || 0.9));
  audio.playbackRate = clampedRate;
  (audio as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true;

  currentAudio = audio;
  if (isBlobUrl) {
    currentObjectUrl = url;
  }

  audio.onended = () => finishActivePlayback(token);
  audio.onerror = () => finishActivePlayback(token);

  if (onStart) {
    try {
      onStart();
    } catch {
      // ignore
    }
  }

  audio.play().catch((err) => {
    console.warn('Audio playback prevented or failed:', err);
    finishActivePlayback(token);
  });
}

// 1. Text-to-Speech (TTS) backed by unified XiaoxiaoNeural MP3 assets
export function speakChinese(
  text: string,
  rate: number = 0.9,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  try {
    if (typeof window === 'undefined') {
      if (onEnd) onEnd();
      return false;
    }

    stopSpeaking();

    const cleanText = normalizeSpeechKey(text);
    if (!cleanText) {
      if (onEnd) onEnd();
      return false;
    }

    const myToken = ++playbackToken;
    currentOnEnd = onEnd || null;

    // 1. Pre-generated XiaoxiaoNeural MP3 asset (works 100% offline & on GitHub Pages)
    const assetUrl = AUDIO_MANIFEST[cleanText];
    if (assetUrl) {
      playAudioFromUrl(assetUrl, rate, myToken, false, onStart);
      return true;
    }

    // 2. Dynamic text (e.g. live AI roleplay replies): fetch from /api/tts if server is running
    fetch(`/api/tts?text=${encodeURIComponent(cleanText)}`)
      .then(async (res) => {
        if (myToken !== playbackToken) return;
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !contentType.includes('audio')) {
          throw new Error('Dynamic TTS endpoint unavailable');
        }
        const blob = await res.blob();
        if (myToken !== playbackToken) return;
        const blobUrl = URL.createObjectURL(blob);
        playAudioFromUrl(blobUrl, rate, myToken, true, onStart);
      })
      .catch(() => {
        if (myToken !== playbackToken) return;

        // Only allow high-quality Neural/Apple browser voices as last resort for dynamic text
        const qualityVoice = getNativeChineseVoice();
        if (qualityVoice && 'speechSynthesis' in window) {
          try {
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = 'zh-CN';
            utterance.voice = qualityVoice;
            utterance.rate = Math.min(2.0, Math.max(0.5, rate || 0.9));
            utterance.pitch = 1.0;
            utterance.onstart = () => {
              if (myToken === playbackToken && onStart) onStart();
            };
            utterance.onend = () => finishActivePlayback(myToken);
            utterance.onerror = () => finishActivePlayback(myToken);
            window.speechSynthesis.speak(utterance);
            return;
          } catch {
            // fall through
          }
        }

        finishActivePlayback(myToken);
      });

    return true;
  } catch (err) {
    console.warn('Error during speakChinese:', err);
    if (onEnd) onEnd();
    return false;
  }
}

export function stopSpeaking(): void {
  playbackToken += 1;
  cleanupCurrentAudio();

  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // ignore
  }

  const cb = currentOnEnd;
  currentOnEnd = null;
  if (cb) {
    try {
      cb();
    } catch {
      // ignore
    }
  }
}

// 2. Speech Recognition (STT) for student voice recognition
export interface SpeechRecognitionListener {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (errorMsg: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export class ChineseSpeechRecognizer {
  private recognition: any = null;
  private isListening: boolean = false;
  private accumulatedText: string = '';

  constructor() {
    // Lazy instantiation: DO NOT create speech recognition in constructor!
    // Instantiating 30+ WebSpeech recognizers at once causes browser DOMException / crashes.
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  public startListening(listener: SpeechRecognitionListener, initialText: string = ''): void {
    if (!this.isSupported()) {
      listener.onError('Trình duyệt không hỗ trợ nhận dạng giọng nói trực tiếp. Bạn có thể gõ chữ.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        listener.onError('Trình duyệt không hỗ trợ nhận dạng giọng nói trực tiếp.');
        return;
      }

      this.recognition = new SpeechRecognitionClass();
      this.recognition.lang = 'zh-CN';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.accumulatedText = initialText ? initialText.trim() + ' ' : '';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (listener.onStart) listener.onStart();
      };

      this.recognition.onresult = (event: any) => {
        try {
          let interim = '';
          let newlyFinalized = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const chunk = event.results[i][0]?.transcript || '';
            if (event.results[i].isFinal) {
              newlyFinalized += chunk;
            } else {
              interim += chunk;
            }
          }

          if (newlyFinalized) {
            this.accumulatedText += newlyFinalized;
          }

          const fullTranscript = (this.accumulatedText + interim).trim();
          listener.onResult(fullTranscript, !!newlyFinalized && !interim);
        } catch (e) {
          // ignore processing error
        }
      };

      this.recognition.onerror = (event: any) => {
        // Don't kill continuous recognition on transient 'no-speech'
        if (event.error === 'no-speech') {
          return;
        }
        this.isListening = false;
        let msg = 'Lỗi nhận dạng: ' + (event.error || '');
        if (event.error === 'not-allowed') {
          msg = 'Vui lòng cấp quyền truy cập micro trong trình duyệt để nhận dạng giọng nói.';
        }
        listener.onError(msg);
        if (listener.onEnd) listener.onEnd();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (listener.onEnd) listener.onEnd();
      };

      this.recognition.start();
    } catch (err: any) {
      this.isListening = false;
      listener.onError('Không thể khởi động micro: ' + (err.message || 'Lỗi không xác định'));
    }
  }

  public clearAccumulatedText(): void {
    this.accumulatedText = '';
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
    this.recognition = null;
  }
}
