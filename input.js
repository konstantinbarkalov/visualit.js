class VisualitInput {
  constructor (containerDom) {
    this.containerDom = containerDom;
    window.addEventListener('resize', () => {
      this.onResize();
    });
    this.containerDom.addEventListener('mousemove', (e) => {
      this.onMouseMove(e.offsetX, e.offsetY);
    });
    document.addEventListener('onkeydown', (e) => {
      if (e.code === 32) {
        this.onPrimaryKeyChange(true);
      }
    });
    document.addEventListener('onkeyup', (e) => {
      if (e.code === 32) {
        this.onPrimaryKeyChange(false);
      }
    });
    this.onResize();
    this.onMouseMove(0, 0);
    this.onPrimaryKeyChange(false);
  }
  basic = {
    w: 0,
    h: 0,
    x: 0,
    y: 0,
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