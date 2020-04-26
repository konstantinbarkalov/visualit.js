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
  style = {
    colors: {
      main: {
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
      },
      secondary: {
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
      },
    }
  }
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
  };
  iteration(t, dt) {
    this.vel.coords.x += this.acc.coords.x * dt;
    this.vel.coords.y += this.acc.coords.y * dt;
    this.vel.coords.z += this.acc.coords.z * dt;

    this.pos.coords.x += this.vel.coords.x * dt;
    this.pos.coords.y += this.vel.coords.y * dt;
    this.pos.coords.z += this.vel.coords.z * dt;

    this.trail.unshift(this.pos.clone());
    this.trail.splice(this.maxTrailLength);

    if (!isInTube(this.pos)) {
      this.isAlive = false;
    };
  }
}
class PlayerPool {
  players = [];
  cursorProjector = new CursorProjector();
  fireDeath(player) {
    for (let i = 0; i < 10; i++) {
      sparclePool.addRandomAtPos(player.pos.clone());
    }
  }
  iteration(t, dt) {
    this.players.forEach((player) => {
      player.iteration(t, dt);
    });
    this.players = this.players.filter((player) => {
      if (!player.isAlive) {
        this.fireDeath(player);
      }
      return player.isAlive;
    });
    this.cursorProjector.iteration(t, dt);
  }
  add(pos, vel, acc, size) {
    this.players.push(new Player(pos, vel, acc, size));
  }
  addRandom() {
    const pos = new Point3D(Math.random() * fieldWidth, Math.random() * fieldHeight, (Math.random() - 0.5) * fieldDepth);
    const vel = new Point3D((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300);
    const acc = new Point3D((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300);
    //const vel = new Point3D();
    //const acc = new Point3D();
    this.add(pos, vel, acc);
  }
  addRandomAtPos(pos) {
    const vel = new Point3D((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300);
    const acc = new Point3D((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300);
    //const vel = new Point3D();
    //const acc = new Point3D();
    this.add(pos, vel, acc);
  }
  rotateX(pos, angleDelta) {
    const posRotated = pos.clone();
    posRotated.coords.y = Math.cos(angleDelta) * pos.coords.y - Math.sin(angleDelta) * pos.coords.z;
    posRotated.coords.z = Math.sin(angleDelta) * pos.coords.y + Math.cos(angleDelta) * pos.coords.z;
    return posRotated;
  }
  rotateY(pos, angleDelta) {
    const posRotated = pos.clone();
    posRotated.coords.x = Math.cos(angleDelta) * pos.coords.x - Math.sin(angleDelta) * pos.coords.z;
    posRotated.coords.z = Math.sin(angleDelta) * pos.coords.x + Math.cos(angleDelta) * pos.coords.z;
    return posRotated;
  }
  rotateZ(pos, angleDelta) {
    const posRotated = pos.clone();
    posRotated.coords.x = Math.cos(angleDelta) * pos.coords.x - Math.sin(angleDelta) * pos.coords.y;
    posRotated.coords.y = Math.sin(angleDelta) * pos.coords.x + Math.cos(angleDelta) * pos.coords.y;
    return posRotated;
  }
  draw(t, dt) {
    this.players.forEach((player) => {

      const angleA = Math.atan2(player.vel.coords.y, player.vel.coords.x);
      const lenA = Math.sqrt(player.vel.coords.x**2 + player.vel.coords.y **2);
      const angleB = Math.atan2(player.vel.coords.z, lenA);

      const timeshiftedCenterPoint = timeshift(player.pos, t);

      const screenCircles = playerSpheres.map((sphere) => {
        let worldPos = sphere.pos;
        worldPos = this.rotateX(worldPos, -angleB);
        worldPos = this.rotateZ(worldPos, angleA + Math.PI / 2);

        const timeshiftedWorldPos = timeshiftedCenterPoint.add(worldPos);
        const screenPoint = camera.mapToScreen(timeshiftedWorldPos);
        screenPoint.zScale * sphere.size / 2;
        return {pos: screenPoint, radius: screenPoint.zScale * sphere.size / 2, color: sphere.color};
      }).sort((a, b) => {
        return a.pos.zScale - b.pos.zScale;
      });

      basic.pie.main.setAlpha(1);

      screenCircles.forEach((screenCircle)=>{
        let color = screenCircle.color;
        if (typeof color === 'string') {
          color = player.style.colors[color];
        }
        basic.pie.main.setFillColor(color.r, color.g, color.b);
        basic.pie.main.fillCircle(screenCircle.pos.coords.x, screenCircle.pos.coords.y, screenCircle.radius);
      })

      basic.pie.main.setPlotColor(0, 128, 255);

      const trailScreenPoints = player.trail.map((worldCoords, worldCoordsId)=>{
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
          splitArray(trailScreenPoints, 5).forEach((slice, sliceId)=>{
            basic.pie.main.setAlpha((30 - sliceId) / 30 / 3);
            basic.pie.main.setLineWidth((sliceId + 1) * 3 * slice[0].zScale);
            basic.pie.main.plotPolyline(slice.map(point => point.coords));
          })
        }
      }

    });
    this.cursorProjector.draw(t, dt);
  }
}

playerColorWhite = {r: 255, g: 255, b: 255};
//
//       ()
//      `  `
//     (    )
//   (  )  (  )
//  ()  (  )  ()
//      ( )
//       ()
const playerSpheres = [
  new PlayerSphere(new Point3D(  0,  -8,   0),  4, playerColorWhite),

  new PlayerSphere(new Point3D(  0,   0,   0),  16, playerColorWhite),

  new PlayerSphere(new Point3D(  8,   4,   0),  8, 'main'),
  new PlayerSphere(new Point3D( -8,   4,   0),  8, 'main'),

  new PlayerSphere(new Point3D(  9,   8,   0),  8, 'main'),
  new PlayerSphere(new Point3D( -9,   8,   0),  8, 'main'),

  new PlayerSphere(new Point3D( 10,  12,   0),  8, 'main'),
  new PlayerSphere(new Point3D(-10,  12,   0),  8, 'main'),

  new PlayerSphere(new Point3D(  0,   4,   8),  8, 'secondary'),
  new PlayerSphere(new Point3D(  0,   4,  -8),  8, 'secondary'),

  new PlayerSphere(new Point3D(  0,   8,   9),  8, 'secondary'),
  new PlayerSphere(new Point3D(  0,   8,  -9),  8, 'secondary'),

  new PlayerSphere(new Point3D(  0,  12,  10),  8, 'secondary'),
  new PlayerSphere(new Point3D(  0,  12, -10),  8, 'secondary'),

  new PlayerSphere(new Point3D( 12,  16,   0),  4, playerColorWhite),
  new PlayerSphere(new Point3D(-12,  16,   0),  4, playerColorWhite),

  new PlayerSphere(new Point3D(  0,  16,  12),  4, playerColorWhite),
  new PlayerSphere(new Point3D(  0,  16, -12),  4, playerColorWhite),

  new PlayerSphere(new Point3D(  0,   8,   0),  8, playerColorWhite),
  new PlayerSphere(new Point3D(  0,  12,   0),  8, playerColorWhite),
  new PlayerSphere(new Point3D(  0,  16,   0),  8, playerColorWhite),
  new PlayerSphere(new Point3D(  0,  20,   0), 8, playerColorWhite),


  // new PlayerSphere(new Point3D( 32,  32,  32),  8, playerColorWhite),
  // new PlayerSphere(new Point3D(-32,  32,  32),  8, playerColorWhite),
  // new PlayerSphere(new Point3D( 32, -32,  32),  8, playerColorWhite),
  // new PlayerSphere(new Point3D(-32, -32,  32),  8, playerColorWhite),
  // new PlayerSphere(new Point3D( 32,  32, -32),  8, playerColorWhite),
  // new PlayerSphere(new Point3D(-32,  32, -32),  8, playerColorWhite),
  // new PlayerSphere(new Point3D( 32, -32, -32),  8, playerColorWhite),
  // new PlayerSphere(new Point3D(-32, -32, -32),  8, playerColorWhite),

]