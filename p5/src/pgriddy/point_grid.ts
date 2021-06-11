import GridPoint from './grid_point'

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

export default function PointGrid (numberX: number,
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
  populatePoints(this);

}

function populatePoints (pointGrid: PointGrid): void
{
  let xPos, yPos;
  for (let i = 0; i < pointGrid.numX; i++) {

    xPos = pointGrid.xOrigin + (i * pointGrid.sX);

    for (let j = 0; j < pointGrid.numY; j++) {

      yPos = pointGrid.yOrigin + (j * pointGrid.sY);
      pointGrid.points.push(new GridPoint(xPos, yPos, i, j));

    }
  }
}
