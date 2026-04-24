/* ===== 微醺爵士风 - 音效模块 ===== */
const SFX = (() => {
  let ctx = null, bgT = null;

  const init = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  };

  const note = (freq, type, dur, vol = 0.06, delay = 0) => {
    if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    const t = ctx.currentTime + delay;
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur);
  };

  // 玻璃杯碰杯声 - 高频短促 sine 波
  const click = () => {
    note(1200, 'sine', 0.08, 0.04);
    note(1800, 'sine', 0.05, 0.02, 0.02);
    note(2400, 'sine', 0.03, 0.01, 0.04);
  };

  // 温暖上升和弦 - 爵士七和弦
  const confirm = () => {
    note(262, 'triangle', 0.3, 0.05, 0);
    note(330, 'triangle', 0.3, 0.05, 0.05);
    note(392, 'triangle', 0.35, 0.04, 0.1);
    note(494, 'triangle', 0.4, 0.03, 0.15);
  };

  // 优雅揭示旋律
  const reveal = () => {
    [262, 330, 392, 523, 659].forEach((f, i) => note(f, 'sine', 0.6, 0.05, i * 0.1));
    note(784, 'sine', 0.5, 0.03, 0.5);
  };

  // 微醺爵士氛围 BGM
  const startBGM = () => {
    if (!ctx) return;
    // 暖色低频环境音
    const sz = ctx.sampleRate * 3, buf = ctx.createBuffer(1, sz, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const flt = ctx.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = 400;
    const gn = ctx.createGain(); gn.gain.value = 0.003;
    src.connect(flt).connect(gn).connect(ctx.destination); src.start();

    // 随机爵士音阶音符
    const JAZZ = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 783.99];
    const chime = () => {
      if (!ctx) return;
      const f = JAZZ[Math.floor(Math.random() * JAZZ.length)];
      const t = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.012, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, t + 2.8);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 2.9);
      // 偶尔双音（大三度）
      if (Math.random() > 0.65) {
        const o2 = ctx.createOscillator(), g2 = ctx.createGain();
        o2.type = 'sine'; o2.frequency.setValueAtTime(f * 1.25, t + 0.08);
        g2.gain.setValueAtTime(0, t + 0.08);
        g2.gain.linearRampToValueAtTime(0.005, t + 0.09);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 2);
        o2.connect(g2).connect(ctx.destination); o2.start(t + 0.08); o2.stop(t + 2.1);
      }
      bgT = setTimeout(chime, 3000 + Math.random() * 4500);
    };
    bgT = setTimeout(chime, 1200);
  };

  return { init, click, confirm, reveal, startBGM };
})();
