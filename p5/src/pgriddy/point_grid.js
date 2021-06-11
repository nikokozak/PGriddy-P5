import GridPoint from './grid_point'
import { arraySelector } from './utilities'

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
  }

  getPoint(column, row) 
  {
    // Fetches a GridPoint from a PointGrid.
    // column -> column of the desired point.
    // row -> row of the desired point.
    column = Math.min(column, this.numX);
    row = Math.min(row, this.numY);
    
    return arraySelector(column, row, this.numX, this.points);
  }

  getPointSafe(column, row) 
  {
    // Fetches a GridPoint from a PointGrid,
    // throwing an Error if the input parameters are
    // out of bounds.
    // column -> column of the desired point.
    // row -> row of the desired point.
    if (column > this.numX - 1 
      || row > this.numY - 1 
      || column < 0 
      || row < 0) 
    {
      throw("UNSAFE_POINT");
    } else {
      return arraySelector(column, row, this.numX, this.points);
    }
  }

  getColumnByIndex(index) 
  {
    // Fetches a column of GridPoints from a PointGrid
    // index -> the index of the desired column.
    let result = [];
    for (let i = 0; i < this.numY; i++) {
      result.push(arraySelector(index, i, this.numX, this.points));
    }
  }

  getRowByIndex(index)
  {
    // Fetches a row of GridPoints from a PointGrid
    // index -> the index of the desired row.
    let result = [];
    for (let i = 0; i < this.numX; i++) {
      result.push(arraySelector(i, index, this.numX, this.points));
    }
  }

  getOppositePoint(column, row)
  {
    // Fetches a vertically and horizontally symmetrical GridPoint based on a source GridPoint (defined by a column and a row coordinate).
    // column -> column index of source point
    // row -> row index of source point
    let gridWidth = this.numX - 1;
    let gridHeight = this.numY - 1;
    let oppositeX = gridWidth - column;
    let oppositeY = gridHeight - row;

    return this.getPoint(oppositeX, oppositeY);
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
