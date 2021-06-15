import Point from './point';
import GridPoint from './grid_point';
import * as get from './getters';
import * as apps from './applicators';
import { draw } from './drawers';

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
  numX: number;
  numY: number;
  center: Point;
  sX: number;
  sY: number;
  xOrigin: number;
  yOrigin: number;
  points: Array<GridPoint>;

  // GETTERS
  getPoint: Function;
  getPointSafe: Function;
  getColumnByIndex: Function;
  getRowByIndex: Function;
  getOppositePoint: Function;
  getOppositePointVert: Function;
  getOppositePointHor: Function;
  getLine: Function;
  getLineNotOpped: Function;
  getCircle: Function;
  getPattern: Function;
  getThreshold: Function;
  getRandom: Function;
  getPerlin: Function;
  getSimplex: Function;

  draw: Function;

  setWeights: Function;
  addToWeights: Function;
  multiplyWeights: Function;
  addToPositions: Function;
  addToPositionsWeighted: Function;
  multPositions: Function;
  multPositionsWeighted: Function;
  applyLinRadGradientSlow: Function;
  applyLinRadGradient: Function;
  applySmoothRadGradientSlow: Function;
  applySmoothRadGradient: Function;
  applySinRadGradientSlow: Function;
  applySinRadGradient: Function;
  applyPerlin: Function;
  applySimplex: Function;
  applyRandom: Function;

  constructor(numberX: number,
              numberY: number,
              centerPoint: Point, 
              spacingX: number,
              spacingY: number)
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
    this.getThreshold = get.getThreshold(this.points);
    this.getRandom = get.getRandom(this.points);
    this.getPerlin = get.getPerlin(this.points);
    this.getSimplex = get.getSimplex(this.points);

    /************************************************/
    /******************* DRAWING ********************/
    /************************************************/

    this.draw = draw(this.points);

    /************************************************/
    /******************* APPLICATORS ****************/
    /************************************************/

    this.setWeights = apps.setWeights(this.points);
    this.addToWeights = apps.addToWeights(this.points);
    this.multiplyWeights = apps.multiplyWeights(this.points);
    this.addToPositions = apps.addToPositions(this.points);
    this.addToPositionsWeighted = apps.addToPositionsWeighted(this.points);
    this.multPositions = apps.multPositions(this.points);
    this.multPositionsWeighted = apps.multPositionsWeighted(this.points);
    this.applyLinRadGradientSlow = apps.applyPGLinRadGradientSlow(this);
    this.applyLinRadGradient = apps.applyPGLinRadGradient(this);
    this.applySmoothRadGradientSlow = apps.applyPGSmoothRadGradientSlow(this);
    this.applySmoothRadGradient = apps.applyPGSmoothRadGradient(this);
    this.applySinRadGradientSlow = apps.applyPGSinRadGradientSlow(this);
    this.applySinRadGradient = apps.applyPGSinRadGradient(this);
    this.applyPerlin = apps.applyPerlin(this.points);
    this.applySimplex = apps.applySimplex(this.points);
    this.applyRandom = apps.applyRandom(this.points);
  }

  /************************************************/
  /******************* UTILS **********************/
  /************************************************/

  checkBounds(columnStart: number,
              rowStart: number,
              columnEnd: number,
              rowEnd: number) : boolean
  {
    // Checks whether the given row and column values exceed the number of columns and rows in a POINT_GRID
    // columnStart, rowStart -> initial col and row values
    // columnEnd, rowEnd -> final col and row values
    return this.checkRowBounds(rowStart) &&
      this.checkRowBounds(rowEnd) &&
      this.checkColBounds(columnStart) &&
      this.checkColBounds(columnEnd);
  }

  checkRowBounds(row: number) : boolean
  {
    // Checks whether the given row exceeds the bounds of the given POINT_GRID
    // row -> row value to check
    return row >= 0 && row < this.numY;
  }

  checkColBounds(col: number) : boolean
  {
    // Checks whether the given column exceeds the bounds of the given POINT_GRID
    // col -> col value to check
    return col >= 0 && col < this.numX;
  }
}

function populateDefaultPoints (pointGrid: PointGrid) : void
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
