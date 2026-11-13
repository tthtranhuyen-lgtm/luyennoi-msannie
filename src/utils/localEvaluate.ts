export interface SpeechEvaluationResult {
  score: number;
  fluencyLevel: string;
  feedbackVi: string;
  pronunciationTipsVi: string;
  betterAlternative: string;
  betterAlternativePinyin: string;
  betterAlternativeVi: string;
}

export function buildLocalSpeechEvaluation(
  userText: string,
  targetText?: string,
  targetPinyin?: string,
  targetVi?: string
): SpeechEvaluationResult {
  const cleanUser = userText.trim();
  const cleanTarget = (targetText || '').trim();

  let score = 76;
  if (cleanTarget) {
    const targetChars = cleanTarget.replace(/[^\u4e00-\u9fa5]/g, '');
    const userChars = cleanUser.replace(/[^\u4e00-\u9fa5]/g, '');
    let matchCount = 0;
    for (const ch of userChars) {
      if (targetChars.includes(ch)) matchCount++;
    }
    const ratio = targetChars.length > 0 ? matchCount / targetChars.length : 0.7;
    score = Math.min(96, Math.max(68, Math.round(65 + ratio * 30)));
  } else {
    score = Math.min(92, Math.max(72, 70 + Math.min(20, cleanUser.length * 2)));
  }

  return {
    score,
    fluencyLevel: score >= 88 ? 'Xuất sắc (优秀)' : score >= 78 ? 'Tốt (良好)' : 'Khá (及格)',
    feedbackVi:
      score >= 85
        ? `Rất tốt! Bạn đã nói chuẩn ý và dùng đúng từ khóa trong câu "${cleanUser}".`
        : `Bạn đã hoàn thành câu nói "${cleanUser}". Hãy đối chiếu thêm với câu mẫu chuẩn bên dưới để tăng độ tự nhiên.`,
    pronunciationTipsVi:
      'Chú ý phát âm dứt khoát thanh 4 (từ cao rơi xuống thấp), ngân đều thanh 1 và đọc rõ các âm bật hơi (p, t, k, q, ch).',
    betterAlternative: cleanTarget || cleanUser,
    betterAlternativePinyin: targetPinyin || '',
    betterAlternativeVi: targetVi || 'Câu trả lời tự nhiên chuẩn khẩu ngữ sân bay.',
  };
}
