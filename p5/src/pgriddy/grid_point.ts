import Point from './point';

/*
  The GRID POINT class.

  GRID POINT is a data structure
  a GRID POINT represents a POINT acquired from a (belonging to) a GRID
  X -> window coordinate X of point.
  Y -> window coordinate Y of point.
  gridIndexX -> if created as part of a POINT_GRID, COL index of said POINT_GRID
  gridIndexY -> if created as part of a POINT_GRID, ROW index of said POINT_GRID
  weight -> associated weight of point.
*/

export default class GridPoint extends Point {

  iX: number;
  iY: number;

  constructor (x: number,
               y: number,
               gridIndexX: number,
               gridIndexY: number,
               weight: number = 1)
  {

    super(x, y, weight);
    this.iX = gridIndexX;
    this.iY = gridIndexY;

  }

}

