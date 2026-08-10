/**
 * Metindeki kelime sayısını hesaplar.
 * Türkçe ve İngilizce gibi dillerde boşluk, noktalama ve yeni satırlara göre temizleme yapar.
 *
 * @param text Hesaplanacak metin
 * @returns Kelime sayısı
 */
export function calculateWordsCount(text: string): number {
  if (!text) return 0;
  // Sadece harf, rakam ve tire içeren kelimeleri saymak için regex
  // \p{L} -> Unicode harfler, \p{N} -> Rakamlar
  const words = text.match(/[\p{L}\p{N}-]+/gu);
  return words ? words.length : 0;
}

/**
 * Belirtilen sürede okunan metin için WPM (Words Per Minute) değerini hesaplar.
 *
 * @param wordsCount Toplam okunan kelime sayısı
 * @param durationMs Toplam okuma süresi (milisaniye cinsinden)
 * @returns WPM değeri (en yakın tam sayıya yuvarlanmış)
 */
export function calculateWPM(wordsCount: number, durationMs: number): number {
  if (durationMs <= 0 || wordsCount <= 0) return 0;

  const minutes = durationMs / 60000;
  const wpm = wordsCount / minutes;

  return Math.round(wpm);
}

/**
 * Belirli bir metnin, hedeflenen WPM ile okunduğunda ortalama ne kadar süreceğini hesaplar.
 *
 * @param wordsCount Kelime sayısı
 * @param targetWPM Hedef okuma hızı (WPM)
 * @returns Süre (milisaniye cinsinden)
 */
export function calculateDurationFromWPM(wordsCount: number, targetWPM: number): number {
  if (targetWPM <= 0 || wordsCount <= 0) return 0;

  const minutes = wordsCount / targetWPM;
  return Math.round(minutes * 60000);
}
