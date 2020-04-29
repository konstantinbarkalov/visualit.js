class AbstractStarlane {
  stars = null;
  constructor(stars = []) {
    this.stars = stars;
  }
  style = {
    color: {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    },
  };
  addStar(star) {
    this.stars.push(star);
  }
}
class PlayerStarlane extends AbstractStarlane {
  hotEndPoint = null;
  drawIteration(t, dt) {
    basic.pie.main.setLineWidth(5);
    const intervals = splitArray(this.stars, 2, 1);
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

        //let intense = 0.4 * this.style.intense + blinkRatio * 0.4 + Math.random() * 0.2;
        let intense =
          + 0.5
          + 2 * burnWaveRatio;
        const alpha = intense;
        basic.pie.main.setAlpha(alpha);
        basic.pie.main.setColor(this.style.color.r * (1 + burnWaveRatio), this.style.color.g * (1 + burnWaveRatio), this.style.color.b * (1 + burnWaveRatio));
        basic.pie.main.plotLine(screenPointFrom.coords.x, screenPointFrom.coords.y, screenPointTo.coords.x, screenPointTo.coords.y);
      }
    });
    basic.pie.main.setLineWidth(1);
    const lastStar = this.stars[this.stars.length - 1];
    if (lastStar && this.hotEndPoint) {
      const fromPos = lastStar.pos;
      const toPos = this.hotEndPoint;

      const timeshiftedPointFrom = timeshift(fromPos, t);
      const timeshiftedPointTo = timeshift(toPos, t);
      let burnWaveRatioFrom = sampleBurnWaveRatio(t, timeshiftedPointFrom.coords.x, timeshiftedPointFrom.coords.y, 0, 4);
      let burnWaveRatioTo = sampleBurnWaveRatio(t, timeshiftedPointTo.coords.x, timeshiftedPointTo.coords.y, 0, 4);
      let burnWaveRatio = Math.max( burnWaveRatioFrom,  burnWaveRatioTo);

      const screenPointFrom = camera.mapToScreen(timeshiftedPointFrom);
      const screenPointTo = camera.mapToScreen(timeshiftedPointTo);

      //let intense = 0.4 * this.style.intense + blinkRatio * 0.4 + Math.random() * 0.2;
      let intense =
        + 0.75
        + 2 * burnWaveRatio;
      const alpha = intense;
      basic.pie.main.setAlpha(alpha);
      basic.pie.main.setColor(this.style.color.r * (1 + burnWaveRatio), this.style.color.g * (1 + burnWaveRatio), this.style.color.b * (1 + burnWaveRatio));
      basic.pie.main.plotLine(screenPointFrom.coords.x, screenPointFrom.coords.y, screenPointTo.coords.x, screenPointTo.coords.y);
    }
  }
}
class StaticStarlane extends AbstractStarlane {
  drawIteration(t, dt) {
    basic.pie.main.setLineWidth(1);
    const intervals = splitArray(this.stars, 2, 1);
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

        //let intense = 0.4 * this.style.intense + blinkRatio * 0.4 + Math.random() * 0.2;
        let intense =
          + 0.2
          + 1 * burnWaveRatio;
        const alpha = intense;
        basic.pie.main.setAlpha(alpha);
        basic.pie.main.setColor(this.style.color.r * (1 + burnWaveRatio), this.style.color.g * (1 + burnWaveRatio), this.style.color.b * (1 + burnWaveRatio));
        basic.pie.main.plotLine(screenPointFrom.coords.x, screenPointFrom.coords.y, screenPointTo.coords.x, screenPointTo.coords.y);
      }
    });
  }
}
class StarlanePool {
  staticStarlanes = [];
  playerStarlanes = [];
  phisicIteration(t, dt) {
    // this.starlanes.forEach((starlane) => {
    //   starlane.phisicIteration(t, dt);
    // });
    // this.starlanes = this.starlanes.filter((starlane) => {
    //   return starlane.ttl > 0;
    // });
  }
  addPlayerStarlane(starlane) {
    this.playerStarlanes.push(starlane);
    return starlane;
  }
  addStaticStarlane(starlane) {
    this.staticStarlanes.push(starlane);
    return starlane;
  }
  createPlayerStarlane() {
    const starlane = new PlayerStarlane();
    return this.addPlayerStarlane(starlane);
  }
  createStaticStarlane() {
    const starlane = new StaticStarlane();
    return this.addStaticStarlane(starlane);
  }
  drawIteration(t, dt) {
    this.playerStarlanes.forEach((playerStarlane) => {
      playerStarlane.drawIteration(t, dt);
    });
    this.staticStarlanes.forEach((staticStarlane) => {
      staticStarlane.drawIteration(t, dt);
    });
  }
}

