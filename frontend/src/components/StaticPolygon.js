import React, { useState } from "react";
import { Line, Circle, Group } from "react-konva";
import { minMax, dragBoundFunc } from "../utils/canvas.js";
/**
 *
 * @param {minMaxX} props
 * minMaxX[0]=>minX
 * minMaxX[1]=>maxX
 *
 */
const StaticPolygon = (props) => {
  const {
    points,
    flattenedPoints,
    isFinished,
    strokeColor,
    fillColor,
    pointFill,
    pointOnly
  } = props;
  const vertexRadius = pointOnly ? 6 : 4;
  var displayPoints = points.length > 1 ? (pointOnly ? [points[1]] : points) : points;

  return (
    <Group
      name="polygon"
    >
      <Line
        points={flattenedPoints}
        stroke={pointOnly ? null : strokeColor}
        strokeWidth={3}
        closed={isFinished}
        fill={null}
      />
      {displayPoints.map((point, index) => {
        const x = point[0] - vertexRadius / 2;
        const y = point[1] - vertexRadius / 2;
        return (
          <Circle
            key={index}
            x={x}
            y={y}
            radius={vertexRadius}
            fill={pointFill}
            stroke={strokeColor}
            strokeWidth={2}
          />
        );
      })}
    </Group>
  );
};

export default StaticPolygon;