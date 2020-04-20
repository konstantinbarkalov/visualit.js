async function art() {
  await artCheapStars();
}
async function artCheapStars() {
  let stars = [];
  const starsCount = 1000;
  for (let starId = 0; starId < starsCount; starId++) {
    stars[starId] = {
      x: Math.random() * basic.input.w,
      y: Math.random() * basic.input.h,
      color: {
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
      },
      entropy: {
        phase: Math.random() * Math.PI * 2,
        freq: Math.random() * 10,
      }

    }

  }
  const dt = 1 / 60;
  let t = 0;
  while(true) {
    //basic.pie.main.setAlpha(0.1);
    basic.pie.main.cls();
    //basic.pie.main.setAlpha(1);
    t += dt;
    for (let starId = 0; starId < starsCount; starId++) {
      const star = stars[starId];
      const rnd = Math.sin(t * star.entropy.freq + star.entropy.phase) / 2 + 0.5;
      const linRatio = rnd;
      const invLinRatio = linRatio - 1;
      const bumpRatio = Math.pow(linRatio, 3);
      const invBumpRatio = 1 - bumpRatio;
      const dumpRatio = Math.pow(linRatio, 1/3);
      const invDumpRatio = 1 - dumpRatio;
      basic.pie.main.setColor(star.color.r, star.color.g, star.color.b);
      basic.pie.main.setAlpha(bumpRatio);
      const size = 50 * invDumpRatio;
      basic.pie.main.plotLine(star.x + size, star.y + size, star.x - size, star.y - size);
      basic.pie.main.plotLine(star.x + size, star.y - size, star.x - size, star.y + size);
    }
    await basic.pause(25);
  }

}