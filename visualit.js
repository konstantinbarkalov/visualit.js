class VisualitCanvas {
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
  }
}

class VisualitCanvasPie {
  constructor (canvasContainerDom, canvasDom) {
    this.canvasContainerDom = canvasContainerDom;
    this.canvasDom = canvasDom;
    this.canvas = Object.fromEntries(Object.entries(this.canvasDom).map(([canvasDomKey, canvasDomValue]) => {
      return [canvasDomKey, new VisualitCanvas(this.canvasContainerDom, canvasDomValue)];
    }));
    this.basic = Object.fromEntries(Object.entries(this.canvas).map(([canvasKey, canvasValue]) => {
      return [canvasKey, canvasValue.basic];
    }));
  }
  basic = {
  }
}

class Visualit {
  constructor (canvasContainerDom, canvasDom) {
    this.canvasPie = new VisualitCanvasPie(canvasContainerDom, canvasDom);
    this.input = new VisualitInput(canvasContainerDom);
    this.basic.pie = this.canvasPie.basic;
    this.basic.input = this.input.basic;
  }
  basic = {
    pause: async (msec) => {
      await new Promise((resolve) => {
        setTimeout(resolve, msec);
      })
    }
  }
}
const canvasContainerDom = document.getElementById('output-canvas-container');
const canvasDom = {
  bottom: document.getElementById('output-canvas-bottom'),
  main: document.getElementById('output-canvas-main'),
  extra: document.getElementById('output-canvas-extra'),
  top: document.getElementById('output-canvas-top'),
}
const visualit = new Visualit(canvasContainerDom, canvasDom);
const basic = visualit.basic;
