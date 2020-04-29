class Starlane {
  steps = [];
  hotEndPoint = null;
  constructor() {
  }
  style = {
    color: {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    },
  };
  addStep(star) {
    this.steps.push(star);
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
    this.starlanes.push(starlane);
    return starlane;
  }
  draw(t, dt) {
    this.starlanes.forEach((starlane) => {
      basic.pie.main.setLineWidth(5);
      const intervals = splitArray(starlane.steps, 2, 1);
      intervals.forEach(interval => {
        if (interval.length === 2) {
          const fromPos = interval[0].pos;
          const toPos = interval[1].pos;

          const timeshiftedPointFrom = timeshift(fromPos, t);
          const timeshiftedPointTo = timeshift(toPos, t);
          let burnWaveRatioFrom = sampleBurnWaveRatio(t, timeshiftedPointFrom.coords.x, timeshiftedPointFrom.coords.y, 0, 4);
          let burnWaveRatioTo = sampleBurnWaveRatio(t, timeshiftedPointTo.coords.x, timeshiftedPointTo.coords.y, 0, 4);
          let burnWaveRatio = Math.max( burnWaveRatioFrom,  burnWaveRatioTo);

          const screenPointFrom = camera.mapToScreen(timeshiftedPointFrom);
          const screenPointTo = camera.mapToScreen(timeshiftedPointTo);

          //let intense = 0.4 * starlane.style.intense + blinkRatio * 0.4 + Math.random() * 0.2;
          let intense =
            + 0.5
            + 2 * burnWaveRatio;
          const alpha = intense;
          basic.pie.main.setAlpha(alpha);
          basic.pie.main.setColor(starlane.style.color.r * (1 + burnWaveRatio), starlane.style.color.g * (1 + burnWaveRatio), starlane.style.color.b * (1 + burnWaveRatio));
          basic.pie.main.plotLine(screenPointFrom.coords.x, screenPointFrom.coords.y, screenPointTo.coords.x, screenPointTo.coords.y);
        }
      });
      basic.pie.main.setLineWidth(1);
      const lastStep = starlane.steps[starlane.steps.length - 1];
      if (lastStep && starlane.hotEndPoint) {
        const fromPos = lastStep.pos;
        const toPos = starlane.hotEndPoint;

        const timeshiftedPointFrom = timeshift(fromPos, t);
        const timeshiftedPointTo = timeshift(toPos, t);
        let burnWaveRatioFrom = sampleBurnWaveRatio(t, timeshiftedPointFrom.coords.x, timeshiftedPointFrom.coords.y, 0, 4);
        let burnWaveRatioTo = sampleBurnWaveRatio(t, timeshiftedPointTo.coords.x, timeshiftedPointTo.coords.y, 0, 4);
        let burnWaveRatio = Math.max( burnWaveRatioFrom,  burnWaveRatioTo);

        const screenPointFrom = camera.mapToScreen(timeshiftedPointFrom);
        const screenPointTo = camera.mapToScreen(timeshiftedPointTo);

        //let intense = 0.4 * starlane.style.intense + blinkRatio * 0.4 + Math.random() * 0.2;
        let intense =
          + 0.75
          + 2 * burnWaveRatio;
        const alpha = intense;
        basic.pie.main.setAlpha(alpha);
        basic.pie.main.setColor(starlane.style.color.r * (1 + burnWaveRatio), starlane.style.color.g * (1 + burnWaveRatio), starlane.style.color.b * (1 + burnWaveRatio));
        basic.pie.main.plotLine(screenPointFrom.coords.x, screenPointFrom.coords.y, screenPointTo.coords.x, screenPointTo.coords.y);
      }

    });
  }
}

