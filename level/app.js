/* STATE */
const State = {
  orientation: 'flat',
  zoomIndex: CONFIG.defaultZoomIndex,
  calibrationStep: 'idle',
  firstReading: null,
  calibratedTilt: { x: 0, y: 0 },
};


/* ELEMENTS */
const enableButton = document.getElementById('enableButton');
const sensorMessage = document.getElementById('sensorMessage');
const orientationSelect = document.getElementById('orientationSelect');
const invertCheckbox = document.getElementById('invertCheckbox');
const zoomButtons = document.getElementById('zoomButtons');
const referenceSetButton = document.getElementById('referenceSetButton');
const referenceClearButton = document.getElementById('referenceClearButton');
const referenceInfo = document.getElementById('referenceInfo');
const calibrationMessage = document.getElementById('calibrationMessage');
const calibrationButton = document.getElementById('calibrationButton');
const calibrationInfo = document.getElementById('calibrationInfo');


/* DISPLAY */
function refreshAxisLabels() {
  Level.setAxisLabels(TEXTS.axisLabels[State.orientation]);
}

function showReference() {
  if (!Reference.isSet) {
    referenceInfo.textContent = TEXTS.referenceNone;
    return;
  }
  referenceInfo.textContent = TEXTS.referenceSet
    + Tilt.format(Reference.value.x) + ' / ' + Tilt.format(Reference.value.y);
}

function showCalibrationOffset() {
  const offset = Calibration.getOffset(State.orientation);
  calibrationInfo.textContent = TEXTS.calibration.offsetLabel
    + Tilt.format(offset.x) + ' / ' + Tilt.format(offset.y);
}

function resetCalibrationFlow() {
  State.calibrationStep = 'idle';
  State.firstReading = null;
  calibrationMessage.textContent = TEXTS.calibration.intro;
  calibrationButton.textContent = TEXTS.calibration.start;
  calibrationButton.disabled = !Sensors.active;
}


/* ZOOM */
function buildZoomButtons() {
  CONFIG.zoomLevels.forEach((range, index) => {
    const button = document.createElement('button');
    button.className = 'button';
    button.textContent = '±' + range + '°';
    button.addEventListener('click', () => selectZoom(index));
    zoomButtons.appendChild(button);
  });
}

function selectZoom(index) {
  State.zoomIndex = index;
  Level.setTarget(CONFIG.zoomLevels[index]);
  Array.from(zoomButtons.children).forEach((button, buttonIndex) => {
    button.classList.toggle('is-active', buttonIndex === index);
  });
}


/* SENSORS */
async function enableSensors() {
  const answer = await Sensors.requestPermission();

  if (answer === 'unsupported') {
    sensorMessage.textContent = TEXTS.noSensorSupport;
    return;
  }
  if (answer !== 'granted') {
    sensorMessage.textContent = TEXTS.permissionDenied;
    return;
  }

  Sensors.start();
  enableButton.hidden = true;
  sensorMessage.textContent = TEXTS.sensorsActive;
  referenceSetButton.disabled = false;
  calibrationButton.disabled = false;
}


/* CALIBRATION */
async function handleCalibrationClick() {
  if (State.calibrationStep === 'idle') {
    State.calibrationStep = 'first';
    calibrationMessage.textContent = TEXTS.calibration.step1Instruction;
    calibrationButton.textContent = TEXTS.calibration.step1Button;
    return;
  }

  const stepAtStart = State.calibrationStep;
  calibrationButton.disabled = true;
  calibrationMessage.textContent = TEXTS.calibration.measuring;

  const reading = await Calibration.captureTilt(State.orientation);
  calibrationButton.disabled = false;

  if (State.calibrationStep !== stepAtStart) {
    return;
  }

  if (!reading) {
    resetCalibrationFlow();
    calibrationMessage.textContent = TEXTS.calibration.notEnoughData;
    return;
  }

  if (stepAtStart === 'first') {
    State.firstReading = reading;
    State.calibrationStep = 'second';
    calibrationMessage.textContent = TEXTS.calibration.step2Instruction;
    calibrationButton.textContent = TEXTS.calibration.step2Button;
    return;
  }

  const result = Calibration.finish(State.firstReading, reading, State.orientation);
  resetCalibrationFlow();
  calibrationMessage.textContent = TEXTS.calibration.done + ' '
    + TEXTS.calibration.surfaceLabel
    + Tilt.format(result.surface.x) + ' / ' + Tilt.format(result.surface.y);
  showCalibrationOffset();
}


/* MAIN LOOP */
function tick() {
  const average = Sensors.getAverage(CONFIG.smoothingMs);

  if (!average) {
    Level.showWaiting(Sensors.active ? TEXTS.waitingForSensors : TEXTS.pressEnable);
    return;
  }

  const rawTilt = Tilt.fromAcceleration(average, State.orientation);
  State.calibratedTilt = Tilt.subtract(rawTilt, Calibration.getOffset(State.orientation));
  const shownTilt = Tilt.subtract(State.calibratedTilt, Reference.value);

  const status = Tilt.statusFor(Tilt.distance(shownTilt));
  const guidanceText = status === 'good'
    ? TEXTS.levelDone
    : TEXTS.guidance[State.orientation][Tilt.guidanceKey(shownTilt)];

  Level.update(shownTilt, CONFIG.zoomLevels[State.zoomIndex], status, guidanceText);
}


/* EVENTS */
enableButton.addEventListener('click', enableSensors);

orientationSelect.addEventListener('change', () => {
  State.orientation = orientationSelect.value;
  Reference.clear();
  resetCalibrationFlow();
  refreshAxisLabels();
  showReference();
  showCalibrationOffset();
});

invertCheckbox.addEventListener('change', () => {
  Sensors.setInvert(invertCheckbox.checked);
  Calibration.clear();
  Reference.clear();
  resetCalibrationFlow();
  showReference();
  showCalibrationOffset();
});

referenceSetButton.addEventListener('click', () => {
  Reference.set(State.calibratedTilt);
  showReference();
});

referenceClearButton.addEventListener('click', () => {
  Reference.clear();
  showReference();
});

calibrationButton.addEventListener('click', handleCalibrationClick);


/* START */
Sensors.setInvert(Calibration.load());
invertCheckbox.checked = Sensors.invert;

buildZoomButtons();
selectZoom(State.zoomIndex);
refreshAxisLabels();
showReference();
showCalibrationOffset();
resetCalibrationFlow();

setInterval(tick, CONFIG.refreshMs);
