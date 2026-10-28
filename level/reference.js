/* REFERENCE */
const Reference = {
  value: { x: 0, y: 0 },
  isSet: false,

  set(tilt) {
    Reference.value = { x: tilt.x, y: tilt.y };
    Reference.isSet = true;
  },

  clear() {
    Reference.value = { x: 0, y: 0 };
    Reference.isSet = false;
  },
};
