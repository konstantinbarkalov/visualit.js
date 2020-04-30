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
  selfTrail = [];
  exhaustTrail = [];
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
    const maxPower = this.maxPower + (basic.input.isAPressed ? 1000 : 0);
    const maxAccLen = maxPower / this.mass;
    const diff = this.pos.subtract(cursorProjector.pos);
    const dist = diff.len();
    if (dist === 0) {
      this.acc = new Point3D();
    } else {
      //const desireSafeSpeed = desireSafeTime * maxAccLen; // h * km/h^2 = km/h
      const desireSafeSpeed = Math.sqrt(dist * maxAccLen * 2); // sqrt(km * km/h^2) = sqrt(km^2/h^2) = sqrt((km/h)^2)


      //const desireArivementTime = this.desireArivementTime;
      const targetVel = diff.everyCoord((coord) => -coord / dist * desireSafeSpeed);
      const targetAcc = targetVel.subtract(this.vel).everyCoord(coord => coord / dt);
      const targetAccLen = targetAcc.len();
      const accLen = Math.min(targetAccLen, maxAccLen);
      const accLenCappingFactor = accLen / targetAccLen;
      this.acc = targetAcc.everyCoord((coord) => coord * accLenCappingFactor);
      //for (let i = 0; i < 3; i++) {

        if (window.flyMode !== 0) { //  flyMode TODO: remove
          const spitPos = this.pos.clone();
          const spitVel = this.vel.clone();
          const spitAcc = this.acc.everyCoord(coord => coord * -100 + (Math.random() - 0.5) * 10000);
          spitVel.coords.x += spitAcc.coords.x * dt;
          spitVel.coords.y += spitAcc.coords.y * dt;
          spitVel.coords.z += spitAcc.coords.z * dt;

          const spitPower = accLen * this.mass;
          const spit = spitPool.add(spitPos, spitVel, spitPower);
          spit.style.color = (Math.random() < 0.5) ? this.style.colors.primaryA : this.style.colors.primaryB;

          this.selfTrail.unshift(spitPos); // no clone!!
          this.selfTrail.splice(this.maxTrailLength);
        }
      //}
    }

    this.exhaustTrail.unshift(this.pos.clone());
    this.exhaustTrail.splice(this.maxTrailLength);

    this.vel.coords.x += this.acc.coords.x * dt;
    this.vel.coords.y += this.acc.coords.y * dt;
    this.vel.coords.z += this.acc.coords.z * dt;
    //this.vel = targetVel;

    this.pos.coords.x += this.vel.coords.x * dt;
    this.pos.coords.y += this.vel.coords.y * dt;
    this.pos.coords.z += this.vel.coords.z * dt;



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
    //const directionCoords = this.vel.coords;
    let directionCoords;
    if (window.flyMode === 0) { //  flyMode TODO: remove
      directionCoords = this.vel.coords;
    } else if (window.flyMode === 2) {
      directionCoords = this.vel.coords;
    } else {
      directionCoords = this.acc.coords;
    }
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
    const labelText = 'vel: ' + this.vel.len().toFixed(2) + ' acc: ' + this.acc.len().toFixed(2);
    basic.pie.main.setColor(10,20,30);
    basic.pie.main.fillRect(screenPlayerPoint.coords.x + 100, screenPlayerPoint.coords.y + 100, screenPlayerPoint.coords.x + 240, screenPlayerPoint.coords.y + 120)
    basic.pie.main.setColor(255,255,255);
    basic.pie.main.print(screenPlayerPoint.coords.x + 100 + 10, screenPlayerPoint.coords.y + 100 + 10 + 2, labelText);
    screenCircles.forEach((screenCircle)=>{
      let color = screenCircle.color;
      if (typeof color === 'string') {
        color = this.style.colors[color];
      }
      basic.pie.main.setFillColor(color.r, color.g, color.b);
      basic.pie.main.fillCircle(screenCircle.pos.coords.x, screenCircle.pos.coords.y, screenCircle.radius);
    })

    // basic.pie.main.setPlotColor(this.style.colors.primaryA.r, this.style.colors.primaryA.g, this.style.colors.primaryA.b);
    // this.drawTrail(this.exhaustTrail, t, dt);

    // basic.pie.main.setPlotColor(this.style.colors.primaryB.r, this.style.colors.primaryB.g, this.style.colors.primaryB.b);
    // this.drawTrail(this.selfTrail, t, dt);

    if (window.flyMode === 0) { //  flyMode TODO: remove
      basic.pie.main.setPlotColor(this.style.colors.primaryA.r, this.style.colors.primaryA.g, this.style.colors.primaryA.b);
      this.drawTrail(this.exhaustTrail, t, dt);
    } else if (window.flyMode === 1) {
      basic.pie.main.setPlotColor(this.style.colors.primaryB.r, this.style.colors.primaryB.g, this.style.colors.primaryB.b);
      this.drawTrail(this.selfTrail, t, dt);
    } else {
      basic.pie.main.setPlotColor(this.style.colors.primaryA.r, this.style.colors.primaryA.g, this.style.colors.primaryA.b);
      this.drawTrail(this.exhaustTrail, t, dt);

      basic.pie.main.setPlotColor(this.style.colors.primaryB.r, this.style.colors.primaryB.g, this.style.colors.primaryB.b);
      this.drawTrail(this.selfTrail, t, dt);
    }
  }
  drawTrail(trail, t, dt) {
    const trailScreenPoints = trail.map((worldCoords, worldCoordsId)=>{
      let timeshiftedPoint = timeshift(worldCoords, t);
      timeshiftedPoint.coords.x += (Math.random() / 2 - 0.5) * worldCoordsId * 1;
      timeshiftedPoint.coords.y += (Math.random() / 2 - 0.5) * worldCoordsId * 1;
      timeshiftedPoint.coords.z += (Math.random() / 2 - 0.5) * worldCoordsId * 1;
      const screenPoint = camera.mapToScreen(timeshiftedPoint);
      return screenPoint;
    });
    if (trailScreenPoints.length > 0) {
      splitArray(trailScreenPoints, 5, 1).forEach((slice, sliceId)=>{
        basic.pie.main.setAlpha((30 - sliceId) / 30 / 3);
        basic.pie.main.setLineWidth((sliceId + 1) * 3 * slice[0].zScale);
        basic.pie.main.plotPolyline(slice.map(point => point.coords));
      })
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
    const pos = new Point3D((Math.random() - 0.5) * fieldWidth, (Math.random() - 0.5) * fieldHeight, (Math.random() - 0.5) * fieldDepth);
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

