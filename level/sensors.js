/* SENSORS */
const Sensors = {
  samples: [],
  invert: false,
  active: false,

  /* PERMISSION */
  async requestPermission() {
    if (typeof DeviceMotionEvent === 'undefined') {
      return 'unsupported';
    }
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      return await DeviceMotionEvent.requestPermission();
    }
    return 'granted';
  },

  /* LISTENING */
  start() {
    if (Sensors.active) {
      return;
    }
    window.addEventListener('devicemotion', Sensors.handleMotion);
    Sensors.active = true;
  },

  handleMotion(event) {
    const a = event.accelerationIncludingGravity;
    if (!a || a.x === null) {
      return;
    }
    const sign = Sensors.invert ? -1 : 1;
    Sensors.samples.push({
      time: performance.now(),
      x: a.x * sign,
      y: a.y * sign,
      z: a.z * sign,
    });
    Sensors.dropOldSamples();
  },

  dropOldSamples() {
    const limit = performance.now() - CONFIG.bufferMs;
    while (Sensors.samples.length > 0 && Sensors.samples[0].time < limit) {
      Sensors.samples.shift();
    }
  },

  /* SETTINGS */
  setInvert(value) {
    Sensors.invert = value;
    Sensors.samples = [];
  },

  /* READING */
  getAverage(windowMs) {
    const limit = performance.now() - windowMs;
    const recent = Sensors.samples.filter(sample => sample.time >= limit);
    if (recent.length < CONFIG.minSamples) {
      return null;
    }
    return {
      x: Sensors.meanOf(recent, 'x'),
      y: Sensors.meanOf(recent, 'y'),
      z: Sensors.meanOf(recent, 'z'),
    };
  },

  meanOf(list, key) {
    const total = list.reduce((sum, item) => sum + item[key], 0);
    return total / list.length;
  },
};
