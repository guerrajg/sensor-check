/* LEVEL */
const Level = {

  /* ELEMENTS */
  panel: document.getElementById('levelPanel'),
  dot: document.getElementById('levelDot'),
  target: document.getElementById('levelTarget'),
  statusLabel: document.getElementById('statusLabel'),
  guidance: document.getElementById('guidance'),
  axisXLabel: document.getElementById('axisXLabel'),
  axisXValue: document.getElementById('axisXValue'),
  axisYLabel: document.getElementById('axisYLabel'),
  axisYValue: document.getElementById('axisYValue'),

  /* HELPERS */
  clamp(value) {
    return Math.max(-1, Math.min(1, value));
  },

  /* DRAWING */
  setAxisLabels(labels) {
    Level.axisXLabel.textContent = labels.x;
    Level.axisYLabel.textContent = labels.y;
  },

  setTarget(zoomRange) {
    const fraction = Math.min(CONFIG.goodDeg / zoomRange, 1);
    Level.target.setAttribute('r', fraction * CONFIG.ringRadius);
  },

  update(tilt, zoomRange, status, guidanceText) {
    Level.dot.setAttribute('cx', Level.clamp(tilt.x / zoomRange) * CONFIG.ringRadius);
    Level.dot.setAttribute('cy', -Level.clamp(tilt.y / zoomRange) * CONFIG.ringRadius);
    Level.setTarget(zoomRange);

    Level.panel.dataset.status = status;
    Level.statusLabel.textContent = TEXTS.statusLabels[status];
    Level.guidance.textContent = guidanceText;
    Level.axisXValue.textContent = Tilt.format(tilt.x);
    Level.axisYValue.textContent = Tilt.format(tilt.y);
  },

  showWaiting(text) {
    Level.dot.setAttribute('cx', 0);
    Level.dot.setAttribute('cy', 0);

    Level.panel.dataset.status = 'waiting';
    Level.statusLabel.textContent = TEXTS.statusLabels.waiting;
    Level.guidance.textContent = text;
    Level.axisXValue.textContent = '—';
    Level.axisYValue.textContent = '—';
  },
};
