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

  constructor (x, y, weight = 1)
  {

    this.x = x;
    this.y = y;
    this.weight = weight;

  }

}
