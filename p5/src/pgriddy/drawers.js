import { weightToRGB } from './utilities';

// VARIOUS DRAWING FUNCTIONS FOR OUR CLASSES

export const drawPG = (pointGrid) =>
  // Draws all points of a PointGrid pg onto the window
  // type -> Type of Processing object to draw (INT) [1: POINT, 2: CIRCLE, 3: RECT]
  // displayWeight -> Allow weight to dictate the fill
{
  return (pInstance, type = 1, displayWeight = true) => {
    drawPoints(pointGrid.points, pInstance, type, displayWeight);
  };
}

export const drawPA = (pointArray) =>
  // Draws all points in a GridPoit Array onto the window
  // Where:
  // type -> Type of Processing object to draw (INT) [1: POINT, 2: CIRCLE, 3: RECT]
  // displayWeight -> Whether or not to color the points accordint to their associated weights
{
  return (pInstance, type = 1, displayWeight = true) => {
    drawPoints(pointArray.points, pInstance, type, displayWeight);
  };
}

export const drawPoints = (points, pInstance, type, displayWeight) =>
{
  for (let i = 0; i < points.length; i++) {
    if (displayWeight) {
      const col = weightToRGB(points[i].weight);
      pInstance.stroke(col);
      pInstance.fill(col);
    } else {
      pInstance.stroke(255);
      pInstance.fill(255);
    }

    switch(type) {
    case 1:
      pInstance.point(points[i].x, points[i].y);
      break;
    case 2:
      pInstance.circle(points[i].x, points[i].y, 3);
      break;
    case 3:
      pInstance.rectMode(pInstance.CENTER);
      pInstance.rect(points[i].x, points[i].y, 5, 5);
      break;
    }
  }
}
