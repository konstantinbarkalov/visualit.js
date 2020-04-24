class VisualitCanvas {
  constructor (canvasContainerDom, canvasDom) {
    this.canvasContainerDom = canvasContainerDom;
    this.canvasDom = canvasDom;
    this.ctx = this.canvasDom.getContext('2d');
    this.offscreenCanvasDom = new OffscreenCanvas(0, 0);
    this.offscreenCtx = this.offscreenCanvasDom.getContext('2d');
    this.fillColorName = null; // via this.basic.setColor
    this.plotColorName = null; // via this.basic.setColor
    this.alpha = null; // via this.basic.setAlpha
    this.lineWidth = null; // via this.basic.setLineWidth
    window.addEventListener('resize', () => {
      this.onResize();
    });
    this.basic.setColor(0, 0, 255);
    this.basic.setAlpha(1);
    this.basic.setLineWidth(1);
    this.onResize(); // this.initStyle(); inside
  }
  onResize() {
    this.w = this.canvasContainerDom.clientWidth;
    this.h = this.canvasContainerDom.clientHeight;
    this.canvasDom.width = this.w;
    this.canvasDom.height = this.h;
    this.offscreenCanvasDom.width = this.w;
    this.offscreenCanvasDom.height = this.h;
    this.initStyle();
  }
  initStyle() {
    this.ctx.strokeStyle = this.plotColorName;
    this.ctx.fillStyle = this.fillColorName;
    this.ctx.globalAlpha = this.alpha;
    this.ctx.lineWidth = this.lineWidth;
  }
  updateFillColor(colorName) {
    if (this.fillColorName !== colorName) {
      this.fillColorName = colorName;
      this.ctx.fillStyle = this.fillColorName;
    }
  }
  updatePlotColor(colorName) {
    if (this.plotColorName !== colorName) {
      this.plotColorName = colorName;
      this.ctx.strokeStyle = this.plotColorName;
    }
  }
  updateAlpha(alpha) {
    if (this.alpha !== alpha) {
      this.alpha = alpha;
      this.ctx.globalAlpha = alpha;
    }
  }
  updateLineWidth(lineWidth) {
    if (this.lineWidth !== lineWidth) {
      this.lineWidth = lineWidth;
      this.ctx.lineWidth = lineWidth;
    }
  }
  clampChannel(c) {
    return Math.floor(Math.max(0, Math.min(255, c)));
  }
  clampAlpha(a) {
    return Math.max(0, Math.min(1, a));
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
    plotDot: (x, y) => {
      this.basic.plotLine(x - 0.5, y - 0.5, x + 0.5, y + 0.5);
    },
    print: (x, y, text) => {
      this.ctx.fillText(text, x, y);
    },
    cls: (amount = 1) => {
      if (amount < 1) {
        this.offscreenCtx.drawImage(this.canvasDom, 0, 0);
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.globalAlpha = 1 - amount;
        this.ctx.drawImage(this.offscreenCanvasDom, 0, 0);
        this.ctx.globalAlpha = this.alpha;
      } else {
        this.ctx.clearRect(0, 0, this.w, this.h);
      }
    },
    setColor: (r, g, b) => {
      const colorName = `rgb(${this.clampChannel(r)}, ${this.clampChannel(g)}, ${this.clampChannel(b)})`;
      this.updateFillColor(colorName);
      this.updatePlotColor(colorName);
    },
    setFillColor: (r, g, b) => {
      const colorName = `rgb(${this.clampChannel(r)}, ${this.clampChannel(g)}, ${this.clampChannel(b)})`;
      this.updateFillColor(colorName);
    },
    setPlotColor: (r, g, b) => {
      const colorName = `rgb(${this.clampChannel(r)}, ${this.clampChannel(g)}, ${this.clampChannel(b)})`;
      this.updatePlotColor(colorName);
    },
    setAlpha: (alpha) => {
      alpha = this.clampAlpha(alpha);
      this.updateAlpha(alpha);
    },
    setLineWidth: (lineWidth) => {
      this.updateLineWidth(lineWidth);
    },
    fillRect: (xFrom, yFrom, xTo, yTo) => {
      this.ctx.fillRect(xFrom, yFrom, xTo - xFrom, yTo - yFrom);
    },
    fillCircle: (x, y, radius) => {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    },
    plotPolyline: (coords, isLoop = false) => {
      this.ctx.beginPath();
      const firstCoord = coords[0];
      const lastCoord = coords[coords.length - 1];
      this.ctx.moveTo(firstCoord.x, firstCoord.y);
      coords.forEach((coord)=>{
        this.ctx.lineTo(coord.x, coord.y);
      });
      if (isLoop) {
        this.ctx.lineTo(lastCoord.x, lastCoord.y);
      }
      this.ctx.stroke();
    },
    fillPolygon: (coords) => {
      this.ctx.beginPath();
      const firstCoord = coords[0];
      const lastCoord = coords[coords.length - 1];
      this.ctx.moveTo(firstCoord.x, firstCoord.y);
      coords.forEach((coord)=>{
        this.ctx.lineTo(coord.x, coord.y);
      });
      this.ctx.lineTo(lastCoord.x, lastCoord.y);
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
