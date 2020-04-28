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
  ttl = 2;
  maxTtl = 2;
  iteration(t, dt) {
    this.ttl -= dt;
    const ttlRatio = this.ttl / this.maxTtl;
    this.vel.coords.x += this.acc.coords.x * dt;
    this.vel.coords.y += this.acc.coords.y * dt;
    this.vel.coords.z += this.acc.coords.z * dt;
    this.pos.coords.x += this.vel.coords.x * dt;
    this.pos.coords.y += this.vel.coords.y * dt;
    this.pos.coords.z += this.vel.coords.z * dt;
    this.blinkPhase += this.style.entropy.blink.freq * dt * ttlRatio;
  }
}


class CubusPool {
  cubuses = [];
  iteration(t, dt) {
    this.cubuses.forEach((cubus) => {
      cubus.iteration(t, dt);
    });
    this.cubuses = this.cubuses.filter((cubus) => {
      return cubus.ttl > 0;
    });
  }
  add(pos, vel, acc, size) {
    this.cubuses.push(new Cubus(pos, vel, acc, size));
  }
  addRandom() {
    const size = new Point3D(100,100,100);
    const pos = new Point3D(Math.random() * fieldWidth, Math.random() * fieldHeight, (Math.random() - 0.5) * fieldDepth);
    //const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    //const acc = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    const vel = new Point3D();
    const acc = new Point3D();
    this.add(pos, vel, acc, size);
  }
  addRandomAtPos(pos) {
    const size = new Point3D(100,100,100);
    //const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    //const acc = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    const vel = new Point3D();
    const acc = new Point3D();
    this.add(pos, vel, acc, size);
  }
  draw(t, dt) {
    basic.pie.extra.setLineWidth(2);
    this.cubuses.forEach((cubus) => {
      const timeshiftedCenterPoint = timeshift(cubus.pos, t);
      const wordVertices = [
        timeshiftedCenterPoint.add(new Point3D(+cubus.size.coords.x, +cubus.size.coords.y, +cubus.size.coords.z)),
        timeshiftedCenterPoint.add(new Point3D(+cubus.size.coords.x, -cubus.size.coords.y, +cubus.size.coords.z)),
        timeshiftedCenterPoint.add(new Point3D(-cubus.size.coords.x, -cubus.size.coords.y, +cubus.size.coords.z)),
        timeshiftedCenterPoint.add(new Point3D(-cubus.size.coords.x, +cubus.size.coords.y, +cubus.size.coords.z)),
        timeshiftedCenterPoint.add(new Point3D(+cubus.size.coords.x, +cubus.size.coords.y, -cubus.size.coords.z)),
        timeshiftedCenterPoint.add(new Point3D(+cubus.size.coords.x, -cubus.size.coords.y, -cubus.size.coords.z)),
        timeshiftedCenterPoint.add(new Point3D(-cubus.size.coords.x, -cubus.size.coords.y, -cubus.size.coords.z)),
        timeshiftedCenterPoint.add(new Point3D(-cubus.size.coords.x, +cubus.size.coords.y, -cubus.size.coords.z)),
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

      basic.pie.extra.setFillColor(cubus.style.color.r, cubus.style.color.g, cubus.style.color.b);
      basic.pie.extra.setPlotColor(cubus.style.color.r, cubus.style.color.g, cubus.style.color.b);

      const blinkRatio = Math.sin(cubus.blinkPhase * Math.PI * 2) / 2 + 0.5;
      const ttlRatio = cubus.ttl / cubus.maxTtl;
      basic.pie.extra.setAlpha(0.1 * ttlRatio);
      screenPoligons.forEach((screenPoligon)=>{
        basic.pie.extra.fillPolygon(screenPoligon);
      })
      basic.pie.extra.setAlpha((0.5 + blinkRatio * 0.5) * ttlRatio);

      screenPoligons.forEach((screenPoligon)=>{
        basic.pie.extra.plotPolyline(screenPoligon, true);
      });

    });
  }
}
