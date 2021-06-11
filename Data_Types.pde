import java.util.Vector;
import java.util.*;

public class Tuple2<X, Y> { 
// a TUPLE2 is a data structure
// TUPLE2 ( a: ANY, b: ANY)
// interp: a TUPLE2 is used to hold two values.
// use when POINT is not strictly necessary.

  public X a; 
  public Y b; 
  public Tuple2(X a, Y b) { 
    this.a = a; 
    this.b = b; 
  } 
}

public class Tuple3<X, Y, Z> { 
// a TUPLE3 is a data structure
// TUPLE3 ( a: ANY, b: ANY, c: ANY)
// interpretation: a TUPLE3 is used to hold three values.
// use when POINT is not strictly necessary.

  public  X a; 
  public  Y b; 
  public  Z c;
  public Tuple3(X a, Y b, Z c) { 
    this.a = a; 
    this.b = b; 
    this.c = c;
  } 
} 

public class Point {
// a POINT is a data structure
// POINT ( x: FLOAT, y: FLOAT, gridIndexX: INT, gridIndexY: INT ) 
// interp: a POINT represents a point in cartesian coords (as distinct from a GRID_POINT, which has a grid index position).
// x -> window coordinate X of point.
// y -> window coordinate Y of point.
// weight -> associated weight of point.

  public float x, y;
  public double weight;
  
  public Point (float _x, float _y) {
    x = _x; y = _y;
    weight = 1;
  }
  public Point (Point _p) {
    x = _p.x; y = _p.y;
    weight = _p.weight;
  }
  public Point (Grid_Point _p) {
    x = _p.x; y = _p.y;
    weight = _p.weight;
  }
  
}

public class Grid_Point extends Point {
// a GRID_POINT is a data structure
// GRID_POINT ( x: INT, y: INT, gridIndexX: INT, gridIndexY: INT )
// interpretation: a GRID_POINT represents a POINT acquired from a (belonging to) a GRID
// x -> window coordinate X of point.
// y -> window coordinate Y of point.
// gridIndexX -> if created as part of a POINT_GRID, COL index of said POINT_GRID
// gridIndexY -> if created as part of a POINT_GRID, ROW index of said POINT_GRID
// weight -> associated weight of point.

  public final int gridIndexX, gridIndexY;
  public double weight;
  
  public Grid_Point (int _x, int _y, int _ix, int _iy) {
    super(_x, _y);
    gridIndexX = _ix; 
    gridIndexY = _iy;
    weight = 1;
  }
  public Grid_Point (int _x, int _y, int _ix, int _iy, double _weight) {
    super(_x, _y);
    gridIndexX = _ix; 
    gridIndexY = _iy;
    weight = _weight;
  }
  public Grid_Point (Grid_Point _p) {
    super(_p.x, _p.y);
    gridIndexX = _p.gridIndexX; 
    gridIndexY = _p.gridIndexY;
    weight = _p.weight;
  }
  
}

public class Selection {
// A SELECTION is a data structure
// SELECTION ( col0: INT, row0: INT, col1: INT, row1: INT, pg: POINT_GRID)
// interpretation: a SELECTION represents a portion of a POINT_GRID that can be passed into
// certain functions to limit their effect to specific areas.
// startCol, startRow -> top-left corner of selection rectangle
// startRow, endRow -> bottom-right corner of selection rectangle
  
  public int startCol, endCol;
  public int startRow, endRow;
  
  public Selection (int _col0, int _row0, int _col1, int _row1, Point_Grid _pg) {
    
    if ( checkBounds(_col0, _row0, _col1, _row1, _pg) && _col0 <= _col1 && _row0 <= _row1 ) {
      startCol = _col0;
      startRow = _row0;
      endCol = _col1;
      endRow = _row1;
    } else {
      throw new java.lang.RuntimeException("Selection exceeds given Point_Grid bounds, or col/row inputs are wrong.");
    }
    
  }
  
}

public class Point_Grid {
// a POINT_GRID is a data structure
// a POINT_GRID contains a 2D collection of POINTs
// NOTE: 2D ArrayList is used to store points as opposed to Processing Core's flat array preference: performance difference was negligible vs code clarity gained.
// Where:
// x -> Number of POINTs in X axis (INT)
// y -> Number of POINTs in Y axis (INT)
// c -> Global center of GRID (POINT)
// sX -> Spacing between POINTs in X axis (INT)
// sY -> Spacing between POINTs in Y axis (INT)

  public final int x, y, sX, sY;
  public int xOrigin, yOrigin; // Define the lowest X and Y coordinates for the grid system.
  public final Point c;
  public ArrayList<ArrayList<Grid_Point>> points;
  
  public Point_Grid(int _x, int _y, Point _c, int _sX, int _sY) { 
    x = _x;
    y = _y;
    c = _c;
    sX = _sX;
    sY = _sY;
    
    xOrigin = (int)_c.x - ((_x/2)*_sX);
    yOrigin = (int)_c.y - ((_y/2)*_sY);
    
    points = new ArrayList<ArrayList<Grid_Point>>();
    
    for (int i = 0; i < _x; i += 1) {
      int xPos = xOrigin + (i * _sX);
      points.add(new ArrayList<Grid_Point>());
      for (int j = 0; j < _y; j += 1) {
        int yPos = yOrigin + (j * _sY);
        points.get(i).add(new Grid_Point(xPos, yPos, i, j));
      }
    }
  }
  
  public Point_Grid (Point_Grid _pg) {
    x = _pg.x; y = _pg.y;
    c = new Point(_pg.c);
    sX = _pg.sX; sY = _pg.sY;
    
    xOrigin = _pg.xOrigin;
    yOrigin = _pg.yOrigin;
    
    points = clonePoints(_pg);
  }
  
  public Point_Grid (Point_Grid _pg, ArrayList<ArrayList<Grid_Point>> _al) {
    c = new Point(_pg.c);
    sX = _pg.sX; sY = _pg.sY;
    
    xOrigin = _pg.xOrigin;
    yOrigin = _pg.yOrigin;
    
    points = new ArrayList<ArrayList<Grid_Point>>(_al);
    
    x = points.size(); y = points.get(0).size();
  }
  
  public Point_Grid (Point_Grid _pg, boolean _zeroWeight) { // Token override to create grid with zero weights.
    x = _pg.x; y = _pg.y;
    c = new Point(_pg.c);
    sX = _pg.sX; sY = _pg.sY;
    
    xOrigin = _pg.xOrigin;
    yOrigin = _pg.yOrigin;
    
    points = clonePoints(_pg);
    
    for (int i = 0; i < x; i += 1) {
      for (int j = 0; j < y; j += 1) {
        points.get(i).get(j).weight = 0;
      }
    }
  }
}
