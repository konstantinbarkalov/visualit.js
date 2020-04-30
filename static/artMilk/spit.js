class Spit {
  style = {
    color: {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    },
  };
  blinkPhase = 0;
  constructor(pos = new Point3D(), vel = new Point3D(), power = 100) {
    this.pos = pos;
    this.vel = vel;
    this.power = power;
  }
  ;
  ttl = 1;
  maxTtl = 1;
  phisicIteration(t, dt) {
    this.ttl -= dt;
    this.pos.coords.x += this.vel.coords.x * dt;
    this.pos.coords.y += this.vel.coords.y * dt;
    this.pos.coords.z += this.vel.coords.z * dt;
  }
  drawIteration(t, dt) {
    const timeshiftedPoint = timeshift(this.pos, t);
    const screenPoint = camera.mapToScreen(timeshiftedPoint);
    basic.pie.extra.setFillColor(this.style.color.r, this.style.color.g, this.style.color.b);
    const ttlRatio = this.ttl / this.maxTtl;
    const ttlKernel = Math.pow(Math.sin(ttlRatio * Math.PI * 2), 1/2);
    basic.pie.extra.setAlpha(1 * ttlKernel);
    const powerRadius = 4;
    const radius = powerRadius * (1-ttlRatio);
    basic.pie.extra.fillCircle(screenPoint.coords.x, screenPoint.coords.y, screenPoint.zScale * radius);
  }
}


class SpitPool {
  spits = [];
  phisicIteration(t, dt) {
    this.spits.forEach((spit) => {
      spit.phisicIteration(t, dt);
    });
    this.spits = this.spits.filter((spit) => {
      return spit.ttl > 0;
    });
  }
  add(pos, vel, power) {
    const spit = new Spit(pos, vel, power)
    this.spits.push(spit);
    return spit;
  }
  addRandom(power) {
    const pos = new Point3D((Math.random() - 0.5) * fieldWidth * 0.2, (Math.random() - 0.5) * fieldHeight * 0.2, (Math.random() - 0.5) * fieldDepth * 0.2);
    const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    return this.add(pos, vel, power);
  }
  addRandomAtPos(pos, power) {
    const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    return this.add(pos, vel, power);
  }
  drawIteration(t, dt) {
    this.spits.forEach((spit) => {
      spit.drawIteration(t, dt);
    });
  }
}
