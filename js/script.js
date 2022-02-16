import Car from "./Car.js";

const car = new Car(document.querySelector(".car"));

let lastTime;
function update(time) {
  window.requestAnimationFrame(update);
  if (lastTime !== undefined) {
    const delta = time - lastTime;
    car.update(delta);
  }
  const direction = (-(car.angle * 180) / Math.PI - 90).toString() + "deg";
  document.querySelector(".car").style.setProperty("--direction", direction);
  lastTime = time;
}

window.requestAnimationFrame(update);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    car.accelerating = true;
  }
  if (e.key === "ArrowDown") {
    car.decelerating = true;
  }
  if (e.key === "ArrowLeft") {
    car.turningLeft = true;
  }
  if (e.key === "ArrowRight") {
    car.turningRight = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") {
    car.accelerating = false;
  }
  if (e.key === "ArrowDown") {
    car.decelerating = false;
  }
  if (e.key === "ArrowLeft") {
    car.turningLeft = false;
  }
  if (e.key === "ArrowRight") {
    car.turningRight = false;
  }
});
