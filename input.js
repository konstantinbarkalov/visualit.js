class Input {
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
        this.onKeyChange(true);
      }
    });
    document.addEventListener('onkeyup', (e) => {
      if (e.code === 32) {
        this.onKeyChange(false);
      }
    });
    this.onResize();
    this.onMouseMove(0, 0);
    this.onKeyChange(false);
  }

  onResize() {
    this.w = this.containerDom.clientWidth;
    this.h = this.containerDom.clientHeight;
    this.updateRatios();
  }
  onMouseMove(x, y) {
    this.x = x;
    this.y = y;
    this.updateRatios();
  }
  onKeyChange(isPressed) {
    this.isPressed = isPressed;
    if (this.onKeyChangeChallback) {
      this.onKeyChangeChallback();
    }
  }
  updateRatios() {
    this.xRatio = this.x / this.w;
    this.yRatio = this.y / this.h;
  }
}

const containerDom = document.getElementById('output-canvas-container');
const input = new Input(containerDom);
