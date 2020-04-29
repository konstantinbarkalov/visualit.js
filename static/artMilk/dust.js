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
  drawIteration(t, dt) {
    const timeshiftedPoint = timeshift(this.pos, t);

    const blinkRatio = sampleBlinkRatio(t, this.style.entropy.blink.freq, this.style.entropy.blink.phaseShift);
    let burnWaveRatio = sampleBurnWaveRatio(t, timeshiftedPoint.coords.x, timeshiftedPoint.coords.y, this.style.entropy.burnWave.phaseShift - 0.1, 2);
    //burnWaveRatio *= this.style.entropy.burnWave.amount;

    const screenPoint = camera.mapToScreen(timeshiftedPoint);




    //let intense = 0.4 * this.style.intense + blinkRatio * 0.4 + Math.random() * 0.2;
    let intense =
      + 0.5 * this.style.intense
      + 0.5 * blinkRatio
      + 2 * burnWaveRatio
      - 1.1;

    if (intense > 0) {
      const tweakedIntense = Math.pow(intense, 1/2);
      const plusSize = tweakedIntense / screenPoint.zScale * 1.5;
      basic.pie.main.setAlpha(tweakedIntense);
      basic.pie.main.setPlotColor(this.style.color.r, this.style.color.g, this.style.color.b);
      basic.pie.main.plotLine(screenPoint.coords.x, screenPoint.coords.y - plusSize, screenPoint.coords.x, screenPoint.coords.y + plusSize);
      basic.pie.main.plotLine(screenPoint.coords.x - plusSize, screenPoint.coords.y, screenPoint.coords.x + plusSize, screenPoint.coords.y);
    }
  }
}


class DustPool {
  dusts = [];
  phisicIteration(t, dt) {
    // this.dusts.forEach((dust) => {
    //   dust.phisicIteration(t, dt);
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
    const pos = new Point3D((Math.random() - 0.5) * fieldWidth, (Math.random() - 0.5) * fieldHeight, (Math.random() - 0.5) * fieldDepth);
    const intense = Math.random();
    return this.add(pos, intense);
  }
  addRandomAtPos(pos) {
    const intense = Math.random();
    return this.add(pos, intense);
  }
  drawIteration(t, dt) {
    this.dusts.forEach((dust) => {
      dust.drawIteration(t, dt);
    });
  }
}