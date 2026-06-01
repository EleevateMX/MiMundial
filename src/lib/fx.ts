"use client";

// Efectos de sonido (WebAudio, sin archivos) y vibración para recompensas.

let ctx: AudioContext | null = null;
let enabled = true;

export function setSoundEnabled(on: boolean) {
  enabled = on;
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function tone(freq: number, start: number, dur: number, gain = 0.08, type: OscillatorType = "triangle") {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, c.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  osc.connect(g).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.02);
}

export function buzz(pattern: number | number[] = 20) {
  if (!enabled) return;
  navigator.vibrate?.(pattern);
}

// Moneda / acierto
export function playCoin() {
  if (!enabled) return;
  tone(880, 0, 0.12, 0.07, "square");
  tone(1320, 0.08, 0.14, 0.06, "square");
  buzz(15);
}

// Desbloqueo de logro
export function playUnlock() {
  if (!enabled) return;
  tone(660, 0, 0.12);
  tone(990, 0.1, 0.16);
  buzz([10, 30, 10]);
}

// Subida de nivel (arpegio)
export function playLevelUp() {
  if (!enabled) return;
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22, 0.08));
  buzz([20, 40, 20, 40]);
}
