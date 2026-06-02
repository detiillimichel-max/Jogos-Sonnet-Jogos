const AudioFX = (() => {
  let ctx = null;
  function ensure() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  function beep(freq, dur, type = 'sine', vol = 0.2) {
    ensure();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  }
  function success() {
    beep(880, 0.12);
    setTimeout(() => beep(1320, 0.15), 100);
    if (navigator.vibrate) navigator.vibrate(30);
  }
  function error() {
    beep(200, 0.25, 'sawtooth', 0.15);
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
  }
  return { success, error };
})();
