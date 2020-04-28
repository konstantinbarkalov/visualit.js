class Star {
  constructor(pos = new Point3D(), intense = Math.random()) {
    this.pos = pos;
    this.style.intense = intense;
  }
  style = {
    color: {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    },
    intense: Math.random(),
    entropy: {
      blink: {
        phaseShift: Math.random(),
        freq: Math.random() * 1,
      },
      burnWave: {
        amount: Math.random(),
        phaseShift: (Math.random() - 0.5) / 4,
      }
    }
  };
}


class StarPool {
  stars = [];
  iteration(t, dt) {
    // this.stars.forEach((star) => {
    //   star.iteration(t, dt);
    // });
    // this.stars = this.stars.filter((star) => {
    //   return star.ttl > 0;
    // });
  }
  add(pos, intense) {
    const star = new Star(pos, intense);
    this.stars.push(star);
    return star;
  }
  addRandom() {
    const pos = new Point3D(Math.random() * fieldWidth, Math.random() * fieldHeight, (Math.random() - 0.5) * fieldDepth);
    const intense = Math.random();
    return this.add(pos, intense);
  }
  addRandomAtPos(pos) {
    const intense = Math.random();
    return this.add(pos, intense);
  }
  draw(t, dt) {
    this.stars.forEach((star) => {
      const timeshiftedPoint = timeshift(star.pos, t);
      const blinkRatio = sampleBlinkRatio(t, star.style.entropy.blink.freq, star.style.entropy.blink.phaseShift);
      let burnWaveRatio = sampleBurnWaveRatio(t, timeshiftedPoint.coords.x, timeshiftedPoint.coords.y, star.style.entropy.burnWave.phaseShift, 50);
      burnWaveRatio *= star.style.entropy.burnWave.amount;

      const screenPoint = camera.mapToScreen(timeshiftedPoint);

      //let intense = 0.4 * star.style.intense + blinkRatio * 0.4 + Math.random() * 0.2;
      let intense =
        + 0.5 * star.style.intense
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
        basic.pie.main.setFillColor(star.style.color.r * factor, star.style.color.g * factor, star.style.color.b * factor);
        fillStarShape(screenPoint.coords.x, screenPoint.coords.y, exSize / factor, plusSize / factor);
      }
    });
  }
}

