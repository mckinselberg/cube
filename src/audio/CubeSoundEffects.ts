/**
 * Rubik's cube sound character
 *
 * We are trying to approximate the *specific* feel of a 3×3 speed cube:
 *
 * - Material:
 *   - Hard plastic on plastic – not metal, not wood, not rubber.
 *   - Slightly hollow, with a small "chassis resonance" around ~300–800 Hz.
 *
 * - Move phases:
 *   1. Start / friction:
 *      - Very short burst of noisy friction as the layer begins to move.
 *      - Broadband noise with stronger high frequencies (~4–8 kHz) to suggest plastic scraping.
 *   2. Slide:
 *      - A soft, lower-amplitude scrape while the face is turning.
 *      - Noise band-pass filtered roughly around 2–6 kHz.
 *      - Envelope length scales with move speed (faster move → shorter slide, but slightly higher amplitude).
 *   3. Snap / click:
 *      - Distinct, sharp transient when the layer locks into place.
 *      - Very short attack (1–2 ms), short decay (40–100 ms), almost no sustain.
 *      - Strong high-frequency content (~4–10 kHz) with a little low-mid body.
 *      - Slight randomization per click (±2–3 dB gain, small detune, slight timing jitter).
 *
 * - Variations:
 *   - Each move should sound slightly different:
 *     - Randomize noise filter cutoff, Q, and gain within small ranges.
 *     - Optionally add a very subtle pitched "thock" layer (e.g. a short sine/triangle burst ~300–500 Hz).
 *   - Face turns (R, L, U, D, F, B) feel a bit "heavier" than cube rotations (x, y, z) or slice moves (M, E, S).
 *     - Heavier: slightly more low-mid, slightly longer decay on click.
 *
 * - UX constraints:
 *   - Sounds must be low latency and suitable for interactive play.
 *   - No long tails; total length per move sound should be under ~150 ms.
 *   - All sound should be generated procedurally via Web Audio (noise + filters + envelopes).
 *
 * Implementation hints:
 *   - Use a shared AudioContext.
 *   - Create a reusable white-noise buffer and play short snippets of it with gain + filter envelopes.
 *   - For "click", consider:
 *       - Noise → band-pass/high-pass filter → gain envelope (AD/AR).
 *   - For "slide", consider:
 *       - Noise → band-pass filter with slower decay, lower volume.
 *   - Expose parameters (intensity, brightness, decay, randomness) so we can tune how "heavy" or "smooth" the cube feels.
 */

export class CubeSoundEffects {
  private audioContext: AudioContext | null = null;
  private enabled = true;
  private volume = 0.3;
  private noiseBuffer: AudioBuffer | null = null;

  // 3-band EQ (gain in dB)
  private lowGain = 0; // ~200 Hz
  private midGain = 0; // ~1000 Hz
  private highGain = 0; // ~5000 Hz

  // Envelope parameters
  private attackTime = 0.002; // 2ms
  private decayTime = 0.06; // 60ms

  // Filter parameters
  private brightness = 0.5; // 0-1, affects filter cutoff frequencies

  // Master EQ nodes (persistent)
  private lowShelf: BiquadFilterNode | null = null;
  private midPeak: BiquadFilterNode | null = null;
  private highShelf: BiquadFilterNode | null = null;

  // Each face has a slight pitch variation for the "thock" layer
  private readonly faceFrequencies: Record<string, number> = {
    U: 420, // Up
    D: 340, // Down - lower
    R: 380, // Right
    L: 360, // Left - slightly lower
    F: 400, // Front
    B: 350, // Back
  };

  constructor() {
    // Create audio context on first user interaction (browser requirement)
    if (typeof window !== "undefined") {
      document.addEventListener("click", () => this.initAudioContext(), {
        once: true,
      });
      document.addEventListener("touchstart", () => this.initAudioContext(), {
        once: true,
      });
    }
  }

  private initAudioContext(): void {
    if (!this.audioContext) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.audioContext = new AudioContextClass();
      this.createNoiseBuffer();
      this.setupMasterEQ();
      this.setupEffects();
    }
  }

  /**
   * Setup master 3-band EQ
   */
  private setupMasterEQ(): void {
    if (!this.audioContext) return;

    // Low shelf at 200 Hz
    this.lowShelf = this.audioContext.createBiquadFilter();
    this.lowShelf.type = "lowshelf";
    this.lowShelf.frequency.value = 200;
    this.lowShelf.gain.value = this.lowGain;

    // Mid peak at 1000 Hz
    this.midPeak = this.audioContext.createBiquadFilter();
    this.midPeak.type = "peaking";
    this.midPeak.frequency.value = 1000;
    this.midPeak.Q.value = 1;
    this.midPeak.gain.value = this.midGain;

    // High shelf at 5000 Hz
    this.highShelf = this.audioContext.createBiquadFilter();
    this.highShelf.type = "highshelf";
    this.highShelf.frequency.value = 5000;
    this.highShelf.gain.value = this.highGain;

    // Chain EQ
    this.lowShelf.connect(this.midPeak);
    this.midPeak.connect(this.highShelf);
  }

  /**
   * Connect EQ chain to audio destination
   */
  private setupEffects(): void {
    if (!this.audioContext || !this.highShelf) return;

    // Direct connection: EQ chain -> destination
    this.highShelf.connect(this.audioContext.destination);
  }

  /**
   * Create a reusable white noise buffer
   */
  private createNoiseBuffer(): void {
    if (!this.audioContext) return;

    // 1 second of white noise
    const bufferSize = this.audioContext.sampleRate;
    this.noiseBuffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate,
    );
    const data = this.noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }

  /**
   * Play sound for a move based on the face notation (U, R, F, D, L, B)
   */
  public playMoveForFace(
    face: string,
    _isPrime: boolean = false,
    isDouble: boolean = false,
  ): void {
    if (!this.enabled || !this.audioContext || !this.noiseBuffer) return;

    const baseFace = face.charAt(0).toUpperCase();
    const baseFreq = this.faceFrequencies[baseFace] || 380;

    const now = this.audioContext.currentTime;

    // Phase 1: Start friction (very short burst)
    this.createFriction(now, 0.008);

    // Phase 2: Slide (brief scrape)
    const slideDuration = isDouble ? 0.045 : 0.035;
    this.createSlide(now + 0.008, slideDuration);

    // Phase 3: Snap/click (sharp transient)
    const snapDelay = 0.008 + slideDuration;
    const snapCount = isDouble ? 2 : 1;

    for (let i = 0; i < snapCount; i++) {
      const delay = now + snapDelay + i * 0.06;
      const gainRandomness = 1 + (Math.random() * 0.12 - 0.06); // ±6% = ~±0.5 dB
      const freqRandomness = 1 + (Math.random() * 0.1 - 0.05); // ±5%
      const timingJitter = Math.random() * 0.004 - 0.002; // ±2ms

      this.createSnap(
        delay + timingJitter,
        baseFreq * freqRandomness,
        gainRandomness,
      );
    }
  }

  /**
   * Play sound for a regular move (U, R, F, D, L, B)
   * @deprecated Use playMoveForFace instead
   */
  public playMove(): void {
    this.playMoveForFace("U", false, false);
  }

  /**
   * Play sound for a prime move (U prime, R prime, etc)
   * @deprecated Use playMoveForFace instead
   */
  public playPrimeMove(): void {
    this.playMoveForFace("U", true, false);
  }

  /**
   * Play sound for a double move (U2, R2, etc)
   * @deprecated Use playMoveForFace instead
   */
  public playDoubleMove(): void {
    this.playMoveForFace("U", false, true);
  }

  /**
   * Phase 1: Start friction - very short burst of high-frequency noise
   */
  private createFriction(startTime: number, duration: number): void {
    if (!this.audioContext || !this.noiseBuffer || !this.lowShelf) return;

    const noise = this.audioContext.createBufferSource();
    noise.buffer = this.noiseBuffer;

    // High-pass filter for plastic scraping sound (4-8 kHz emphasis)
    const highPass = this.audioContext.createBiquadFilter();
    highPass.type = "highpass";
    const cutoff = 4000 + (this.brightness - 0.5) * 3000; // 2.5-5.5 kHz range
    highPass.frequency.setValueAtTime(cutoff, startTime);
    highPass.Q.setValueAtTime(0.5, startTime);

    const gainNode = this.audioContext.createGain();

    // Very short burst
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(
      this.volume * 0.4,
      startTime + this.attackTime,
    );
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noise.connect(highPass);
    highPass.connect(gainNode);
    gainNode.connect(this.lowShelf);

    noise.start(startTime);
    noise.stop(startTime + duration);
  }

  /**
   * Phase 2: Slide - soft scrape while turning
   */
  private createSlide(startTime: number, duration: number): void {
    if (!this.audioContext || !this.noiseBuffer || !this.lowShelf) return;

    const noise = this.audioContext.createBufferSource();
    noise.buffer = this.noiseBuffer;

    // Band-pass filter for mid-high frequencies (2-6 kHz)
    const bandPass = this.audioContext.createBiquadFilter();
    bandPass.type = "bandpass";
    const centerFreq =
      3500 + Math.random() * 1000 + (this.brightness - 0.5) * 2000;
    bandPass.frequency.setValueAtTime(centerFreq, startTime);
    bandPass.Q.setValueAtTime(2 + Math.random(), startTime); // Q between 2-3

    const gainNode = this.audioContext.createGain();

    // Lower amplitude, gradual fade
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(
      this.volume * 0.15,
      startTime + 0.005,
    );
    gainNode.gain.linearRampToValueAtTime(
      this.volume * 0.1,
      startTime + duration * 0.6,
    );
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noise.connect(bandPass);
    bandPass.connect(gainNode);
    gainNode.connect(this.lowShelf);

    noise.start(startTime);
    noise.stop(startTime + duration);
  }

  /**
   * Phase 3: Snap/click - sharp transient when locking into place
   */
  private createSnap(
    startTime: number,
    thockFreq: number,
    gainMultiplier: number,
  ): void {
    if (!this.audioContext || !this.noiseBuffer || !this.lowShelf) return;

    // Noise component (high-frequency content)
    const noise = this.audioContext.createBufferSource();
    noise.buffer = this.noiseBuffer;

    // High-pass filter for sharp click (4-10 kHz)
    const highPass = this.audioContext.createBiquadFilter();
    highPass.type = "highpass";
    const cutoff = 4000 + (this.brightness - 0.5) * 4000; // 2-6 kHz range
    highPass.frequency.setValueAtTime(cutoff, startTime);
    highPass.Q.setValueAtTime(1, startTime);

    const noiseGain = this.audioContext.createGain();
    const decayTime = this.decayTime + Math.random() * 0.02; // Add slight variation

    // Very sharp attack, exponential decay
    noiseGain.gain.setValueAtTime(0, startTime);
    noiseGain.gain.linearRampToValueAtTime(
      this.volume * 0.7 * gainMultiplier,
      startTime + this.attackTime,
    );
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + decayTime);

    noise.connect(highPass);
    highPass.connect(noiseGain);
    noiseGain.connect(this.lowShelf);

    noise.start(startTime);
    noise.stop(startTime + decayTime);

    // Subtle "thock" layer (low-mid body)
    const thock = this.audioContext.createOscillator();
    thock.type = "triangle";
    thock.frequency.setValueAtTime(thockFreq, startTime);

    const thockGain = this.audioContext.createGain();
    thockGain.gain.setValueAtTime(0, startTime);
    thockGain.gain.linearRampToValueAtTime(
      this.volume * 0.25 * gainMultiplier,
      startTime + this.attackTime,
    );
    thockGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

    thock.connect(thockGain);
    thockGain.connect(this.lowShelf);

    thock.start(startTime);
    thock.stop(startTime + 0.04);
  }

  /**
   * Play scramble sequence sound (rapid mechanical sounds)
   */
  public playScrambleSound(): void {
    if (!this.enabled || !this.audioContext || !this.noiseBuffer) return;

    const now = this.audioContext.currentTime;
    // Rapid sequence of snaps at varying pitches
    const pitches = [420, 360, 400, 340, 380, 350];
    for (let i = 0; i < pitches.length; i++) {
      const delay = now + i * 0.05; // 50ms between snaps
      this.createSnap(delay, pitches[i], 0.8);
    }
  }

  /**
   * Enable or disable sound effects
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    localStorage.setItem("cube-sound-enabled", enabled.toString());
  }

  /**
   * Check if sound is enabled
   */
  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem("cube-sound-volume", this.volume.toString());
  }

  /**
   * Get current volume
   */
  public getVolume(): number {
    return this.volume;
  }

  /**
   * Load preferences from localStorage
   */
  public loadPreferences(): void {
    const savedEnabled = localStorage.getItem("cube-sound-enabled");
    if (savedEnabled !== null) {
      this.enabled = savedEnabled === "true";
    }

    const savedVolume = localStorage.getItem("cube-sound-volume");
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }

    const savedLowGain = localStorage.getItem("cube-sound-lowGain");
    if (savedLowGain !== null) this.setLowGain(parseFloat(savedLowGain));

    const savedMidGain = localStorage.getItem("cube-sound-midGain");
    if (savedMidGain !== null) this.setMidGain(parseFloat(savedMidGain));

    const savedHighGain = localStorage.getItem("cube-sound-highGain");
    if (savedHighGain !== null) this.setHighGain(parseFloat(savedHighGain));

    const savedBrightness = localStorage.getItem("cube-sound-brightness");
    if (savedBrightness !== null)
      this.setBrightness(parseFloat(savedBrightness));

    const savedAttack = localStorage.getItem("cube-sound-attack");
    if (savedAttack !== null) this.setAttack(parseFloat(savedAttack));

    const savedDecay = localStorage.getItem("cube-sound-decay");
    if (savedDecay !== null) this.setDecay(parseFloat(savedDecay));
  }

  // 3-Band EQ Controls
  public setLowGain(gain: number): void {
    this.lowGain = Math.max(-12, Math.min(12, gain));
    if (this.lowShelf) this.lowShelf.gain.value = this.lowGain;
    localStorage.setItem("cube-sound-lowGain", this.lowGain.toString());
  }

  public getLowGain(): number {
    return this.lowGain;
  }

  public setMidGain(gain: number): void {
    this.midGain = Math.max(-12, Math.min(12, gain));
    if (this.midPeak) this.midPeak.gain.value = this.midGain;
    localStorage.setItem("cube-sound-midGain", this.midGain.toString());
  }

  public getMidGain(): number {
    return this.midGain;
  }

  public setHighGain(gain: number): void {
    this.highGain = Math.max(-12, Math.min(12, gain));
    if (this.highShelf) this.highShelf.gain.value = this.highGain;
    localStorage.setItem("cube-sound-highGain", this.highGain.toString());
  }

  public getHighGain(): number {
    return this.highGain;
  }

  // Filter Controls
  public setBrightness(value: number): void {
    this.brightness = Math.max(0, Math.min(1, value));
    localStorage.setItem("cube-sound-brightness", this.brightness.toString());
  }

  public getBrightness(): number {
    return this.brightness;
  }

  // Envelope Controls
  public setAttack(time: number): void {
    this.attackTime = Math.max(0.001, Math.min(0.01, time)); // 1-10ms
    localStorage.setItem("cube-sound-attack", this.attackTime.toString());
  }

  public getAttack(): number {
    return this.attackTime;
  }

  public setDecay(time: number): void {
    this.decayTime = Math.max(0.02, Math.min(0.15, time)); // 20-150ms
    localStorage.setItem("cube-sound-decay", this.decayTime.toString());
  }

  public getDecay(): number {
    return this.decayTime;
  }

  /**
   * Debug method to check audio state
   */
  public getAudioState(): Record<string, boolean | number> {
    return {
      enabled: this.enabled,
      volume: this.volume,
      audioContextCreated: !!this.audioContext,
      noiseBufferCreated: !!this.noiseBuffer,
      eqSetup: !!(this.lowShelf && this.midPeak && this.highShelf),
    };
  }
}
