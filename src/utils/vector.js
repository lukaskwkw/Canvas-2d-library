export class Vector {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  setX(x) {
    this._x = x;
  }
  getX() {
    return this._x;
  }
  setY(y) {
    this._y = y;
  }
  getY() {
    return this._y;
  }
  getCords() {
    return { x: this._x, y: this._y };
  }
  setCords({ x, y }) {
    this._x = x;
    this._y = y;
  }

  setAngle(angle) {
    const length = this.getLength();
    this._x = Math.cos(angle) * length;
    this._y = Math.sin(angle) * length;
  }

  setLength(length) {
    const angle = this.getAngle();
    this._x = Math.cos(angle) * length;
    this._y = Math.sin(angle) * length;
  }

  getAngle() {
    return Math.atan2(this._y, this._x);
  }

  getLength() {
    return Math.sqrt(this._x ** 2 + this._y ** 2);
  }

  addVector(vector2) {
    return new Vector(this._x + vector2.getX(), this._y + vector2.getY());
  }

  addTo(vector2) {
    this._x += vector2.getX();
    this._y += vector2.getY();
  }

  multiplyTo(value) {
    this._x *= value;
    this._y *= value;
  }
}

export default Vector;
