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
  style = {
    color: {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    },
  }
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
  isAlive = true;
  iteration(t, dt) {
    this.vel.coords.x += this.acc.coords.x * dt;
    this.vel.coords.y += this.acc.coords.y * dt;
    this.vel.coords.z += this.acc.coords.z * dt;

    this.pos.coords.x += this.vel.coords.x * dt;
    this.pos.coords.y += this.vel.coords.y * dt;
    this.pos.coords.z += this.vel.coords.z * dt;
  }
}
class PlayerPool {
  players = [];
  iteration(t, dt) {
    this.players.forEach((player) => {
      player.iteration(t, dt);
    });
    this.players = this.players.filter((player) => {
      return player.isAlive;
    });
  }
  add(pos, vel, acc, size) {
    this.players.push(new Player(pos, vel, acc, size));
  }
  addRandom() {
    const pos = new Point3D(Math.random() * fieldWidth, Math.random() * fieldHeight, (Math.random() - 0.5) * fieldDepth);
    const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    const acc = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    //const vel = new Point3D();
    //const acc = new Point3D();
    this.add(pos, vel, acc);
  }
  addRandomAtPos(pos) {
    const vel = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    const acc = new Point3D((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
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
    basic.pie.main.setLineWidth(1);
    basic.pie.main.setAlpha(1);
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

      screenCircles.forEach((screenCircle)=>{
        basic.pie.main.setFillColor(screenCircle.color.r, screenCircle.color.g, screenCircle.color.b);
        basic.pie.main.fillCircle(screenCircle.pos.coords.x, screenCircle.pos.coords.y, screenCircle.radius);
      })
    });
  }
}

playerColorWhite = {r: 255, g: 255, b: 255};
playerColorMain = {r: 255, g: 128, b: 0};
playerColorSecondary = {r: 0, g: 128, b: 255};
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

  new PlayerSphere(new Point3D(  8,   4,   0),  8, playerColorMain),
  new PlayerSphere(new Point3D( -8,   4,   0),  8, playerColorMain),

  new PlayerSphere(new Point3D(  9,   8,   0),  8, playerColorMain),
  new PlayerSphere(new Point3D( -9,   8,   0),  8, playerColorMain),

  new PlayerSphere(new Point3D( 10,  12,   0),  8, playerColorMain),
  new PlayerSphere(new Point3D(-10,  12,   0),  8, playerColorMain),

  new PlayerSphere(new Point3D(  0,   4,   8),  8, playerColorSecondary),
  new PlayerSphere(new Point3D(  0,   4,  -8),  8, playerColorSecondary),

  new PlayerSphere(new Point3D(  0,   8,   9),  8, playerColorSecondary),
  new PlayerSphere(new Point3D(  0,   8,  -9),  8, playerColorSecondary),

  new PlayerSphere(new Point3D(  0,  12,  10),  8, playerColorSecondary),
  new PlayerSphere(new Point3D(  0,  12, -10),  8, playerColorSecondary),

  new PlayerSphere(new Point3D( 12,  16,   0),  4, playerColorWhite),
  new PlayerSphere(new Point3D(-12,  16,   0),  4, playerColorWhite),

  new PlayerSphere(new Point3D(  0,  16,  12),  4, playerColorWhite),
  new PlayerSphere(new Point3D(  0,  16, -12),  4, playerColorWhite),

  new PlayerSphere(new Point3D(  0,   8,   0),  8, playerColorWhite),
  new PlayerSphere(new Point3D(  0,  12,   0),  8, playerColorWhite),
  new PlayerSphere(new Point3D(  0,  16,   0),  8, playerColorWhite),
  new PlayerSphere(new Point3D(  0,  20,   0), 8, playerColorWhite),


  new PlayerSphere(new Point3D( 32,  32,  32),  8, playerColorWhite),
  new PlayerSphere(new Point3D(-32,  32,  32),  8, playerColorWhite),
  new PlayerSphere(new Point3D( 32, -32,  32),  8, playerColorWhite),
  new PlayerSphere(new Point3D(-32, -32,  32),  8, playerColorWhite),
  new PlayerSphere(new Point3D( 32,  32, -32),  8, playerColorWhite),
  new PlayerSphere(new Point3D(-32,  32, -32),  8, playerColorWhite),
  new PlayerSphere(new Point3D( 32, -32, -32),  8, playerColorWhite),
  new PlayerSphere(new Point3D(-32, -32, -32),  8, playerColorWhite),

]