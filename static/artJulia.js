function artJuliaInit() {
}

function artJuliaIteration(t, dt) {
  const rnd = Math.random() * 100 - 50;
  const yShift = t * 10;
  basic.pie.main.cls();
  basic.pie.main.plotLine(200, 200 + rnd, 400, 200 - rnd);
  basic.pie.main.plotLine(300, 200, 300, 300);
  basic.pie.main.plotLine(200, 300, 400, 300);
  basic.pie.main.plotLine(200, 300, 200, 400);
  basic.pie.main.plotLine(400, 300, 400, 400 + yShift);
  basic.pie.main.plotLine(200, 400, 400, 400 + yShift);
}