class VisualitInput {
  constructor (containerDom) {
    this.containerDom = containerDom;
    window.addEventListener('resize', () => {
      this.onResize();
    });
    this.containerDom.addEventListener('mousemove', (e) => {
      this.onMouseMove(e.offsetX, e.offsetY);
    });
    this.containerDom.addEventListener('mousewheel', (e) => {
      this.onMouseScroll(e.wheelDelta);
    });
    document.addEventListener('keydown', (e) => {
      if (e.which >= 16 && e.which <= 18) {
        e.preventDefault();
        this.onModificatorKeyChange(e.shiftKey, e.altKey, e.ctrlKey);
      }
      if (e.which === 32) {
        e.preventDefault();
        this.onPrimaryKeyChange(true);
      }
    });
    document.addEventListener('keyup', (e) => {
      if (e.which >= 16 && e.which <= 18) {
        this.onModificatorKeyChange(e.shiftKey, e.altKey, e.ctrlKey);
      }
      if (e.which === 32) {
        this.onPrimaryKeyChange(false);
      }
    });
    document.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.onPrimaryKeyChange(true);

    });
    document.addEventListener('mouseup', (e) => {
      this.onPrimaryKeyChange(false);

    });
    this.onResize();
    this.onMouseMove(this.basic.w / 2, this.basic.h / 2);
    this.onMouseScrollReset();
    this.onPrimaryKeyChange(false);
  }
  basic = {
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    scroll: 0,
    scrollAlt: 0,
    scrollShift: 0,
    scrollAltShift: 0,
    xRatio: 0,
    yRatio: 0,
    isPrimaryPressed: false,
    isShiftPressed: false,
    isAltPressed: false,
    isCtrlPressed: false,
  }
  onResize() {
    this.basic.w = this.containerDom.clientWidth;
    this.basic.h = this.containerDom.clientHeight;
    this.updateRatios();
  }
  onMouseMove(x, y) {
    this.basic.x = x;
    this.basic.y = y;
    this.updateRatios();
  }
  onMouseScroll(delta) {
    if (this.basic.isAltPressed && this.basic.isShiftPressed) {
      this.basic.scrollAltShift += delta;
    } else if (this.basic.isAltPressed) {
      this.basic.scrollAlt += delta;
    } else if (this.basic.isShiftPressed) {
      this.basic.scrollShift += delta;
    } else {
      this.basic.scroll += delta;
    }
  }
  onMouseScrollReset() {
    this.basic.scrollAltShift = 0;
    this.basic.scrollAlt = 0;
    this.basic.scrollShift = 0;
    this.basic.scroll = 0;
  }
  onPrimaryKeyChange(isPressed) {
    this.basic.isPrimaryPressed = isPressed;

    if (this.onPrimaryKeyChangeChallback) {
      this.onPrimaryKeyChangeChallback();
    }
  }
  onModificatorKeyChange(isShiftPressed, isAltPressed, isCtrlPressed) {
    this.basic.isShiftPressed = isShiftPressed;
    this.basic.isAltPressed = isAltPressed;
    this.basic.isCtrlPressed = isCtrlPressed;
    if (this.onModificatorKeyChangeChallback) {
      this.onModificatorKeyChangeChallback();
    }
  }
  updateRatios() {
    this.basic.xRatio = this.basic.x / this.basic.w;
    this.basic.yRatio = this.basic.y / this.basic.h;
  }
}