// Speech synthesis and recognition utility for Chinese (zh-CN)
// Synchronized with authentic native human Chinese speakers (zh-CN)

// Search and prioritize authentic native human voices safely
export function getNativeChineseVoice(): SpeechSynthesisVoice | null {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // 1. Top tier: Natural/Neural native speaker voices (Microsoft & Google human voices)
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

    // 2. High tier: Apple native voices (Ting-Ting, Sin-ji)
    const appleVoice = voices.find(
      (v) =>
        v.lang &&
        v.lang.replace('_', '-').startsWith('zh') &&
        (v.name.includes('Ting-Ting') || v.name.includes('Sin-ji') || v.name.includes('Mei-Jia'))
    );
    if (appleVoice) return appleVoice;

    // 3. Any standard zh-CN voice
    const zhCNVoice = voices.find((v) => v.lang && v.lang.replace('_', '-') === 'zh-CN');
    if (zhCNVoice) return zhCNVoice;

    // 4. Any Chinese voice
    const anyChinese = voices.find((v) => v.lang && v.lang.replace('_', '-').startsWith('zh'));
    return anyChinese || null;
  } catch (e) {
    return null;
  }
}

export function getNativeVoiceDisplayName(): string {
  try {
    const voice = getNativeChineseVoice();
    if (!voice) return 'Giọng bản xứ Phổ Thông (zh-CN)';
    if (voice.name.includes('Xiaoxiao')) return 'Giọng bản xứ Bắc Kinh (Xiaoxiao - Tự nhiên)';
    if (voice.name.includes('Yunxi')) return 'Giọng bản xứ Bắc Kinh (Yunxi - Tự nhiên)';
    if (voice.name.includes('Google 普通话')) return 'Giọng bản xứ Google 普通话 (Chuẩn)';
    if (voice.name.includes('Ting-Ting')) return 'Giọng bản xứ Ting-Ting (Apple - Tự nhiên)';
    return `Giọng bản xứ: ${voice.name}`;
  } catch (e) {
    return 'Giọng bản xứ Phổ Thông (zh-CN)';
  }
}

// 1. Text-to-Speech (TTS)
export function speakChinese(
  text: string,
  rate: number = 0.9,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser');
      return false;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const cleanText = text.replace(/[\(\)（）\[\]【】]/g, '').trim();
    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'zh-CN';
    utterance.rate = rate; // 0.85 - 1.0 for authentic natural cadence
    utterance.pitch = 1.0; // Natural standard human pitch

    const nativeVoice = getNativeChineseVoice();
    if (nativeVoice) {
      utterance.voice = nativeVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Error during speakChinese:', err);
    if (onEnd) onEnd();
    return false;
  }
}

export function stopSpeaking(): void {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch (e) {
    // ignore
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
