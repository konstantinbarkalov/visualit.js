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
      if (e.which === 32) {
        e.preventDefault();
        this.onPrimaryKeyChange(true);
      }
    });
    document.addEventListener('keyup', (e) => {
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
    xRatio: 0,
    yRatio: 0,
    isPrimaryPressed: false,
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
    this.basic.scroll += delta;
  }
  onMouseScrollReset() {
    this.basic.scroll = 0;
  }
  onPrimaryKeyChange(isPressed) {
    this.basic.isPrimaryPressed = isPressed;

    if (this.onPrimaryKeyChangeChallback) {
      this.onPrimaryKeyChangeChallback();
    }
  }
  updateRatios() {
    this.basic.xRatio = this.basic.x / this.basic.w;
    this.basic.yRatio = this.basic.y / this.basic.h;
  }
}