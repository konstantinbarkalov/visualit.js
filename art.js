async function art() {
  while(true) {
    const rnd = Math.random() * 100 - 50;
    basic.cls();
    basic.plotLine(200, 200 + rnd, 400, 200 - rnd);
    basic.plotLine(300, 200, 300, 300);
    basic.plotLine(200, 300, 400, 300);
    basic.plotLine(200, 300, 200, 400);
    basic.plotLine(400, 300, 400, 400);
    basic.plotLine(200, 400, 400, 400);
    await basic.pause(200);
  }

}