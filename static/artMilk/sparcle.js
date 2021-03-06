class Sparcle {
  constructor(pos = new Point3D(), vel = new Point3D(), acc = new Point3D()) {
    this.pos = pos;
    this.vel = vel;
    this.acc = acc;
  }
  ;
  ttl = 5;
  maxTtl = 5;
  trail = [];
  maxTrailLength = 150;
  phisicIteration(t, dt) {
    this.ttl -= dt;
    this.vel.coords.x += this.acc.coords.x * dt;
    this.vel.coords.y += this.acc.coords.y * dt;
    this.vel.coords.z += this.acc.coords.z * dt;
    this.pos.coords.x += this.vel.coords.x * dt;
    this.pos.coords.y += this.vel.coords.y * dt;
    this.pos.coords.z += this.vel.coords.z * dt;
    this.trail.unshift(this.pos.clone());
    this.trail.splice(this.maxTrailLength);
  }
  drawIteration(t, dt) {
    basic.pie.main.setPlotColor(255, 0, 0);
    const trailScreenPoints = this.trail.map((worldCoords, worldCoordsId)=>{
      let timeshiftedPoint = timeshift(worldCoords, t);
      const screenPoint = camera.mapToScreen(timeshiftedPoint);
      return screenPoint;
    });
    if (trailScreenPoints.length > 0) {
      let prevCoords = trailScreenPoints[0].coords;
      if (trailScreenPoints.every((point) => { // TODO: check just boundary
        const simpleDistance = Math.abs(prevCoords.x - point.coords.x) +
                               Math.abs(prevCoords.y - point.coords.y);

        const isNoTooLong = simpleDistance < 800;
        prevCoords = point.coords;
        return isNoTooLong;
      })) {
        splitArray(trailScreenPoints, 5, 1).forEach((slice, sliceId)=>{
          basic.pie.main.setAlpha((20 - sliceId) / 20 * this.ttl / 5);
          basic.pie.main.setLineWidth((sliceId + 1) * 1 * slice[0].zScale);
          basic.pie.main.plotPolyline(slice.map(point => point.coords));
        })
      }
    }
  }
}


class SparclePool {
  sparcles = [];
  phisicIteration(t, dt) {
    this.sparcles.forEach((sparcle) => {
      sparcle.phisicIteration(t, dt);
    });
    this.sparcles = this.sparcles.filter((sparcle) => {
      return sparcle.ttl > 0;
    });
  }
  add(pos, vel, acc) {
    const sparcle = new Sparcle(pos, vel, acc);
    this.sparcles.push(sparcle);
    return sparcle;
  }
  addRandom() {
    const pos = new Point3D((Math.random() - 0.5) * fieldWidth, (Math.random() - 0.5) * fieldHeight, (Math.random() - 0.5) * fieldDepth);
    const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    const acc = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    return this.add(pos, vel, acc);
  }
  addRandomAtPos(pos) {
    const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    const acc = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    return this.add(pos, vel, acc);
  }
  drawIteration(t, dt) {
    this.sparcles.forEach((sparcle) => {
      sparcle.drawIteration(t, dt);
    });
  }
}