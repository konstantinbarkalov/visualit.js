class Visualit {
  constructor (canvasContainerDom, canvasDom) {
    this.canvasContainerDom = canvasContainerDom;
    this.canvasDom = canvasDom;
    this.ctx = this.canvasDom.getContext('2d');
    window.addEventListener('resize', () => {
      this.onResize();
    });
    this.basic.setColor(0, 0, 255);
    this.basic.setAlpha(1);
    this.basic.setLineWidth(1);
    this.onResize();
  }
  onResize() {
    this.w = this.canvasContainerDom.clientWidth;
    this.h = this.canvasContainerDom.clientHeight;
    this.canvasDom.width = this.w;
    this.canvasDom.height = this.h;
    this.updateStyle();
  }
  updateStyle() {
    this.ctx.strokeStyle = this.colorName;
    this.ctx.fillStyle = this.colorName;
    this.ctx.globalAlpha = this.opacity;
    this.ctx.lineWidth = this.lineWidth;
  }
  clampChannel(c) {
    return Math.max(0, Math.min(255, c));
  }
  basic = {
    plotLine: (xFrom, yFrom, xTo, yTo) => {
      this.ctx.beginPath();
      this.ctx.moveTo(xFrom, yFrom);
      this.ctx.lineTo(xTo, yTo);
      this.ctx.stroke();
    },
    plotRect: (xFrom, yFrom, xTo, yTo) => {
      this.ctx.strokeRect(xFrom, yFrom, xTo - xFrom, yTo - yFrom);
    },
    plotCircle: (x, y, radius) => {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.stroke();
    },
    plotPixel: (x, y) => {
      this.basic.plotLine(x, y, x, y);
    },
    print: (x, y, text) => {
      this.ctx.fillText(text, x, y);
    },
    cls: () => {
      this.ctx.clearRect(0, 0, this.w, this.h);
    },
    setColor: (r, g, b) => {
      this.colorName = `rgb(${this.clampChannel(r)}, ${this.clampChannel(g)}, ${this.clampChannel(b)})`;
      this.updateStyle();
    },
    setAlpha: (opacity) => {
      this.opacity = opacity;
      this.updateStyle();
    },
    setLineWidth: (lineWidth) => {
      this.lineWidth = lineWidth;
      this.updateStyle();
    },
    fillRect: (xFrom, yFrom, xTo, yTo) => {
      this.ctx.fillRect(xFrom, yFrom, xTo - xFrom, yTo - yFrom);
    },
    fillCircle: (x, y, radius) => {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    },
    pause: async (msec) => {
      await new Promise((resolve) => {
        setTimeout(resolve, msec);
      })
    }
  }
}

const canvasContainerDom = document.getElementById('output-canvas-container');
const canvasBottomDom = document.getElementById('output-canvas-bottom');
const canvasMainDom = document.getElementById('output-canvas-main');
const canvasTopDom = document.getElementById('output-canvas-top');
const visualitBottom = new Visualit(canvasContainerDom, canvasBottomDom);
const visualitMain = new Visualit(canvasContainerDom, canvasMainDom);
const visualitTop = new Visualit(canvasContainerDom, canvasTopDom);
const basicBottom = visualitBottom.basic;
const basic = visualitMain.basic;
const basicTop = visualitTop.basic;