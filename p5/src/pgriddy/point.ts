/*
  The POINT class.

  A point is the basic data structure in PGriddy,
  containing information on:

  X - position (cartesian)
  Y - position (cartesian)
  Weight - weight to help with transformations
*/

export default class Point 
{

  x: number;
  y: number;
  weight: number;

  constructor (x: number, y: number, weight = 1)
  {

    this.x = x;
    this.y = y;
    this.weight = weight;

  }

}
