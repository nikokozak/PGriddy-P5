import { weightToRGB } from './utilities';
import Point from './point';
import GridPoint from './grid_point';

// VARIOUS DRAWING FUNCTIONS FOR OUR CLASSES

export const draw = (points: Array<Point | GridPoint>) : Function =>
  // Draws all points of a list of poitns onto the window
  // type -> Type of Processing object to draw (INT) [1: POINT, 2: CIRCLE, 3: RECT]
  // displayWeight -> Allow weight to dictate the fill
{
  return (pInstance: any, type = 1, displayWeight = true) : void => {
    drawPoints(points, pInstance, type, displayWeight);
  };
}

export const drawPoints = (points: Array<Point | GridPoint>, pInstance: any, type: number, displayWeight: boolean) : void =>
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
