import { arraySelector, forEachPoint } from './utilities';
import Point from './point';
import GridPoint from './grid_point';
import PointGrid from './point_grid';
import Selection from './selection';
import { noise } from './noise';
// VARIOUS GETTER FUNCTIONS FOR CLASSES

/************************************************/
/************ POINTGRID GETTERS *****************/
/************************************************/

export const getPGPoint = (pointGrid: PointGrid) : Function =>
  // Fetches a GridPoint from a PointGrid.
  // column -> column of the desired point.
  // row -> row of the desired point.
{
  return (column: number, row: number) : any => {

   // column = Math.min(column, pointGrid.numX);
   // row = Math.min(row, pointGrid.numY);
    column = column % pointGrid.numX;
    row = row % pointGrid.numY;

    return arraySelector(column, row, pointGrid.numX, pointGrid.points);

  };
}

export const getPGPointSafe = (pointGrid: PointGrid) : Function =>
  // Fetches a GridPoint from a PointGrid,
  // throwing an Error if the input parameters are
  // out of bounds.
  // column -> column of the desired point.
  // row -> row of the desired point.
{
  return (column: number, row: number) : RangeError | any => { 
    if (column > pointGrid.numX - 1
        || row > pointGrid.numY - 1
        || column < 0
        || row < 0)
    {
      throw new RangeError("Point not in grid!");
    } else {
      return arraySelector(column, row, pointGrid.numX, pointGrid.points);
    }
  };
}

export const getPGColumnByIndex = (pointGrid: PointGrid) : Function =>
  // Fetches a column of GridPoints from a PointGrid
  // index -> the index of the desired column.
{
  return (index: number) : any => { 
    let result = [];
    for (let i = 0; i < pointGrid.numY; i++) {
      result.push(arraySelector(index, i, pointGrid.numX, pointGrid.points));
    }
    return result;
  };
}

export const getPGRowByIndex = (pointGrid: PointGrid) : Function =>
  // Fetches a row of GridPoints from a PointGrid
  // index -> the index of the desired row.
{
  return (index: number) : any => {
    let result = [];
    for (let i = 0; i < pointGrid.numX; i++) {
      result.push(arraySelector(i, index, pointGrid.numX, pointGrid.points));
    }
    return result;
  };
}

export const getPGOppositePoint = (pointGrid: PointGrid) : Function =>
  // Fetches a vertically and horizontally symmetrical GridPoint based on a source GridPoint (defined by a column and a row coordinate).
  // column -> column index of source point
  // row -> row index of source point
{
  return (column: number, row: number) : any => {
    let gridWidth = pointGrid.numX - 1;
    let gridHeight = pointGrid.numY - 1;
    let oppositeX = gridWidth - column;
    let oppositeY = gridHeight - row;

    return pointGrid.getPoint(oppositeX, oppositeY);
  };
}

export const getPGOppositePointVert = (pointGrid: PointGrid) : Function =>
  // Fetches a vertically symmetrical POINT based on a source POINT and POINT_GRID
  // Where:
  // column -> column index of source point
  // row -> row index of source point
{
  return (column: number, row: number) : any => {
    let gridHeight = pointGrid.numY - 1;
    let oppositeY = gridHeight - row;

    return pointGrid.getPoint(column, oppositeY);
  };
}

export const getPGOppositePointHor = (pointGrid: PointGrid) : Function =>
{
  // Fetches a horizontally symmetrical POINT based on a source POINT and POINT_GRID
  // Where:
  // column -> column index of source point
  // row -> row index of source point
  return (column: number, row: number) : any => {
    let gridWidth = pointGrid.numX - 1;
    let oppositeX = gridWidth - column;

    return pointGrid.getPoint(oppositeX, row);
  };
}

export const getPGLine = (pointGrid: PointGrid) : Function =>
  // fetches points on grid according to line given by (columnStart, rowStart), (columnEnd, rowEnd)
  // uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
  // Where:
  // columnStart, rowStart -> start point of line (by col and row index of POINT_GRID)
  // columnEnd, rowEnd -> end point of line (by col and row index of POINT_GRID)
{
  return (columnStart: number, rowStart: number, columnEnd: number, rowEnd: number) : Array<GridPoint> => {
    let result = [];
    let dx = Math.abs(columnEnd - columnStart);
    let dy = Math.abs(rowEnd - rowStart) * -1;
    let sx = columnStart < columnEnd ? 1 : -1;
    let sy = rowStart < rowEnd ? 1 : -1;
    let err = dx + dy;
    let e2;

    while (true) {
      if (pointGrid.checkBounds(columnStart, rowStart, columnEnd, rowEnd)) {
        result.push(pointGrid.getPoint(columnStart, rowStart));
      }
      e2 = err * 2;
      if (e2 >= dy) {
        if (columnStart == columnEnd) break;
        err += dy; columnStart += sx;
      }
      if (e2 <= dx) {
        if (rowStart == rowEnd) break;
        err += dx; rowStart += sy;
      }
    }

    return result;
  };
}

export const getPGLineNotOpped = (pointGrid: PointGrid) : Function =>
  // fetches points on grid according to line given by (columnStart, rowStart), (columnEnd, rowEnd)
  // instead of an optimized algorithm, uses a non-optimized slope-intercept based method.
  // Where:
  // columnStart, rowStart -> start point of line (by col and row index of POINT_GRID)
  // columnEnd, rowEnd -> end point of line (by col and row index of POINT_GRID)
{
  return (columnStart: number, rowStart: number, columnEnd: number, rowEnd: number) : Array<GridPoint> => {
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
      result.push(pointGrid.getPoint(startX, y));
    }

    return result;
  };
}

export const getPGCircle = (pointGrid: PointGrid) : Function =>
  // fetches points on grid according to circle with center (column, row) and radius (radius)
  // uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
  // Where:
  // column, row -> center of circle
  // radius -> radius of circle
{
  return (column: number, row: number, radius: number) : Array<GridPoint> => {
    let result = [];

    let x = -radius;
    let y = 0;
    let err = 2-2*radius;

    while (x < 0) {
      if (column - x < pointGrid.numX && column - x > -1 && row + y < pointGrid.numY && row + y > -1) { // Same as with line (out of bounds checks).
        result.push(pointGrid.getPoint(column - x, row + y));
      }
      if (column - y > -1 && column - y < pointGrid.numX && row - x < pointGrid.numY && row - x > -1) {
        result.push(pointGrid.getPoint(column - y, row - x));
      }
      if (column + x > -1 && column + x < pointGrid.numX && row - y > -1 && row - y < pointGrid.numY) {
        result.push(pointGrid.getPoint(column + x, row - y));
      }
      if (column + y < pointGrid.numX && column + y > -1 && row + x > -1 && row + x < pointGrid.numY) {
        result.push(pointGrid.getPoint(column + y, row + x));
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

    return pointGrid.points;
  }
}

export const getPGPattern = (pointGrid: PointGrid) : Function => 
  // fetches points according to a list of directions (explained below) for a certain number of iterations
  //
  // column, row -> origin of pattern
  // directionList -> list of steps to take, where: 0:top, 1:top-right, 2:right, 3:bottom-right, etc.
  // repetitions -> number of steps to take (from 0, where none are taken, to ...)
  // overflow -> allow for pattern to wrap around edges (if a similar point is found, pattern will break regardless of reps)
{
  return (column: number, row: number, directionList: Array<number>, repetitions: number, overflow: boolean = false) : Array<GridPoint> =>
  {
    let tempResult: Set<GridPoint> = new Set(); // Consider just checking ArrayList for duplicates

    let currentPoint = Object.assign({}, pointGrid.getPoint(column, row));
    let step = 0;
    let pointer = 0;
    let mod = directionList.length;

    while (step < repetitions) {
      // if (tempResult.has(currentPoint) || currentPoint == null) break;
      if (currentPoint == null) break;

      tempResult.add(Object.assign({}, currentPoint));
      //new Grid_Point(currentPoint));

      pointer = step % mod;
      //print(directionList.get(pointer));

      switch(directionList[pointer]) {
        case 0:
          currentPoint = overflow ? pointGrid.getPoint(currentPoint.iX, currentPoint.iY - 1) : pointGrid.getPointSafe(currentPoint.iX, currentPoint.iY - 1);
          break;
        case 1:
          currentPoint = overflow ? pointGrid.getPoint(currentPoint.iX + 1, currentPoint.iY - 1) : pointGrid.getPointSafe(currentPoint.iX + 1, currentPoint.iY - 1);
          break;
        case 2:
          currentPoint = overflow ? pointGrid.getPoint(currentPoint.iX + 1, currentPoint.iY) : pointGrid.getPointSafe(currentPoint.iX + 1, currentPoint.iY);
          break;
        case 3:
          currentPoint = overflow ? pointGrid.getPoint(currentPoint.iX + 1, currentPoint.iY + 1) : pointGrid.getPointSafe(currentPoint.iX + 1, currentPoint.iY + 1);
          break;
        case 4:
          currentPoint = overflow ? pointGrid.getPoint(currentPoint.iX, currentPoint.iY + 1) : pointGrid.getPointSafe(currentPoint.iX, currentPoint.iY + 1);
          break;
        case 5:
          currentPoint = overflow ? pointGrid.getPoint(currentPoint.iX - 1, currentPoint.iY + 1) : pointGrid.getPointSafe(currentPoint.iX - 1, currentPoint.iY + 1);
          break;
        case 6:
          currentPoint = overflow ? pointGrid.getPoint(currentPoint.iX - 1, currentPoint.iY) : pointGrid.getPointSafe(currentPoint.iX - 1, currentPoint.iY);
          break;
        case 7:
          currentPoint = overflow ? pointGrid.getPoint(currentPoint.iX - 1, currentPoint.iY - 1) : pointGrid.getPointSafe(currentPoint.iX - 1, currentPoint.iY - 1);
          break;
      }

      step += 1;

    }

    return new Selection(Array.from(tempResult));
  };
}

export const getRandom = (points: Array<Point | GridPoint>) : Function => 
  // Returns a selection of points based on a random application of
  // weights onto GridPoints in a given PointGrid, and a threshold to select from
  // Where:
  // low: bottom cutoff for weight
  // high: top cutoff for weight
{
  return (low: number, high: number) : Array<Point | GridPoint> => {
    let result: Array<Point | GridPoint> = [];

    forEachPoint(points, (point: GridPoint, _index: number) => {
      const rand = Math.random();
      if (rand >= low && rand <= high) {
        result.push(point);
      }
    });

    return result;
  };
}

export const getPerlin = (points: Array<Point | GridPoint>) : Function =>
  // Returns a selection of points based on an application of perlin noise
  // weights onto GridPoints in a given PointGrid, and a threshold to select from
  // low: bottom cutoff for weight
  // high: top cutoff for weight
{
  return (low: number, high: number, time: number = 0) : Array<Point | GridPoint> => {
    let result: Array<Point | GridPoint> = [];

    forEachPoint(points, (point: GridPoint, _index: number) => {
      const perlin = noise.perlin3(point.x, point.y, time);
      if (perlin >= low && perlin <= high) {
        result.push(point);
      }
    })

    return result;
  };
}

export const getSimplex = (points: Array<Point | GridPoint>) : Function =>
  // Returns a selection of points based on an application of simplex noise
  // weights onto GridPoints in a given PointGrid, and a threshold to select from
  // low: bottom cutoff for weight
  // high: top cutoff for weight
{
  return (low: number, high: number, time: number = 0) : Array<Point | GridPoint> => {
    let result: Array<Point | GridPoint> = [];

    forEachPoint(points, (point: GridPoint, _index: number) => {
      const simplex = noise.simplex3(point.x, point.y, time);
      if (simplex >= low && simplex <= high) {
        result.push(point);
      }
    })

    return result;
  };
}

export const getThreshold = (points: Array<Point | GridPoint>) =>
{
  // retrieves Points whose weight is > low and < high.
  // low: bottom cutoff for weight
  // high: top cutoff for weight
  return (low: number, high: number) : Array<Point | GridPoint> =>
  {
    let result = [];

    for (let i = 0; i < points.length; i++) {
      if (points[i].weight > low && points[i].weight < high) {
        result.push(points[i]);
      }
    }

    return result;
  }
}
