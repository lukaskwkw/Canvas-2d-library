export interface Point {
  x: number;
  y: number;
}

export class Vector {
  _x: number;
  _y: number;
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  setX(x: number) {
    this._x = x;
  }
  getX() {
    return this._x;
  }
  setY(y: number) {
    this._y = y;
  }
  getY() {
    return this._y;
  }
  getCords(): Point {
    return { x: this._x, y: this._y };
  }
  setCords({ x, y }: Point) {
    this._x = x;
    this._y = y;
  }

  setAngle(angle: number) {
    const length = this.getLength();
    this._x = Math.cos(angle) * length;
    this._y = Math.sin(angle) * length;
  }

  setLength(length: number) {
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

  addVector(vector2: Vector) {
    return new Vector(this._x + vector2.getX(), this._y + vector2.getY());
  }

  substractVector(vector2: Vector) {
    return new Vector(this._x - vector2.getX(), this._y - vector2.getY());
  }

  multiply(value: number) {
    return new Vector(this._x * value, this._y * value);
  }

  addTo(vector2: Vector) {
    this._x += vector2.getX();
    this._y += vector2.getY();
  }

  multiplyTo(value: number) {
    this._x *= value;
    this._y *= value;
  }
}

export default Vector;
