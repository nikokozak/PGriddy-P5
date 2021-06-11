/*
  The POINT class.

  A point is the basic data structure in PGriddy,
  containing information on:

  X - position (cartesian)
  Y - position (cartesian)
  Weight - weight to help with transformations
*/

export default function Point (x: number, y: number, weight: number = 1)
{

  this.x = x;
  this.y = y;
  this.weight = 1;

}
