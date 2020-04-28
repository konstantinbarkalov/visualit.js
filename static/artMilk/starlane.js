class Starlane {
  steps = [];
  constructor() {
  }
  style = {
    color: {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    },
  };
  addStep(pos) {
    this.steps.push(pos);
  }
}


class StarlanePool {
  starlanes = [];
  iteration(t, dt) {
    // this.starlanes.forEach((starlane) => {
    //   starlane.iteration(t, dt);
    // });
    // this.starlanes = this.starlanes.filter((starlane) => {
    //   return starlane.ttl > 0;
    // });
  }
  add() {
    const starlane = new Starlane();
    this.starlanes.push();
    return starlane;
  }
  draw(t, dt) {
    this.starlanes.forEach((starlane) => {
      const timeshiftedPoint = timeshift(starlane.pos, t);
      const blinkRatio = sampleBlinkRatio(t, starlane.style.entropy.blink.freq, starlane.style.entropy.blink.phaseShift);
      let burnWaveRatio = sampleBurnWaveRatio(t, timeshiftedPoint.coords.x, timeshiftedPoint.coords.y, starlane.style.entropy.burnWave.phaseShift, 50);
      burnWaveRatio *= starlane.style.entropy.burnWave.amount;

      const screenPoint = camera.mapToScreen(timeshiftedPoint);

      //let intense = 0.4 * starlane.style.intense + blinkRatio * 0.4 + Math.random() * 0.2;
      let intense =
        + 0.5 * starlane.style.intense
        + 0.5 * blinkRatio
        + 2 * burnWaveRatio;
      const tweakedIntense1 = Math.pow(intense, 1/2);
      const tweakedIntense2 = Math.pow(intense, 2);
      const exSize = tweakedIntense2 * 4 * screenPoint.zScale;
      const plusSize = tweakedIntense1 * 1 * screenPoint.zScale;
      const alpha = tweakedIntense1 * 1;
      basic.pie.main.setAlpha(alpha);
      for (let layerId = 0; layerId < intense; layerId++) {
        const factor = layerId + 1;
        basic.pie.main.setFillColor(starlane.style.color.r * factor, starlane.style.color.g * factor, starlane.style.color.b * factor);
        fillStarlaneShape(screenPoint.coords.x, screenPoint.coords.y, exSize / factor, plusSize / factor);
      }
    });
  }
}

