class PlayerSphere {
  constructor(
    pos = new Point3D(),
    size = 1,
    color = {r: 0, g: 128, b: 255}
  ) {
    this.pos = pos;
    this.size = size;
    this.color = color;
  };
}
class Player {
  trail = [];
  maxTrailLength = 150;
  mass = 1;
  maxPower = 100;
  desireArivementTime = 0.5;
  style = {
    colors: {
      primaryA: {
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
      },
      primaryB: {
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
      },
    }
  }
  starlane = null;
  isAlive = true;
  constructor(
    pos = new Point3D(),
    vel = new Point3D(),
    acc = new Point3D(),
    size = new Point3D(10,10,10),
  ) {
    this.pos = pos;
    this.vel = vel;
    this.acc = acc;
    this.size = size;
    this.beginNewStarlane();
  };
  phisicIteration(t, dt) {
    const diff = this.pos.subtract(cursorProjector.pos);
    const targetVel = diff.everyCoord((coord) => -coord / this.desireArivementTime);
    const targetAcc = targetVel.subtract(this.vel).everyCoord(coord => coord / dt);
    const targetAccLen = targetAcc.len();
    const maxAccLen = this.maxPower / this.mass;
    const accLen = Math.min(targetAccLen, maxAccLen);
    const accLenCappingFactor = accLen / targetAccLen;
    this.acc = targetAcc.everyCoord((coord) => coord * accLenCappingFactor);

    this.vel.coords.x += this.acc.coords.x * dt;
    this.vel.coords.y += this.acc.coords.y * dt;
    this.vel.coords.z += this.acc.coords.z * dt;
    //this.vel = targetVel;

    this.pos.coords.x += this.vel.coords.x * dt;
    this.pos.coords.y += this.vel.coords.y * dt;
    this.pos.coords.z += this.vel.coords.z * dt;

    this.trail.unshift(this.pos.clone());
    this.trail.splice(this.maxTrailLength);


    if (this.starlane) {
      if (Math.random() < 0.5) {
        const starsSortedByDistance = starPool.stars.sort((a, b) => {
          return Math.sqrt(
            (a.pos.coords.x - this.pos.coords.x) ** 2 +
            (a.pos.coords.y - this.pos.coords.y) ** 2 +
            (a.pos.coords.z - this.pos.coords.z) ** 2
          ) -
          Math.sqrt(
            (b.pos.coords.x - this.pos.coords.x) ** 2 +
            (b.pos.coords.y - this.pos.coords.y) ** 2 +
            (b.pos.coords.z - this.pos.coords.z) ** 2
          )
        })
        const closestStar = starsSortedByDistance[0];
        const lastStar = this.starlane.stars[this.starlane.stars.length];
        if (lastStar !== closestStar) {
          this.starlane.addStar(closestStar);
        }
        this.starlane.hotEndPoint = this.pos;
      }
    }

    if (!isInTube(this.pos)) {
      this.isAlive = false;
    };
  }
  beginNewStarlane() {
    this.starlane = starlanePool.createPlayerStarlane();
  }
  endCurrentStarlane() {
    this.starlane = null;
  }
  drawIteration(t, dt) {
    const directionCoords = this.vel.coords;
    const angleA = Math.atan2(directionCoords.y, directionCoords.x);
    const lenA = Math.sqrt(directionCoords.x**2 + directionCoords.y **2);
    const angleB = Math.atan2(directionCoords.z, lenA);

    const timeshiftedCenterPoint = timeshift(this.pos, t);

    const screenCircles = playerSpheres.map((sphere) => {
      let worldPos = sphere.pos;
      worldPos = worldPos.rotateY(t * Math.PI * 2);
      worldPos = worldPos.rotateX(-angleB);
      worldPos = worldPos.rotateZ(angleA + Math.PI / 2);

      const timeshiftedWorldPos = timeshiftedCenterPoint.add(worldPos);
      const screenPoint = camera.mapToScreen(timeshiftedWorldPos);
      screenPoint.zScale * sphere.size / 2;
      return {pos: screenPoint, radius: screenPoint.zScale * sphere.size / 2, color: sphere.color};
    }).sort((a, b) => {
      return a.pos.zScale - b.pos.zScale;
    });

    basic.pie.main.setAlpha(1);

    const screenPlayerPoint = camera.mapToScreen(timeshiftedCenterPoint);
    basic.pie.main.setColor(255,128,0);
    basic.pie.main.print(screenPlayerPoint.coords.x + 100, screenPlayerPoint.coords.y + 100, this.acc.coords.x.toFixed(2));
    screenCircles.forEach((screenCircle)=>{
      let color = screenCircle.color;
      if (typeof color === 'string') {
        color = this.style.colors[color];
      }
      basic.pie.main.setFillColor(color.r, color.g, color.b);
      basic.pie.main.fillCircle(screenCircle.pos.coords.x, screenCircle.pos.coords.y, screenCircle.radius);
    })

    basic.pie.main.setPlotColor(0, 128, 255);

    const trailScreenPoints = this.trail.map((worldCoords, worldCoordsId)=>{
      let timeshiftedPoint = timeshift(worldCoords, t);
      timeshiftedPoint.coords.x += (Math.random() / 2 - 0.5) * worldCoordsId * 1;
      timeshiftedPoint.coords.y += (Math.random() / 2 - 0.5) * worldCoordsId * 1;
      timeshiftedPoint.coords.z += (Math.random() / 2 - 0.5) * worldCoordsId * 1;
      const screenPoint = camera.mapToScreen(timeshiftedPoint);
      return screenPoint;
    });
    if (trailScreenPoints.length > 0) {
      let prevCoords = trailScreenPoints[0].coords;
      if (trailScreenPoints.every((point) => { // TODO: check just boundary
        const simpleDistance = Math.abs(prevCoords.x - point.coords.x) +
                               Math.abs(prevCoords.y - point.coords.y) +
                               Math.abs(prevCoords.z - point.coords.z);

        const isNoTooLong = simpleDistance < 800;
        prevCoords = point.coords;
        return isNoTooLong;
      })) {
        splitArray(trailScreenPoints, 5, 1).forEach((slice, sliceId)=>{
          basic.pie.main.setAlpha((30 - sliceId) / 30 / 3);
          basic.pie.main.setLineWidth((sliceId + 1) * 3 * slice[0].zScale);
          basic.pie.main.plotPolyline(slice.map(point => point.coords));
        })
      }
    }
  }
}
class PlayerPool {
  players = [];
  fireDeath(player) {
    for (let i = 0; i < 10; i++) {
      sparclePool.addRandomAtPos(player.pos.clone());
    }
  }
  phisicIteration(t, dt) {
    this.players.forEach((player) => {
      player.phisicIteration(t, dt);
    });
    this.players = this.players.filter((player) => {
      if (!player.isAlive) {
        this.fireDeath(player);
      }
      return player.isAlive;
    });
  }
  add(pos, vel, acc) {
    const player = new Player(pos, vel, acc);
    this.players.push(player);
    return player;
  }
  addRandom() {
    const pos = new Point3D(Math.random() * fieldWidth, Math.random() * fieldHeight, (Math.random() - 0.5) * fieldDepth);
    const vel = new Point3D((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300);
    const acc = new Point3D((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300);
    //const vel = new Point3D();
    //const acc = new Point3D();
    return this.add(pos, vel, acc);
  }
  addRandomAtPos(pos) {
    const vel = new Point3D((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300);
    const acc = new Point3D((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300);
    //const vel = new Point3D();
    //const acc = new Point3D();
    return this.add(pos, vel, acc);
  }

  drawIteration(t, dt) {
    this.players.forEach((player) => {
      player.drawIteration(t, dt);

    });
  }
}

