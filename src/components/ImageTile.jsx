import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { clamp } from "../utils/math";
import PropTypes from "prop-types";

const ImageScale = 1.3;

const Wrapper = styled.div`
  background-color: #fff;
  padding: 4px;
  margin: 16px;
`;

const ImageContainer = styled.div`
  background-color: #fff;
  width: 200px;
  height: 200px;
  cursor: pointer;
  overflow: hidden;
  position: relative;

  &:hover > :first-child {
    transform: scale(${ImageScale});

    & + * {
      left: 0;
    }
  }
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  position: absolute;
  pointer-events: none;

  transition: all 0.5s ease-out;
`;

const ImageText = styled.div`
  padding: 2px;
  left: -100%;
  background-color: black;
  color: white;
  position: absolute;
  bottom: 0;

  transition: 0.3s ease-out;
`;

const roundZoomNearCorners = ({
  offsetX,
  offsetY,
  offsetWidth,
  offsetHeight,
  clampedX,
  clampedY,
  maxX,
  maxY,
  fraction = 6
}) => {
  const x =
    offsetX <= offsetWidth / fraction
      ? maxX / 2
      : offsetX >= ((fraction - 1) * offsetWidth) / fraction
      ? -maxX / 2
      : clampedX;
  const y =
    offsetY <= offsetHeight / fraction
      ? maxY / 2
      : offsetY >= ((fraction - 1) * offsetHeight) / fraction
      ? -maxY / 2
      : clampedY;
  return { x, y };
};

const DefaultPosition = { x: 0, y: 0 };

const ImageTile = React.forwardRef(
  ({ position = DefaultPosition, src, title }, ref) => pug`
    Wrapper
      ImageContainer(ref=ref)
        Image(style={left: position.x +'px', top: position.y + 'px'} src=src)
        ImageText #{title}
`
);

ImageTile.propTypes = {
  position: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
  src: PropTypes.string,
  title: PropTypes.string
};

const onMouseMove = (myRef, setPosition) => e => {
  requestAnimationFrame(() => {
    const { current } = myRef;

    //this way a Image must be first children of ImageContainer!
    const { offsetWidth, offsetHeight } = current.firstChild;
    const { pageX, pageY, offsetX, offsetY } = e;
    //todo: change maxX and maxY variable names to diffrent
    const maxX = ImageScale * offsetWidth - offsetWidth;
    const maxY = ImageScale * offsetHeight - offsetHeight;
    const diffX = pageX - (pageX + ImageScale * offsetX - maxX / 2);
    const diffY = pageY - (pageY + ImageScale * offsetY - maxY / 2);
    const clampedX = clamp(diffX, -maxX / 2, maxX / 2);
    const clampedY = clamp(diffY, -maxY / 2, maxY / 2);

    setPosition(
      roundZoomNearCorners({
        offsetX,
        offsetY,
        offsetWidth,
        offsetHeight,
        clampedX,
        clampedY,
        maxX,
        maxY
      })
    );
  });
};

const onMouseLeave = setPosition => () => setPosition(DefaultPosition);

const HOC = ({ src, title }) => {
  const myRef = useRef();
  const [position, setPosition] = useState(DefaultPosition);
  const mouseMove = onMouseMove(myRef, setPosition);
  const mouseLeave = onMouseLeave(setPosition);

  useEffect(() => {
    myRef.current.addEventListener("mousemove", mouseMove);
    myRef.current.addEventListener("mouseleave", mouseLeave);
    return () => {
      myRef.current.removeEventListener("mousemove", mouseMove);
      myRef.current.removeEventListener("mouseleave", mouseLeave);
    };
  });

  return pug`
    ImageTile(ref=myRef
      setPosition=setPosition
      position=position
      src=src
      title=title)
    `;
};

export default HOC;
