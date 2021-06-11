// TODO: Fix likely horrible precision errors here.
// DOUBLE -> INT
// Maps alpha values (1.00 - 0.00) to std RGB vals (255-0)
// Where:
// _in -> alpha value to map
// _out -> resulting RGB scale value
int weightToRGB(double _in) {
  float f_in = (float)_in;
  return (int)map(f_in, 0, 1, 0, 255);
}

// INT, INT, INT, FLOAT -> TUPLE2
// Returns a 2-value Tuple containing positive and negative Y values of a desired circle.
// NOTE: Avoid use if possible (function uses sqrt).
// Where:
// _x -> x value to apply f(x)
// _centerX, _centerY -> center of desired circle
// _r -> radius of desired circle
Tuple2<Integer, Integer> plotCircle(int _x, int _centerX, int _centerY, float _r) {
  
  int pos_y = plotCircleTop(_x, _centerX, _centerY, _r);
  int neg_y = -pos_y + (_centerY * 2);
  
  Tuple2<Integer, Integer> result = 
  new Tuple2<Integer, Integer>(
      pos_y, 
      neg_y
  );
  
  return result;
}

// INT, INT, INT, FLOAT -> INT
// Returns the positive Y value corresponding to a given X of a desired circle.
// NOTE: Avoid use if possible (function uses sqrt).
// Where:
// _x -> x value to apply f(x)
// _centerX, _centerY -> center of desired circle
// _r -> radius of desired circle
int plotCircleTop(int _x, int _centerX, int _centerY, float _r) {
  
  return (int)sqrt(sq(_r) - sq(_x-_centerX)) + _centerY;
  
}

// INT, INT, INT, FLOAT -> INT
// Returns the negative Y value corresponding to a given X of a desired circle.
// NOTE: Avoid use if possible (function uses sqrt).
// Where:
// _x -> x value to apply f(x)
// _centerX, _centerY -> center of desired circle
// _r -> radius of desired circle
int plotCircleBottom(int _x, int _centerX, int _centerY, float _r) {
  
  return -(int)sqrt(sq(_r) - sq(_x-_centerX)) + _centerY;
  
}

// INT, INT, INT, INT, POINT_GRID -> BOOLEAN
// Checks whether the given row and column values exceed the number of columns and rows in a POINT_GRID
// Where:
// _col0, _row0 -> initial col and row values
// _col1, _row1 -> final col and row values
// _pg -> Point_Grid against which to check
boolean checkBounds(int _col0, int _row0, int _col1, int _row1, Point_Grid _pg) {
  return checkRowBounds(_row0, _pg) && checkRowBounds(_row1, _pg) && checkColBounds(_col0, _pg) && checkColBounds(_col1, _pg);
}

// INT, POINT_GRID -> BOOLEAN
// Checks whether the given row exceeds the bounds of the given POINT_GRID
// Where:
// _row -> row value to check
// _pg -> Point_Grid against which to check
boolean checkRowBounds(int _row, Point_Grid _pg) {
  return _row > -1 && _row < _pg.y;
}

// INT, POINT_GRID -> BOOLEAN
// Checks whether the given column exceeds the bounds of the given POINT_GRID
// Where:
// _col -> col value to check
// _pg -> Point_Grid against which to check
boolean checkColBounds(int _col, Point_Grid _pg) {
  return _col > -1 && _col < _pg.x;
}

// DOUBLE, DOUBLE, DOUBLE -> DOUBLE
// Returns a value clamped to a given range.
// Where:
// val -> value to clamp
// min, max -> clamp range
public static double clamp(double val, double min, double max) {
    return Math.max(min, Math.min(max, val));
}

// INT, INT, INT -> INT
// Returns a value clamped to a given range.
// Where:
// val -> value to clamp
// min, max -> clamp range
public static int clamp(int val, int min, int max) {
    return Math.max(min, Math.min(max, val));
}

// FLOAT, FLOAT, FLOAT, FLOAT -> FLOAT
// Maps an x value to a y value using an in-out-cubic easing function
// Adapted from Robert Penner's Easing Functions
// Where:
// _x -> x value to map
// _begin -> beginning value
// _change -> change in value
// _duration -> duration or extent of function
float easeInOutCubic (float _x, float _begin, float _change, float _duration) {
  if ((_x/=_duration/2) < 1) return _change/2*_x*_x*_x + _begin;
  return _change/2*((_x-=2)*_x*_x + 2) + _begin;
}

// POINT_GRID -> ARRAYLIST<ARRAYLIST<GRID_POINT>>
// Deep clones points from a given Point_Grid into a new ArrayList.
// Used to avoid shallow copies.
// Where:
// _pg -> Point_Grid to copy from
ArrayList<ArrayList<Grid_Point>> clonePoints(Point_Grid _pg) {
  
  ArrayList<ArrayList<Grid_Point>> parent = new ArrayList<ArrayList<Grid_Point>>(_pg.y);
  Grid_Point currPoint;
  
  for (int x = 0; x < _pg.x; x++) {
    parent.add(new ArrayList<Grid_Point>(_pg.y));
    for (int y = 0; y < _pg.y; y++) {
      currPoint = _pg.points.get(x).get(y);
      parent.get(x).add(new Grid_Point(currPoint));
    }
  }
  
  return parent;
  
}

// POINT_GRID, POINT_GRID -> POINT_GRID
// Adds point weights, returns a new Point_Grid
// Where:
// _pg1 -> First Point_Grid to add
// _pg2 -> Second Point_Grid to add
Point_Grid addGridWeights(Point_Grid _pg1, Point_Grid _pg2) {
  
  int maxCol = Math.max(_pg1.x, _pg2.x);
  int maxRow = Math.max(_pg1.y, _pg2.y);
  int maxSpacingX = Math.max(_pg1.sX, _pg2.sY);
  int maxSpacingY = Math.max(_pg1.sY, _pg2.sY);
  float maxXCenter = Math.max(_pg1.c.x, _pg2.c.x);
  float maxYCenter = Math.max(_pg1.c.y, _pg2.c.y);
  
  Grid_Point currPoint;
  
  Point_Grid result = new Point_Grid(maxCol, maxRow, new Point(maxXCenter, maxYCenter), maxSpacingX, maxSpacingY);
  result = new Point_Grid(result, false);
  
  Iterator<ArrayList<Grid_Point>> it_pg1_x = _pg1.points.iterator();
  while (it_pg1_x.hasNext()) {
    Iterator<Grid_Point> it_pg1_y = it_pg1_x.next().iterator();
    while (it_pg1_y.hasNext()) {
      currPoint = it_pg1_y.next();
      result.points.get(currPoint.gridIndexX).get(currPoint.gridIndexY).weight = clamp(result.points.get(currPoint.gridIndexX).get(currPoint.gridIndexY).weight + currPoint.weight, 0, 1);
    }
  }
  
  Iterator<ArrayList<Grid_Point>> it_pg2_x = _pg2.points.iterator();
   while (it_pg2_x.hasNext()) {
    Iterator<Grid_Point> it_pg2_y = it_pg2_x.next().iterator();
    while (it_pg2_y.hasNext()) {
      currPoint = it_pg2_y.next();
      result.points.get(currPoint.gridIndexX).get(currPoint.gridIndexY).weight = clamp(result.points.get(currPoint.gridIndexX).get(currPoint.gridIndexY).weight + currPoint.weight, 0, 1);
    }
  }
  
  return result;
  
}  

// POINT_GRID, POINT_GRID -> POINT_GRID
// Subtracts point weights, returns a new Point_Grid
// Where:
// _pg1 -> Point_Grid to subtract from
// _pg2 -> Point_Grid to subtract with
Point_Grid subtractGridWeights(Point_Grid _pg1, Point_Grid _pg2) {
  
  Grid_Point currPoint;
  
  Point_Grid result = new Point_Grid(_pg1);
  
  Iterator<ArrayList<Grid_Point>> it_pg2_x = _pg2.points.iterator();
   while (it_pg2_x.hasNext()) {
    Iterator<Grid_Point> it_pg2_y = it_pg2_x.next().iterator();
    while (it_pg2_y.hasNext()) {
      currPoint = it_pg2_y.next();
      if (checkColBounds(currPoint.gridIndexX, _pg1) && checkRowBounds(currPoint.gridIndexY, _pg1)){
        result.points.get(currPoint.gridIndexX).get(currPoint.gridIndexY).weight = clamp(result.points.get(currPoint.gridIndexX).get(currPoint.gridIndexY).weight - currPoint.weight, 0, 1);
      }
    }
  }
  
  return result;
  
}  

// INT, INT, INT -> INT
// Approximate Luma value from RGB values, rough approximation (takes values of 0-255 and returns same range).
// Where:
// _r -> red channel
// _g -> green channel
// _b -> blue channel
int rgbToLuma(int _r, int _g, int _b) {
  return (_r+_r+_r+_b+_g+_g+_g+_g)>>3;
}

// DOUBLE, DOUBLE, DOUBLE -> DOUBLE
// A sin function, returns a value between 1 and -1.
// Where:
// _x -> input value to map
// _amp -> amplitude of function
// _freq -> frequency of function
// _shift -> x-axis shift of function
double sinMap(double _x, double _freq, double _shift) {
  return sin((float)(_freq*_x - _freq*_shift));
}
