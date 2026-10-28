/* CALIBRATION */
function createEmptyOffsets() {
  return {
    flat: { x: 0, y: 0 },
    upright: { x: 0, y: 0 },
  };
}

const Calibration = {
  offsets: createEmptyOffsets(),

  /* READING */
  getOffset(orientation) {
    return Calibration.offsets[orientation];
  },

  async captureTilt(orientation) {
    await new Promise(resolve => setTimeout(resolve, CONFIG.settleMs + CONFIG.captureMs));

    const average = Sensors.getAverage(CONFIG.captureMs);
    if (!average) {
      return null;
    }
    return Tilt.fromAcceleration(average, orientation);
  },

  /* RESULT */
  finish(first, second, orientation) {
    const offset = {
      x: (first.x + second.x) / 2,
      y: (first.y + second.y) / 2,
    };
    const surface = {
      x: (first.x - second.x) / 2,
      y: (first.y - second.y) / 2,
    };

    Calibration.offsets[orientation] = offset;
    Calibration.save();
    return { offset, surface };
  },

  clear() {
    Calibration.offsets = createEmptyOffsets();
    Calibration.save();
  },

  /* STORAGE */
  save() {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify({
        offsets: Calibration.offsets,
        invert: Sensors.invert,
      }));
    } catch (error) {
    }
  },

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(CONFIG.storageKey));
      if (saved) {
        Calibration.offsets = saved.offsets;
        return saved.invert;
      }
    } catch (error) {
    }
    return false;
  },
};
