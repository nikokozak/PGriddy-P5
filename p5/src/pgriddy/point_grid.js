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

  /************************************************/
  /******************* GETTERS ********************/
  /************************************************/

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

  getOppositePointVert(column, row)
  {
    // Fetches a vertically symmetrical POINT based on a source POINT and POINT_GRID
    // Where:
    // column -> column index of source point
    // row -> row index of source point
    let gridHeight = this.numY - 1;
    let oppositeY = gridHeight - row;

    return this.getPoint(column, oppositeY);
  }

  getOppositePointHor(column, row)
  {
    // Fetches a horizontally symmetrical POINT based on a source POINT and POINT_GRID
    // Where:
    // _col -> column index of source point
    // _row -> row index of source point
    let gridWidth = this.numX - 1;
    let oppositeX = gridWidth - column;

    return this.getPoint(oppositeX, row);
  }

  getLine(columnStart, rowStart, columnEnd, rowEnd)
  {
    // fetches points on grid according to line given by (columnStart, rowStart), (columnEnd, rowEnd)
    // uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
    // Where:
    // columnStart, rowStart -> start point of line (by col and row index of POINT_GRID)
    // columnEnd, rowEnd -> end point of line (by col and row index of POINT_GRID)
    let result = [];
    let dx = Math.abs(columnEnd - columnStart);
    let dy = Math.abs(rowEnd - rowStart) * -1;
    let sx = columnStart < columnEnd ? 1 : -1;
    let sy = rowStart < rowEnd ? 1 : -1;
    let err = dx + dy;
    let e2;

    while (true) {
      if (this.checkBounds(columnStart, rowStart, columnEnd, rowEnd)) {
        result.push(this.getPoint(columnStart, rowStart));
      }
      e2 = err * 2;
      if (e2 >= dy) {
        if (columnStart == columnEnd);
        err += dy; columnStart += sx;
      }
      if (e2 <= dx) {
        if (rowStart == rowEnd) break;
        err += dx; rowStart += sy;
      }
    }

    return result;
  }

  getLineNotOpped(columnStart, rowStart, columnEnd, rowEnd)
  {
    // fetches points on grid according to line given by (columnStart, rowStart), (columnEnd, rowEnd)
    // instead of an optimized algorithm, uses a non-optimized slope-intercept based method.
    // Where:
    // columnStart, rowStart -> start point of line (by col and row index of POINT_GRID)
    // columnEnd, rowEnd -> end point of line (by col and row index of POINT_GRID)
    let result = [];
    
    let dir = columnStart < columnEnd;
    let startX = dir ? columnStart : columnEnd;
    let startY = dir ? rowStart : rowEnd;
    let endX = dir ? columnEnd : columnStart;
    let endY = dir ? rowEnd : rowStart;
    let slope = (endY - startY) / (endX - startX);
    let offset = startY - slope*startX;
    let y;

    while (startX++ != endX) {
      y = slope * startX + offset;
      result.push(this.getPoint(startX, y));
    }

    return result;

  }

  
  getCircle(column, row, radius)
  {
    // fetches points on grid according to circle with center (column, row) and radius (radius)
    // uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
    // Where:
    // column, row -> center of circle
    // radius -> radius of circle
    let result = [];
  
    let x = -radius;
    let y = 0;
    let err = 2-2*radius;
    
    while (x < 0) {
      if (column - x < this.numX && column - x > -1 && row + y < this.numY && row + y > -1) { // Same as with line (out of bounds checks).
        result.push(this.getPoint(column - x, row + y));
      }
      if (column - y > -1 && column - y < this.numX && row - x < this.numY && row - x > -1) {
        result.push(this.getPoint(column - y, row - x));
      }
      if (column + x > -1 && column + x < this.numX && row - y > -1 && row - y < this.numY) {
        result.push(this.getPoint(column + x, row - y));
      }
      if (column + y < this.numX && column + y > -1 && row + x > -1 && row + x < this.numY) {
        result.push(this.getPoint(column + y, row + x));
      }
      radius = err;
      if (radius <= y) {
        y += 1;
        err += y*2+1;
      }
      if (radius > x || err > y) {
        x += 1;
        err += x*2+1;
      }
    }
  
    return this.points;
  }

  getPattern(_col, _row, _dlist, _reps, _overflow) {
    
    Set<Grid_Point> temp_result = new HashSet<Grid_Point>(); // Consider just checking ArrayList for duplicates
    
    Grid_Point currentPoint = new Grid_Point(getPoint(_col, _row, _pg));
    int step = 0;
    int pointer = 0;
    int mod = _dlist.size();
    
    while (step < _reps) {
      if (temp_result.contains(currentPoint) || currentPoint == null) break;
      temp_result.add(new Grid_Point(currentPoint));
      
      pointer = step % mod;
      //print(_dlist.get(pointer));
      
      switch(_dlist.get(pointer)) {
        case 0:
          currentPoint = _overflow ? getPoint(currentPoint.gridIndexX, currentPoint.gridIndexY - 1, _pg) : getPointSafe(currentPoint.gridIndexX, currentPoint.gridIndexY - 1, _pg);
          break;
        case 1:
          currentPoint = _overflow ? getPoint(currentPoint.gridIndexX + 1, currentPoint.gridIndexY - 1, _pg) : getPointSafe(currentPoint.gridIndexX + 1, currentPoint.gridIndexY - 1, _pg);
          break;
        case 2:
          currentPoint = _overflow ? getPoint(currentPoint.gridIndexX + 1, currentPoint.gridIndexY, _pg) : getPointSafe(currentPoint.gridIndexX + 1, currentPoint.gridIndexY, _pg);
          break;
        case 3:
          currentPoint = _overflow ? getPoint(currentPoint.gridIndexX + 1, currentPoint.gridIndexY + 1, _pg) : getPointSafe(currentPoint.gridIndexX + 1, currentPoint.gridIndexY + 1, _pg);
          break;
        case 4:
          currentPoint = _overflow ? getPoint(currentPoint.gridIndexX, currentPoint.gridIndexY + 1, _pg) : getPointSafe(currentPoint.gridIndexX, currentPoint.gridIndexY + 1, _pg);
          break;
        case 5:
          currentPoint = _overflow ? getPoint(currentPoint.gridIndexX - 1, currentPoint.gridIndexY + 1, _pg) : getPointSafe(currentPoint.gridIndexX - 1, currentPoint.gridIndexY + 1, _pg);
          break;
        case 6:
          currentPoint = _overflow ? getPoint(currentPoint.gridIndexX - 1, currentPoint.gridIndexY, _pg) : getPointSafe(currentPoint.gridIndexX - 1, currentPoint.gridIndexY, _pg);
          break;
        case 7:
          currentPoint = _overflow ? getPoint(currentPoint.gridIndexX - 1, currentPoint.gridIndexY - 1, _pg) : getPointSafe(currentPoint.gridIndexX - 1, currentPoint.gridIndexY - 1, _pg);
          break;
      }
      
      step += 1;
      
    }
    
    ArrayList<Grid_Point> result = new ArrayList<Grid_Point>(temp_result.size());
    Iterator<Grid_Point> it = temp_result.iterator();
    
    while (it.hasNext()) {
      result.add(it.next());
    }
    
    return result;
    
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
