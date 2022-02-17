const ENGINE_FORCE = 0.004; // px/ms^2, force / mass
const BRAKING_FORCE = 0.002;
const DRAG_COEF = 0.0001;
const ROLL_RES = 0.003;
const TURNING_RATE = 0.005; // tan(steering angle(= 20.5deg)) / car length(= 75px)
const MASS = 3;

// https://www.asawicki.info/Mirror/Car%20Physics%20for%20Games/Car%20Physics%20for%20Games.html
// https://www.xarg.org/book/kinematics/ackerman-steering/
// http://entertain.univie.ac.at/~hlavacs/publications/car_model06.pdf
export default class Car {
  constructor(carElem) {
    this.carElem = carElem;
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.carElem).getPropertyValue("--x"));
  }

  set x(value) {
    this.carElem.style.setProperty("--x", value);
  }

  get y() {
    return parseFloat(getComputedStyle(this.carElem).getPropertyValue("--y"));
  }

  set y(value) {
    this.carElem.style.setProperty("--y", value);
  }

  setDirection() {
    this.direction = { x: Math.cos(this.angle), y: -Math.sin(this.angle) };
  }

  getEngineToque() {
    if (this.accelerating) {
      return ENGINE_FORCE;
    }
    return 0;
  }

  getBraking() {
    if (this.braking && this.velocity > 0) {
      return BRAKING_FORCE;
    }
    return 0;
  }

  getDrag() {
    return Math.abs(DRAG_COEF * this.velocity * this.velocity);
  }

  getFriction() {
    return Math.abs(ROLL_RES * this.velocity);
  }

  getTotalAcceleration() {
    let total =
      this.getEngineToque() -
      this.getBraking() -
      this.getDrag() -
      this.getFriction();
    return total / MASS;
  }

  getTurningRate() {
    if (this.turningLeft && !this.turningRight) {
      return TURNING_RATE;
    }
    if (this.turningRight && !this.turningLeft) {
      return -1 * TURNING_RATE;
    }
    return 0;
  }

  rect() {
    return this.carElem.getBoundingClientRect();
  }

  reset() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.angle = Math.PI / 2;
    this.setDirection();
    this.velocity = 0;
    this.accelerating = false;
    this.braking = false;
    this.turningLeft = false;
    this.turningRight = false;
  }

  update(delta) {
    // the below assumes that the car is not losing traction
    this.x +=
      this.direction.x * delta * this.velocity +
      (this.getTotalAcceleration() * delta * delta) / 2;
    this.y +=
      this.direction.y * delta * this.velocity +
      (this.getTotalAcceleration() * delta * delta) / 2;

    this.velocity += this.getTotalAcceleration() * delta;

    if (this.velocity < 0) {
      this.velocity = 0;
    }

    this.angle += delta * this.velocity * this.getTurningRate();
    this.setDirection();

    // reset car if it leaves viewport
    const rect = this.rect();
    if (
      rect.bottom <= 0 ||
      rect.top >= window.innerHeight ||
      rect.left >= window.innerWidth ||
      rect.right <= 0
    ) {
      this.reset();
    }
  }
}
