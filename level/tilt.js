/* TILT */
const Tilt = {

  /* CONVERSION */
  toDegrees(radians) {
    return radians * 180 / Math.PI;
  },

  fromAcceleration(a, orientation) {
    if (orientation === 'upright') {
      return Tilt.fromUpright(a);
    }
    return Tilt.fromFlat(a);
  },

  fromFlat(a) {
    return {
      x: Tilt.toDegrees(Math.atan2(a.x, Math.hypot(a.y, a.z))),
      y: Tilt.toDegrees(Math.atan2(a.y, Math.hypot(a.x, a.z))),
    };
  },

  fromUpright(a) {
    return {
      x: Tilt.toDegrees(Math.atan2(a.x, Math.hypot(a.y, a.z))),
      y: Tilt.toDegrees(Math.atan2(a.z, Math.hypot(a.x, a.y))),
    };
  },

  /* ARITHMETIC */
  subtract(a, b) {
    return { x: a.x - b.x, y: a.y - b.y };
  },

  distance(tilt) {
    return Math.hypot(tilt.x, tilt.y);
  },

  /* STATUS */
  statusFor(distance) {
    if (distance <= CONFIG.goodDeg) {
      return 'good';
    }
    if (distance <= CONFIG.closeDeg) {
      return 'close';
    }
    return 'far';
  },

  guidanceKey(tilt) {
    if (Math.abs(tilt.x) >= Math.abs(tilt.y)) {
      return tilt.x >= 0 ? 'xPositive' : 'xNegative';
    }
    return tilt.y >= 0 ? 'yPositive' : 'yNegative';
  },

  /* DISPLAY */
  format(value) {
    const sign = value >= 0 ? '+' : '−';
    return sign + Math.abs(value).toFixed(CONFIG.decimals) + '°';
  },
};
