import GridPoint from './grid_point';
import * as get from './getters';
import { draw } from './drawers';
import { arraySelector, weightToRGB } from './utilities';

/*
  The POINT GRID class.

  a POINT_GRID is a data structure

  a POINT_GRID contains a 2D collection of POINTs

  x -> Number of POINTs in X axis (INT)
  y -> Number of POINTs in Y axis (INT)
  c -> Global center of GRID (POINT)
  sX -> Spacing between POINTs in X axis (INT)
  sY -> Spacing between POINTs in Y axis (INT)
*/

export default class PointGrid
{

  constructor(numberX, numberY, centerPoint, spacingX, spacingY)
  {
    this.numX = numberX;
    this.numY = numberY;
    this.center = centerPoint;
    this.sX = spacingX;
    this.sY = spacingY;

    this.xOrigin = centerPoint.x - ((numberX / 2) * spacingX);
    this.yOrigin = centerPoint.y - ((numberY / 2) * spacingY);

    this.points = [];
    populateDefaultPoints(this);

    /************************************************/
    /******************* GETTERS ********************/
    /************************************************/

    this.getPoint = get.getPGPoint(this);
    this.getPointSafe = get.getPGPointSafe(this);
    this.getColumnByIndex = get.getPGColumnByIndex(this);
    this.getRowByIndex = get.getPGRowByIndex(this);
    this.getOppositePoint = get.getPGOppositePoint(this);
    this.getOppositePointVert = get.getPGOppositePointVert(this);
    this.getOppositePointHor = get.getPGOppositePointHor(this);
    this.getLine = get.getPGLine(this);
    this.getLineNotOpped = get.getPGLineNotOpped(this);
    this.getCircle = get.getPGCircle(this);
    this.getPattern = get.getPGPattern(this);
    this.getThreshold = get.getPGThreshold(this);
    this.getRandom = get.getPGRandom(this);
    this.getPerlin = get.getPGPerlin(this);

    /************************************************/
    /******************* DRAWING ********************/
    /************************************************/

    this.draw = draw(this.points);

  }

  /************************************************/
  /******************* UTILS **********************/
  /************************************************/

  checkBounds(columnStart, rowStart, columnEnd, rowEnd)
  {
    // Checks whether the given row and column values exceed the number of columns and rows in a POINT_GRID
    // columnStart, rowStart -> initial col and row values
    // columnEnd, rowEnd -> final col and row values
    return this.checkRowBounds(rowStart) &&
      this.checkRowBounds(rowEnd) &&
      this.checkColBounds(columnStart) &&
      this.checkColBounds(columnEnd);
  }

  checkRowBounds(row)
  {
    // Checks whether the given row exceeds the bounds of the given POINT_GRID
    // row -> row value to check
    return row >= 0 && row < this.numY;
  }

  checkColBounds(col)
  {
    // Checks whether the given column exceeds the bounds of the given POINT_GRID
    // col -> col value to check
    return col >= 0 && col < this.numX;
  }
}

function populateDefaultPoints (pointGrid)
{
// Populates the 'pointGrid.points' field
// in a column-first flat array fashion.
  let xPos, yPos;
  for (let i = 0; i < pointGrid.numX; i++) {

    xPos = pointGrid.xOrigin + (i * pointGrid.sX);

    for (let j = 0; j < pointGrid.numY; j++) {

      yPos = pointGrid.yOrigin + (j * pointGrid.sY);
      pointGrid.points.push(new GridPoint(xPos, yPos, i, j));

    }
  }
}
