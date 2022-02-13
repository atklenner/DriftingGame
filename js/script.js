import Car from "./Car.js";

let accelerate = false;
let decelerate = false;
let coast = !accelerate && !decelerate;
let turnLeft = false;
let turnRight = false;
const car = new Car(document.querySelector(".car"));

let lastTime;
function update(time) {
  if (lastTime !== undefined) {
    const delta = time - lastTime;
    if (accelerate) {
      car.accelerate(delta);
    }
    if (decelerate) {
      car.decelerate(delta);
    }
    if (coast) {
      car.coast(delta);
    }
    if (turnLeft) {
      car.turnLeft(delta);
    }
    if (turnRight) {
      car.turnRight(delta);
    }
    car.update(delta);
  }
  const direction = (-(car.angle * 180) / Math.PI - 90).toString() + "deg";
  document.querySelector(".car").style.setProperty("--direction", direction);
  lastTime = time;
  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    accelerate = true;
  }
  if (e.key === "ArrowDown") {
    decelerate = true;
  }
  if (e.key === "ArrowLeft") {
    turnLeft = true;
  }
  if (e.key === "ArrowRight") {
    turnRight = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") {
    accelerate = false;
  }
  if (e.key === "ArrowDown") {
    decelerate = false;
  }
  if (e.key === "ArrowLeft") {
    turnLeft = false;
  }
  if (e.key === "ArrowRight") {
    turnRight = false;
  }
});
