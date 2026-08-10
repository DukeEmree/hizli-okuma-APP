export type TimerCallback = (elapsedMs: number) => void;

export class ExerciseTimer {
  private startTime: number | null = null;
  private pauseTime: number | null = null;
  private totalPausedDurationMs = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private updateIntervalMs: number;
  private onTick: TimerCallback;

  constructor(onTick: TimerCallback, updateIntervalMs = 100) {
    this.onTick = onTick;
    this.updateIntervalMs = updateIntervalMs;
  }

  public start() {
    if (this.intervalId) return; // Zaten çalışıyor

    const now = Date.now();

    if (this.pauseTime) {
      // Resume durumunda
      this.totalPausedDurationMs += now - this.pauseTime;
      this.pauseTime = null;
    } else if (!this.startTime) {
      // İlk defa start
      this.startTime = now;
      this.totalPausedDurationMs = 0;
    }

    this.intervalId = setInterval(() => {
      this.onTick(this.getElapsedMs());
    }, this.updateIntervalMs);
  }

  public pause() {
    if (!this.intervalId) return; // Zaten duraklatılmış
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.pauseTime = Date.now();
  }

  public reset() {
    this.cleanup();
    this.startTime = null;
    this.pauseTime = null;
    this.totalPausedDurationMs = 0;
    this.onTick(0);
  }

  public cleanup() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public getElapsedMs(): number {
    if (!this.startTime) return 0;
    
    // Eğer şu an duraklatılmışsa, pauseTime'a kadarki süreyi hesapla
    const endTime = this.pauseTime ? this.pauseTime : Date.now();
    return Math.max(0, endTime - this.startTime - this.totalPausedDurationMs);
  }

  public isRunning(): boolean {
    return this.intervalId !== null;
  }
}
