/* TEXTS */
const TEXTS = {

  /* SENSORS */
  pressEnable: 'Activá los sensores para empezar.',
  waitingForSensors: 'Esperando datos de los sensores…',
  sensorsActive: 'Sensores activos.',
  permissionDenied: 'No diste permiso para usar los sensores.',
  noSensorSupport: 'Este navegador no tiene sensores de movimiento.',

  /* LEVEL */
  statusLabels: {
    good: 'Nivelado',
    close: 'Cerca',
    far: 'Lejos',
    waiting: '—',
  },
  levelDone: '¡Listo, está nivelado!',

  axisLabels: {
    flat: { x: 'Izquierda–derecha', y: 'Adelante–atrás' },
    upright: { x: 'Giro en el plano', y: 'Inclinación' },
  },

  guidance: {
    flat: {
      xPositive: 'Bajá el borde derecho',
      xNegative: 'Bajá el borde izquierdo',
      yPositive: 'Bajá el borde de arriba',
      yNegative: 'Bajá el borde de abajo',
    },
    upright: {
      xPositive: 'Girá el celular en sentido horario',
      xNegative: 'Girá el celular en sentido antihorario',
      yPositive: 'Inclinalo hacia vos',
      yNegative: 'Inclinalo hacia atrás',
    },
  },

  /* REFERENCE */
  referenceNone: 'Sin referencia. Los valores son respecto de la gravedad.',
  referenceSet: 'Referencia: ',

  /* CALIBRATION */
  calibration: {
    intro: 'Medí el desvío propio del celular con dos posiciones, una girada 180° respecto de la otra.',
    start: 'Calibrar celular',
    step1Instruction: 'Apoyá el celular sobre la superficie y no la toques.',
    step1Button: 'Medir posición 1',
    step2Instruction: 'Girá el celular 180° en el mismo lugar y apoyalo de nuevo.',
    step2Button: 'Medir posición 2',
    measuring: 'Midiendo… no lo muevas.',
    notEnoughData: 'Faltan datos de los sensores. Probá de nuevo.',
    done: 'Calibración lista.',
    offsetLabel: 'Desvío del celular: ',
    surfaceLabel: 'Inclinación de la superficie: ',
  },
};
