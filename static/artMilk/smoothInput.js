class SmoothInput {
  decayPerSec = 0.9;
  scrollBound = 1500;
  xRatio = 0.5;
  yRatio = 0.5;
  leftRightButtonRatio = 0.5;
  upDownButtonRatio = 0.5;
  scrollAltShiftRatio = 0.5;
  scrollAltRatio = 0.5;
  scrollShiftRatio = 0.5;
  scrollRatio = 0.5;
  constructor(decayPerSec = this.decayPerSec) {
    this.decayPerSec = decayPerSec;
  }
  phisicIteration(dt) {
    const remainsPerSec = 1 - this.decayPerSec;
    const remainsFactor = Math.pow(remainsPerSec, dt);
    const decayFactor = 1 - remainsFactor;
    this.xRatio = this.xRatio * remainsFactor + basic.input.xRatio * decayFactor;
    this.yRatio = this.yRatio * remainsFactor + basic.input.yRatio * decayFactor;

    const momentLeftRightButtonBRatio = (basic.input.isLeftPressed ? -1 : 0) +
                                       (basic.input.isRightPressed ? 1 : 0);
    const momentLeftRightButtonRatio = momentLeftRightButtonBRatio / 2 + 0.5;
    this.leftRightButtonRatio = this.leftRightButtonRatio * remainsFactor + momentLeftRightButtonRatio * decayFactor;

    const momentUpDownButtonBRatio = (basic.input.isUpPressed ? -1 : 0) +
                                     (basic.input.isDownPressed ? 1 : 0);
    const momentUpDownButtonRatio = momentUpDownButtonBRatio / 2 + 0.5;
    this.upDownButtonRatio = this.upDownButtonRatio * remainsFactor + momentUpDownButtonRatio * decayFactor;

    const scrollAltShiftBounded = Math.min(this.scrollBound, Math.max(-this.scrollBound, basic.input.scrollAltShift));
    basic.input.scrollAltShift = scrollAltShiftBounded; //send back
    const currentAltShiftScrollRatio = scrollAltShiftBounded / this.scrollBound / 2 + 0.5;
    this.scrollAltShiftRatio = this.scrollAltShiftRatio * remainsFactor + currentAltShiftScrollRatio * decayFactor;
    const scrollAltBounded = Math.min(this.scrollBound, Math.max(-this.scrollBound, basic.input.scrollAlt));
    basic.input.scrollAlt = scrollAltBounded; //send back
    const currentAltScrollRatio = scrollAltBounded / this.scrollBound / 2 + 0.5;
    this.scrollAltRatio = this.scrollAltRatio * remainsFactor + currentAltScrollRatio * decayFactor;
    const scrollShiftBounded = Math.min(this.scrollBound, Math.max(-this.scrollBound, basic.input.scrollShift));
    basic.input.scrollShift = scrollShiftBounded; //send back
    const currentShiftScrollRatio = scrollShiftBounded / this.scrollBound / 2 + 0.5;
    this.scrollShiftRatio = this.scrollShiftRatio * remainsFactor + currentShiftScrollRatio * decayFactor;
    const scrollBounded = Math.min(this.scrollBound, Math.max(-this.scrollBound, basic.input.scroll));
    basic.input.scroll = scrollBounded; //send back
    const currentScrollRatio = scrollBounded / this.scrollBound / 2 + 0.5;
    this.scrollRatio = this.scrollRatio * remainsFactor + currentScrollRatio * decayFactor;
  }
}
