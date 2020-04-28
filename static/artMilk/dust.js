class Dust {
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
        // amount: Math.random(),
        phaseShift: (Math.random() - 0.5) / 4,
      }
    }
  };
}


class DustPool {
  dusts = [];
  iteration(t, dt) {
    // this.dusts.forEach((dust) => {
    //   dust.iteration(t, dt);
    // });
    // this.dusts = this.dusts.filter((dust) => {
    //   return dust.ttl > 0;
    // });
  }
  add(pos, intense) {
    const dust = new Dust(pos, intense);
    this.dusts.push(dust);
    return dust;
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
    this.dusts.forEach((dust) => {
      const timeshiftedPoint = timeshift(dust.pos, t);

      const blinkRatio = sampleBlinkRatio(t, dust.style.entropy.blink.freq, dust.style.entropy.blink.phaseShift);
      let burnWaveRatio = sampleBurnWaveRatio(t, timeshiftedPoint.coords.x, timeshiftedPoint.coords.y, dust.style.entropy.burnWave.phaseShift - 0.1, 2);
      //burnWaveRatio *= dust.style.entropy.burnWave.amount;

      const screenPoint = camera.mapToScreen(timeshiftedPoint);




      //let intense = 0.4 * dust.style.intense + blinkRatio * 0.4 + Math.random() * 0.2;
      let intense =
        + 0.5 * dust.style.intense
        + 0.5 * blinkRatio
        + 2 * burnWaveRatio
        - 1.1;

      if (intense > 0) {
        const tweakedIntense = Math.pow(intense, 1/2);
        const plusSize = tweakedIntense / screenPoint.zScale * 1.5;
        basic.pie.main.setAlpha(tweakedIntense);
        basic.pie.main.setPlotColor(dust.style.color.r, dust.style.color.g, dust.style.color.b);
        basic.pie.main.plotLine(screenPoint.coords.x, screenPoint.coords.y - plusSize, screenPoint.coords.x, screenPoint.coords.y + plusSize);
        basic.pie.main.plotLine(screenPoint.coords.x - plusSize, screenPoint.coords.y, screenPoint.coords.x + plusSize, screenPoint.coords.y);
      }
    });
  }
}