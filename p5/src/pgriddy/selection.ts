import { draw } from './drawers';
import GridPoint from './grid_point';
import PointGrid from './point_grid';
/*
  A SELECTION is a data structure

  a SELECTION represents a portion of a POINT_GRID that can be passed into
  certain functions to limit their effect to specific areas.

  startCol, startRow -> top-left corner of selection rectangle
  startRow, endRow -> bottom-right corner of selection rectangle
 */

export default class Selection {

  colStart: number;
  rowStart: number;
  colEnd: number;
  rowEnd: number;

  draw: Function;
  points: Array<GridPoint>;

  constructor (colStart: number,
               rowStart: number, 
               colEnd: number, 
               rowEnd: number, 
               pointGrid: PointGrid)
  {

    if ( pointGrid.checkBounds(colStart, rowStart, colEnd, rowEnd) 
      && colStart <= colEnd
      && rowStart <= rowEnd )

    {

      this.colStart = colStart;
      this.rowStart = rowStart;
      this.colEnd = colEnd;
      this.rowEnd = rowEnd;

    } else {

      throw("Selection exceeds PointGrid bounds, or col/row inputs are wrong.");

    }

    this.draw = draw(this.points);

  }

}
