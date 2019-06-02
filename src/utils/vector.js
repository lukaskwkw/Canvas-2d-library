const Vector = (x = 0, y = 1) => {
  let _x = x,
    _y = y;

  const setX = x => (_x = x);
  const getX = () => _x;
  const setY = y => (_y = y);
  const getY = () => _y;

  function setAngle(angle) {
    const length = this.getLength();
    _x = Math.cos(angle) * length;
    _y = Math.sin(angle) * length;
  }

  const getAngle = () => Math.atan2(_y, _x);

  function setLength(length) {
    const angle = this.getAngle();
    _x = Math.cos(angle) * length;
    _y = Math.sin(angle) * length;
  }

  const getLength = () => Math.sqrt(_x ** 2 + _y ** 2);

  function addVector(vector2) {
    return new Vector(_x + vector2.getX(), _y + vector2.getY());
  }

  function addTo(vector2) {
    _x += vector2.getX();
    _y += vector2.getY();
  }

  return {
    setX,
    getX,
    setY,
    getY,
    setAngle,
    getAngle,
    setLength,
    getLength,
    addVector,
    addTo
  };
};

export default Vector;
