class Cubus {
  style = {
    color: {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    },
    entropy: {
      blink: {
        freq: 3 + Math.random() * 3,
      },
    }
  };
  blinkPhase = 0;
  constructor(pos = new Point3D(), vel = new Point3D(), acc = new Point3D(), size = new Point3D()) {
    this.pos = pos;
    this.vel = vel;
    this.acc = acc;
    this.size = size;
  }
  ;
  ttl = 60;
  maxTtl = 60;
  phisicIteration(t, dt) {
    this.ttl -= dt;
    const ttlRatio = this.ttl / this.maxTtl;

    playerPool.players.forEach(player => {
      if (this.isPointWithin(player.pos)) {
        this.ttl = 0;
        for (let i = 0; i < 10; i++) {
          sparclePool.addRandomAtPos(this.pos.clone());

        }
      };
    })
    const sortedPlayers = playerPool.players.sort((a, b) => {
      return this.pos.subtract(a).mag() - this.pos.subtract(b).mag();
    });
    const closestPlayer = sortedPlayers[0];
    if (closestPlayer) {
      const diff = closestPlayer.pos.subtract(this.pos);
      //this.acc = diff.everyCoord((coord) => coord * 1);
      const desiredVel = diff;
      const desiredSpeed = desiredVel.len();
      const desiredDirection = desiredVel.everyCoord((coord)=> coord / desiredSpeed );
      const maxSpeed = 25;
      this.vel = desiredDirection.everyCoord((coord)=> coord * maxSpeed );
    }

    //this.vel.coords.x += this.acc.coords.x * dt;
    //this.vel.coords.y += this.acc.coords.y * dt;
    //this.vel.coords.z += this.acc.coords.z * dt;
    this.pos.coords.x += this.vel.coords.x * dt;
    this.pos.coords.y += this.vel.coords.y * dt;
    this.pos.coords.z += this.vel.coords.z * dt;
    this.blinkPhase += this.style.entropy.blink.freq * dt * ttlRatio;
  }
  drawIteration(t, dt) {
    basic.pie.extra.setLineWidth(2);
    const timeshiftedCenterPoint = timeshift(this.pos, t);
    const wordVertices = [
      timeshiftedCenterPoint.add(new Point3D(+this.size.coords.x / 2, +this.size.coords.y / 2, +this.size.coords.z / 2)),
      timeshiftedCenterPoint.add(new Point3D(+this.size.coords.x / 2, -this.size.coords.y / 2, +this.size.coords.z / 2)),
      timeshiftedCenterPoint.add(new Point3D(-this.size.coords.x / 2, -this.size.coords.y / 2, +this.size.coords.z / 2)),
      timeshiftedCenterPoint.add(new Point3D(-this.size.coords.x / 2, +this.size.coords.y / 2, +this.size.coords.z / 2)),
      timeshiftedCenterPoint.add(new Point3D(+this.size.coords.x / 2, +this.size.coords.y / 2, -this.size.coords.z / 2)),
      timeshiftedCenterPoint.add(new Point3D(+this.size.coords.x / 2, -this.size.coords.y / 2, -this.size.coords.z / 2)),
      timeshiftedCenterPoint.add(new Point3D(-this.size.coords.x / 2, -this.size.coords.y / 2, -this.size.coords.z / 2)),
      timeshiftedCenterPoint.add(new Point3D(-this.size.coords.x / 2, +this.size.coords.y / 2, -this.size.coords.z / 2)),
    ]
    const poligonsVertexIds = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [0, 1, 5, 4],
      [2, 3, 7, 6],
      [1, 2, 6, 5],
      [3, 0, 4, 7],
    ]

    const screenVertices = wordVertices.map((vertex) => {
      const screenPoint = camera.mapToScreen(vertex);
      return screenPoint;
    });
    const screenPoligons = poligonsVertexIds.map((poligonVertexIds)=>{
      return poligonVertexIds.map((poligonVertexId)=>{
        return screenVertices[poligonVertexId].coords;
      });
    });

    basic.pie.extra.setFillColor(this.style.color.r, this.style.color.g, this.style.color.b);
    basic.pie.extra.setPlotColor(this.style.color.r, this.style.color.g, this.style.color.b);

    const blinkRatio = Math.sin(this.blinkPhase * Math.PI * 2) / 2 + 0.5;
    const ttlRatio = this.ttl / this.maxTtl;
    basic.pie.extra.setAlpha(0.2 * ttlRatio);
    screenPoligons.forEach((screenPoligon)=>{
      basic.pie.extra.fillPolygon(screenPoligon);
    })
    basic.pie.extra.setAlpha((0.5 + blinkRatio * 0.5) * ttlRatio);

    screenPoligons.forEach((screenPoligon)=>{
      basic.pie.extra.plotPolyline(screenPoligon, true);
    });

  }
  isPointWithin(point) {
    const diff = this.pos.subtract(point);
    return Math.abs(diff.coords.x) < this.size.coords.x / 2 &&
           Math.abs(diff.coords.y) < this.size.coords.y / 2 &&
           Math.abs(diff.coords.z) < this.size.coords.z / 2;
  }
  isIntervalCrossing(pointFrom, pointTo) {
    //const diff = pointTo.subtract(pointFrom);
    const diff = this.pos.subtract(pointFrom);
    // TODO

    return Math.abs(diff.coords.x) < this.size.coords.x / 2 &&
           Math.abs(diff.coords.y) < this.size.coords.y / 2 &&
           Math.abs(diff.coords.z) < this.size.coords.z / 2;
  }
}


class CubusPool {
  cubuses = [];
  phisicIteration(t, dt) {
    this.cubuses.forEach((cubus) => {
      cubus.phisicIteration(t, dt);
    });
    this.cubuses = this.cubuses.filter((cubus) => {
      return cubus.ttl > 0;
    });
  }
  add(pos, vel, acc, size) {
    const cubus = new Cubus(pos, vel, acc, size)
    this.cubuses.push(cubus);
    return cubus;
  }
  addRandom() {
    const size = new Point3D(40,40,40);
    const pos = new Point3D((Math.random() - 0.5) * fieldWidth * 0.2, (Math.random() - 0.5) * fieldHeight * 0.2, (Math.random() - 0.5) * fieldDepth * 0.2);
    const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    //const acc = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    //const vel = new Point3D();
    const acc = new Point3D();
    return this.add(pos, vel, acc, size);
  }
  addRandomAtPos(pos) {
    const size = new Point3D(40,40,40);
    const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    //const acc = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    //const vel = new Point3D();
    const acc = new Point3D();
    return this.add(pos, vel, acc, size);
  }
  drawIteration(t, dt) {
    this.cubuses.forEach((cubus) => {
      cubus.drawIteration(t, dt);
    });
  }
}
