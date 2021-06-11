/*
  A SELECTION is a data structure

  a SELECTION represents a portion of a POINT_GRID that can be passed into
  certain functions to limit their effect to specific areas.

  startCol, startRow -> top-left corner of selection rectangle
  startRow, endRow -> bottom-right corner of selection rectangle
 */

export default class Selection {

  constructor (colStart, rowStart, colEnd, rowEnd, pointGrid)
  {

    if ( checkBounds(colStart, rowStart, colEnd, rowEnd, pointGrid)
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

  }

}
