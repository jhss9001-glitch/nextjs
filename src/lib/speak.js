// 브라우저 음성 읽기. 미지원 환경에서는 toast로 안내합니다.
export function speak(text, lang, toast) {
  if (!("speechSynthesis" in window)) {
    toast("이 브라우저는 음성 읽기를 지원하지 않습니다.");
    return;
  }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.9;
  const voice = speechSynthesis.getVoices().find((v) => v.lang.replace("_", "-").startsWith(lang.slice(0, 2)));
  if (voice) u.voice = voice;
  speechSynthesis.speak(u);
}
