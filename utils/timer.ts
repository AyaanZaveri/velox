export const timer = (callback: any, delay: number) => {
  let id: any;
  let started: Date;
  let remaining: number = delay;
  let running: boolean;

  this.start = function () {
    running = true;
    started = new Date();
    id = setTimeout(callback, remaining);
  };

  this.pause = function () {
    running = false;
    clearTimeout(id);
    remaining -= new Date() - started;
  };

  this.getTimeLeft = function () {
    if (running) {
      this.pause();
      this.start();
    }

    return remaining;
  };

  this.getStateRunning = function () {
    return running;
  };

  this.start();
};
