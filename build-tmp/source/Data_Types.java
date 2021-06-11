import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.Vector; 
import java.util.*; 
import de.looksgood.ani.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class Data_Types extends PApplet {




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

public Point_Grid setWeights(double _weight, Point_Grid _pg) {
// Sets all weights in a given Point_Grid
// Where:
// _weight -> new weight (value between 0 and 1)
// _pg -> Point_Grid to affect
  
  _weight = clamp(_weight, 0, 1);
  Point_Grid result = new Point_Grid(_pg);
  
  Iterator<ArrayList<Grid_Point>> iter_x = result.points.iterator();
  Iterator<Grid_Point> iter_y;
  Grid_Point currPoint;
  
  while (iter_x.hasNext()) {
    iter_y = iter_x.next().iterator();
    while (iter_y.hasNext()) {
      currPoint = iter_y.next();
      currPoint.weight = _weight;
    }
  }
  
  return result;
  
}

public Point_Grid addToWeights(double _weight, Point_Grid _pg) {
// Adds a given number to all weights in a given Point_Grid
// Where:
// _weight -> amount to add (value between 0 and 1)
// _pg -> Point_Grid to affect
  
  Point_Grid result = new Point_Grid(_pg);
  
  Iterator<ArrayList<Grid_Point>> iter_x = result.points.iterator();
  Iterator<Grid_Point> iter_y;
  Grid_Point currPoint;
  
  while (iter_x.hasNext()) {
    iter_y = iter_x.next().iterator();
    while (iter_y.hasNext()) {
      currPoint = iter_y.next();
      currPoint.weight = clamp(currPoint.weight + _weight, 0, 1);
    }
  }
  
  return result;
  
}

public Point_Grid addToPositions(float _x, float _y, Point_Grid _pg) {
// Moves points in a grid by adding the provided values to X and Y coordinates, scaled according to each point's weight.
// Where:
// _x -> amount to add to GRID_POINT.x
// _y -> amount to add to GRID_POINT.y
// _pg -> Point_Grid to affect

  Point_Grid result = new Point_Grid(_pg);
  Grid_Point currpoint;
  
  for (int x = 0; x < _pg.x; x++) {
    for (int y = 0; y < _pg.y; y++) {
      currpoint = result.points.get(x).get(y);
      currpoint.x += _x * currpoint.weight;
      currpoint.y += _y * currpoint.weight;
    }
  }
  
  return result;
  
}

public Point_Grid addToPositions(float _x, float _y, Selection _s, Point_Grid _pg) {
// Moves points in a grid by adding the provided values to X and Y coordinates, scaled according to each point's weight.
// Incorporates a selection option.
// Where:
// _x -> amount to add to GRID_POINT.x
// _y -> amount to add to GRID_POINT.y
// _pg -> Point_Grid to affect
  
  Point_Grid result = new Point_Grid(_pg);
  Grid_Point currpoint;
  
  for (int x = _s.startCol; x <= _s.endCol; x++) {
    for (int y = _s.startRow; y <= _s.endRow; y++) {
      currpoint = result.points.get(x).get(y);
      currpoint.x += _x * currpoint.weight;
      currpoint.y += _y * currpoint.weight;
    }
  }
  
  return result;
  
}

public Point_Grid multPositions(float _x, float _y, Point_Grid _pg) {
// Moves points in a grid by multiplying the provided values to X and Y coordinates, scaled according to each point's weight.
// Where:
// _x -> amount to add to GRID_POINT.x
// _y -> amount to add to GRID_POINT.y
// _pg -> Point_Grid to affect
  
  Point_Grid result = new Point_Grid(_pg);
  Grid_Point currpoint;
  
  for (int x = 0; x < _pg.x; x++) {
    for (int y = 0; y < _pg.y; y++) {
      currpoint = result.points.get(x).get(y);
      currpoint.x *= _x * currpoint.weight;
      currpoint.y *= _y * currpoint.weight;
    }
  }
  
  return result;
  
}

public Point_Grid multPositions(float _x, float _y, Selection _s, Point_Grid _pg) {
// Moves points in a grid by multiplying the provided values to X and Y coordinates, scaled according to each point's weight.
// Incorporates a selection option.
// Where:
// _x -> amount to add to GRID_POINT.x
// _y -> amount to add to GRID_POINT.y
// _pg -> Point_Grid to affect
  
  Point_Grid result = new Point_Grid(_pg);
  Grid_Point currpoint;
  
  for (int x = _s.startCol; x <= _s.endCol; x++) {
    for (int y = _s.startRow; y <= _s.endRow; y++) {
      currpoint = result.points.get(x).get(y);
      currpoint.x *= _x * currpoint.weight;
      currpoint.y *= _y * currpoint.weight;
    }
  }
  
  return result;
  
}

public Point_Grid applyLinRadGradient_Slow (int _col, int _row, int _r, double _init_decay, double _sample_rate, boolean _inverse, boolean _blend, Point_Grid _pg) {
// Modifies weights of Grid_Points in a given Point_Grid according to a radial gradient, returns a new Point_Grid
// NOTE: This looks nicer, but is far more computationally expensive than applyRadialGradient given that it uses sqrt()
// in the underlying circle-plotting algo. Avoid using if possible.
// Where:
// _col, _row -> origin of gradient
// _r -> radius of gradient (i.e. extent of gradient effect)
// _init_decay -> initial weight value of gradient
// _sample_rate -> radius increment per cycle (think of this as sampling density, if there are empty points in gradient then reduce this number, NOT TOO FAR THOUGH).
// _inverse -> whether to invert the gradient
// _blend -> whether to add the gradient onto the previous Point_Grid or start anew
// _pg -> Point_Grid to affect.
  
  Point_Grid result = _inverse ? new Point_Grid(_pg) : new Point_Grid(_pg, true);
  
  float curr_rad = 0;
  int init_x = _col - _r;
  int fin_x = _col + _r;
  int curr_x = init_x;
  double curr_weight = _init_decay;
  double decay_factor = _r / _sample_rate;
  double decay = _init_decay / decay_factor;
  Tuple2<Integer, Integer> yVal;
  
  while (curr_rad <= _r) {
    
    while (curr_x <= fin_x) {
      
      yVal = plotCircle(curr_x, _col, _row, curr_rad);
      
      if (curr_x < _pg.x && curr_x > -1 && yVal.a < _pg.y && yVal.a > -1) { 
        result.points.get(curr_x).get(yVal.a).weight = curr_weight;
      }
      if (curr_x < _pg.x && curr_x > -1 && yVal.b < _pg.y && yVal.b > -1) { 
        result.points.get(curr_x).get(yVal.b).weight = curr_weight;
      }
      
      curr_x++;
      
    }
    
    curr_rad += _sample_rate;
    curr_x = init_x;
    curr_weight = _inverse ? curr_weight + decay : curr_weight - decay;
    curr_weight = clamp(curr_weight, 0.0f, 1.0f);
    
  }
  
  if (_blend) result = addGridWeights(_pg, result);
  return result;
  
}

public Point_Grid applyLinRadGradient(int _col, int _row, int _rad, double _init_weight, boolean _inverse, boolean _blend, Point_Grid _pg) {
// Modifies weights of Grid_Points in a given Point_Grid according to a radial gradient, returns a new Point_Grid
// uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
// Where:
// _col, _row -> origin of gradient
// _rad -> radius of gradient (i.e. extent of gradient effect)
// _init_weight -> initial weight value for gradient
// _inverse -> whether to invert the gradient
// _blend -> whether to add the gradient onto the previous Point_Grid or start anew
// _pg -> Point_Grid to affect

  Point_Grid grid_result = _inverse ? new Point_Grid(_pg) : new Point_Grid(_pg, true);
  
  int curr_rad = 0; int inner_rad = 0;
  double curr_weight = _init_weight;
  double decay = _init_weight / _rad;
  
  if (_col > -1 && _col < _pg.x && _row > -1 && _row < _pg.y) { // Avoid drawing when out of bounds
    grid_result.points.get(_col).get(_row).weight = curr_weight;  // Set first point (algo skips it)
  }
  
  while (curr_rad <= _rad) {
    inner_rad = curr_rad; // Necessary seeing as inner loop modifies radius value.
    int x = -curr_rad;
    int y = 0;
    int err = 2-2*curr_rad;
    print("Curr Rad: ", curr_rad, " Curr _rad: ", _rad);
    
    while (x < 0) {
      if (_col-x < _pg.x && _col-x > -1 && _row+y < _pg.y && _row+y > -1) { 
        grid_result.points.get(_col-x).get(_row+y).weight = curr_weight;
      }
      if (_col-y > -1 && _col-y < _pg.x && _row-x < _pg.y && _row-x > -1) {
        grid_result.points.get(_col-y).get(_row-x).weight = curr_weight;
      }
      if (_col+x > -1 && _col+x < _pg.x && _row-y > -1 && _row-y < _pg.y) {
        grid_result.points.get(_col+x).get(_row-y).weight = curr_weight;
      }
      if (_col+y < _pg.x && _col+y > -1 && _row+x > -1 && _row+x < _pg.y) {
        grid_result.points.get(_col+y).get(_row+x).weight = curr_weight;
      }
      inner_rad = err;
      if (inner_rad <= 0) {
        y += 1;
        err += 2*y + 1;
      }
      if (inner_rad > 0) {
        x += 1;
        err += 2*x + 1;
      }
    }
    
    curr_rad += 1;
    curr_weight = _inverse ? curr_weight + decay : curr_weight - decay;
    curr_weight = clamp(curr_weight, 0.0f, 1.0f);
    
  }
  
  if (_blend) grid_result = addGridWeights(_pg, grid_result);
  return grid_result;
  
}

public Point_Grid applySmoothRadGradient(int _col, int _row, int _rad, double _init_weight, boolean _inverse, boolean _blend, Point_Grid _pg) {
// Modifies weights of Grid_Points in a given Point_Grid according to a radial gradient, using an in-out-easing function. Returns a new Point_Grid
// uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
// Where:
// _col, _row -> origin of gradient
// _rad -> radius of gradient (i.e. extent of gradient effect)
// _init_weight -> initial weight value for gradient
// _inverse -> whether to invert the gradient
// _blend -> whether to add the gradient onto the previous Point_Grid or start anew
// _pg -> Point_Grid to affect

  Point_Grid grid_result = _inverse ? new Point_Grid(_pg) : new Point_Grid(_pg, true);
  
  int curr_rad = 0; int inner_rad = 0;
  double curr_weight = _init_weight;
  
  if (_col > -1 && _col < _pg.x && _row > -1 && _row < _pg.y) { // Avoid drawing when out of bounds
    grid_result.points.get(_col).get(_row).weight = curr_weight;  // Set first point (algo skips it)
  }
  
  while (curr_rad <= _rad) {
    inner_rad = curr_rad; // Necessary seeing as inner loop modifies radius value.
    int x = -curr_rad;
    int y = 0;
    int err = 2-2*curr_rad;
    
    while (x < 0) {
      if (_col-x < _pg.x && _col-x > -1 && _row+y < _pg.y && _row+y > -1) { 
        grid_result.points.get(_col-x).get(_row+y).weight = curr_weight;
      }
      if (_col-y > -1 && _col-y < _pg.x && _row-x < _pg.y && _row-x > -1) {
        grid_result.points.get(_col-y).get(_row-x).weight = curr_weight;
      }
      if (_col+x > -1 && _col+x < _pg.x && _row-y > -1 && _row-y < _pg.y) {
        grid_result.points.get(_col+x).get(_row-y).weight = curr_weight;
      }
      if (_col+y < _pg.x && _col+y > -1 && _row+x > -1 && _row+x < _pg.y) {
        grid_result.points.get(_col+y).get(_row+x).weight = curr_weight;
      }
      inner_rad = err;
      if (inner_rad <= 0) {
        y += 1;
        err += 2*y + 1;
      }
      if (inner_rad > 0) {
        x += 1;
        err += 2*x + 1;
      }
    }
    
    curr_rad += 1;
    
    curr_weight = _inverse ? easeInOutCubic((float)curr_rad, 0, (float)_init_weight, (float)_rad) : easeInOutCubic((float)curr_rad, (float)_init_weight, -(float)_init_weight, (float)_rad);
    curr_weight = clamp(curr_weight, 0.0f, 1.0f);
    
    
  }
  
  if (_blend) grid_result = addGridWeights(_pg, grid_result);
  return grid_result;
  
}

public Point_Grid applySmoothRadGradient_Slow(int _col, int _row, int _r, double _init_weight, double _sample_rate, boolean _inverse, boolean _blend, Point_Grid _pg) {
// Modifies weights of Grid_Points in a given Point_Grid according to a radial gradient, using an in-out easing function, returns a new Point_Grid
// NOTE: This looks nicer, but is far more computationally expensive than applyRadialGradient given that it uses sqrt()
// in the underlying circle-plotting algo. Avoid using if possible.
// Where
// _col, _row -> origin of gradient
// _r -> radius of gradient (i.e. extent of gradient effect)
// _init_weight -> initial weight value of gradient
// _sample_rate -> radius increment per cycle (think of this as sampling density, if there are empty points in gradient then reduce this number, NOT TOO FAR THOUGH).
// _inverse -> whether to invert the gradient
// _blend -> whether to allow blending with previous weights (otherwise gradient overrides previous weights)
// _pg -> Point_Grid to affect.
  
  //Point_Grid result = _inverse ? new Point_Grid(_pg) : new Point_Grid(_pg);
  Point_Grid result = new Point_Grid(_pg);
  
  float curr_rad = 0;
  int init_x = _col - _r;
  int fin_x = _col + _r;
  int curr_x = init_x;
  double curr_weight = _init_weight;
  Tuple2<Integer, Integer> yVal;
  
  while (curr_rad <= _r) {
    
    while (curr_x <= fin_x) {
      
      yVal = plotCircle(curr_x, _col, _row, curr_rad);
      
      if (curr_x < _pg.x && curr_x > -1 && yVal.a < _pg.y && yVal.a > -1) {
        result.points.get(curr_x).get(yVal.a).weight = curr_weight;
      }
      if (curr_x < _pg.x && curr_x > -1 && yVal.b < _pg.y && yVal.b > -1) { 
        result.points.get(curr_x).get(yVal.b).weight = curr_weight;
      }
      
      curr_x++;
      
    }
    
    curr_rad += _sample_rate;
    curr_x = init_x;
    curr_weight = _inverse ? easeInOutCubic((float)curr_rad, 0, (float)_init_weight, (float)_r) : easeInOutCubic((float)curr_rad, (float)_init_weight, -(float)_init_weight, (float)_r);
    curr_weight = clamp(curr_weight, 0.0f, 1.0f);
    
  }
  
  if (_blend) result = addGridWeights(_pg, result);
  return result;
  
}

public Point_Grid applySinRadGradient(int _col, int _row, int _rad, double _init_weight, double _freq, double _shift, boolean _inverse, boolean _blend, Point_Grid _pg) {
// Modifies weights of Grid_Points in a given Point_Grid according to a radial gradient, using an in-out-easing function. Returns a new Point_Grid
// uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
// Where:
// _col, _row -> origin of gradient
// _rad -> radius of gradient (i.e. extent of gradient effect)
// _init_weight -> initial weight value for gradient
// _inverse -> whether to invert the gradient
// _blend -> whether to add the gradient onto the previous Point_Grid or start anew
// _pg -> Point_Grid to affect

  Point_Grid grid_result = _inverse ? new Point_Grid(_pg) : new Point_Grid(_pg, true);
  
  int curr_rad = 0; int inner_rad = 0;
  double curr_weight = _init_weight;
  
  if (_col > -1 && _col < _pg.x && _row > -1 && _row < _pg.y) { // Avoid drawing when out of bounds
    //grid_result.points.get(_col).get(_row).weight = curr_weight;  // Set first point (algo skips it)
  }
  
  while (curr_rad <= _rad) {
    inner_rad = curr_rad; // Necessary seeing as inner loop modifies radius value.
    int x = -curr_rad;
    int y = 0;
    int err = 2-2*curr_rad;
    
    while (x < 0) {
      if (_col-x < _pg.x && _col-x > -1 && _row+y < _pg.y && _row+y > -1) { 
        grid_result.points.get(_col-x).get(_row+y).weight = curr_weight;
      }
      if (_col-y > -1 && _col-y < _pg.x && _row-x < _pg.y && _row-x > -1) {
        grid_result.points.get(_col-y).get(_row-x).weight = curr_weight;
      }
      if (_col+x > -1 && _col+x < _pg.x && _row-y > -1 && _row-y < _pg.y) {
        grid_result.points.get(_col+x).get(_row-y).weight = curr_weight;
      }
      if (_col+y < _pg.x && _col+y > -1 && _row+x > -1 && _row+x < _pg.y) {
        grid_result.points.get(_col+y).get(_row+x).weight = curr_weight;
      }
      inner_rad = err;
      if (inner_rad <= 0) {
        y += 1;
        err += 2*y + 1;
      }
      if (inner_rad > 0) {
        x += 1;
        err += 2*x + 1;
      }
    }
    
    curr_rad += 1;
    curr_weight = sinMap((double)curr_rad, _freq, _shift);
    curr_weight = clamp(curr_weight, 0.0f, 1.0f);
  }
  
  if (_blend) grid_result = addGridWeights(_pg, grid_result);
  return grid_result;
}

public Point_Grid applySinRadGradient_Slow(int _col, int _row, int _r, double _init_weight, double _sample_rate, double _freq, double _shift, boolean _inverse, boolean _blend, Point_Grid _pg) {
// Modifies weights of Grid_Points in a given Point_Grid according to a radial gradient, using an in-out easing function, returns a new Point_Grid
// NOTE: This looks nicer, but is far more computationally expensive than applyRadialGradient given that it uses sqrt()
// in the underlying circle-plotting algo. Avoid using if possible.
// Where:
// _col, _row -> origin of gradient
// _r -> radius of gradient (i.e. extent of gradient effect)
// _init_weight -> initial weight value of gradient
// _sample_rate -> radius increment per cycle (think of this as sampling density, if there are empty points in gradient then reduce this number, NOT TOO FAR THOUGH).
// _inverse -> whether to invert the gradient
// _blend -> whether to allow blending with previous weights (otherwise gradient overrides previous weights)
// _pg -> Point_Grid to affect.
  
  //Point_Grid result = _inverse ? new Point_Grid(_pg) : new Point_Grid(_pg);
  Point_Grid result = new Point_Grid(_pg);
  
  float curr_rad = 0;
  int init_x = _col - _r;
  int fin_x = _col + _r;
  int curr_x = init_x;
  double curr_weight = _init_weight;
  Tuple2<Integer, Integer> yVal;
  
  while (curr_rad <= _r) {
    
    while (curr_x <= fin_x) {
      
      yVal = plotCircle(curr_x, _col, _row, curr_rad);
      
      if (curr_x < _pg.x && curr_x > -1 && yVal.a < _pg.y && yVal.a > -1) {
        result.points.get(curr_x).get(yVal.a).weight = curr_weight;
      }
      if (curr_x < _pg.x && curr_x > -1 && yVal.b < _pg.y && yVal.b > -1) { 
        result.points.get(curr_x).get(yVal.b).weight = curr_weight;
      }
      
      curr_x++;
      
    }
    
    curr_rad += _sample_rate;
    curr_x = init_x;
    curr_weight = sinMap((double)curr_rad, _freq, _shift);
    curr_weight = clamp(curr_weight, 0.0f, 1.0f);
    
  }
  
  if (_blend) result = addGridWeights(_pg, result);
  return result;
  
}

public Point_Grid applyPerlin(float _min, float _max, float _time, boolean _blend, Point_Grid _pg) {
// Apply weights to point in Point_Grid based on Perlin Noise.
// Perlin positions are taken from Grid_Points in Grid.
// Where:
// _min -> Min weight threshold
// _max -> Max weight threshold
// _time -> Time (Z-axis) factor for animating Perlin (takes values from 0.0 - 1.0);
// _blend -> Whether to blend weight with any previous weight present in Point_Grid
// _pg -> Point_Grid to sample from
  
  Point_Grid result = new Point_Grid(_pg);
  
  Iterator<ArrayList<Grid_Point>> iterX = result.points.iterator();
  Grid_Point currPoint;
  
  while (iterX.hasNext()) {
    Iterator<Grid_Point> iterY = iterX.next().iterator();
    while (iterY.hasNext()) {
      currPoint = iterY.next();
      result.points.get(currPoint.gridIndexX).get(currPoint.gridIndexY).weight = map(noise(currPoint.x, currPoint.y, _time), 0, 1, _min, _max); // Call Perlin Here
    }
  }
  
  if (_blend) result = addGridWeights(_pg, result);
  return result;
  
}

public Point_Grid applyRandom(boolean _blend, Point_Grid _pg) {
// Apply weights to point in Point_Grid based on Perlin Noise.
// Perlin positions are taken from Grid_Points in Grid.
// Where:
// _pg -> Point_Grid to sample from
// _min -> Min weight threshold
// _max -> Max weight threshold
// _time -> Time (Z-axis) factor for animating Perlin (takes values from 0.0 - 1.0);
  
  Point_Grid result = new Point_Grid(_pg);
  
  Iterator<ArrayList<Grid_Point>> iterX = result.points.iterator();
  Grid_Point currPoint;
  
  while (iterX.hasNext()) {
    Iterator<Grid_Point> iterY = iterX.next().iterator();
    while (iterY.hasNext()) {
      currPoint = iterY.next();
      result.points.get(currPoint.gridIndexX).get(currPoint.gridIndexY).weight = random(0.0f, 1.0f);
    }
  }
  
  if (_blend) result = addGridWeights(_pg, result);
  return result;
  
}

public Point_Grid applyImage(PImage _img, String _mode, boolean _blend, Point_Grid _pg) {
// Loads an image and applies weights to Grid_Points in Point_Grid
// based on R, G, B, L (lightness) values or combinations thereof.
// Where:
// _file -> filename of image to load
// _scale -> scale the image to encompass full grid or load image at center of grid (no scale applied)
// _mode -> any of the following: "r", "g", "b", "l" (luma)
// _pg -> Point_Grid to apply to.
  
  Point_Grid result = new Point_Grid(_pg);
  PImage new_img;
  
  int grid_pixel_width = _pg.x * _pg.sX;
  int grid_pixel_height = _pg.y * _pg.sY;
    
  int sample_padding_X = abs((grid_pixel_width - _img.width)/2);
  int sample_padding_Y = abs((grid_pixel_height - _img.height)/2);
  
  if (_img.width > grid_pixel_width || _img.height > grid_pixel_height) {
    new_img = _img.get(sample_padding_X, sample_padding_Y, grid_pixel_width, grid_pixel_height);
    new_img.loadPixels();
    sample_padding_X = 0;
    sample_padding_Y = 0;
  } else {
    new_img = _img;
    new_img.loadPixels();
  }
 
  Grid_Point currPoint;
  int x, y, r, g, b;
  int currPixel;
  
  for (int x_g = 0; x_g < _pg.x; x_g++) {
      x = sample_padding_X + (x_g * _pg.sX);
    for (int y_g = 0; y_g < _pg.y; y_g++) {
      y = sample_padding_Y + (y_g * _pg.sY);
       currPixel = new_img.pixels[y*new_img.width+x];
       currPoint = result.points.get(x_g).get(y_g);
       r = (currPixel >> 16) & 0xFF;
       g = (currPixel >> 8) & 0xFF;
       b = currPixel & 0xFF;
       switch(_mode) {
         case("r"):
           currPoint.weight = map((float)r, 0, 255, 0, 1);
           break;
         case("g"):
           currPoint.weight = map((float)g, 0, 255, 0, 1);
           break;
         case("b"):
           print(currPixel, '\n');
           currPoint.weight = map((float)b, 0, 255, 0, 1);
           break; 
         case("l"):
           currPoint.weight = map(rgbToLuma(r, g, b), 0, 255, 0, 1);
           break;
       }
    } 
  }
  
  if (_blend) result = addGridWeights(_pg, result);
  return result;
 
}

// TODO: REDO THE WHOLE THING IN STANDARD OR VECTOR FORM -> SIMPLIFIES SLOPE, ETC
/*
// INT, INT, INT, INT, DOUBLE, DOUBLE, POINT_GRID -> POINT_GRID
// Modifies weights of Grid_Points in a given Point_Grid according to a linear gradient, returns a new Point_Grid
// Where:
// _col0, _row0 -> beginning of gradient line
// _col1, _ro1 -> end of gradient line
// _init_decay -> initial weight value for gradient
// _decay -> unit of decay per increase in perpendicular line offset (b)
// _pg -> Point_Grid to sample from
Point_Grid applyLinGradient(int _col0, int _row0, int _col1, int _row1, double _init_weight, double _decay, Point_Grid _pg) {
  //TODO: Figure out horizontal line checks
  //TODO: Refactor (helpers, etc.)
  //TODO: Remove duplicate checks
  Point_Grid result = new Point_Grid(_pg, true); // Create zero-weighted Grid
  
  // y = m(slope)x + b(intercept)
  // y = -1/m(inverse_slope) + b(intercept)

  double slope_guide =  (double)(_row1 - _row0) / (double)(_col1 - _col0);
  double inverse_slope = -1 / slope_guide;
  
  double p1_y_intercept = _row0 - inverse_slope * _col0; // NORMALIZE B_OFFSET SO WE DONT HAVE TO CHECK BELOW
  double p2_y_intercept = _row1 - inverse_slope * _col1;
  double limit_y_intercept = (_pg.y - 1) - inverse_slope * (_pg.x - 1);
  
  int x_col_limit = _pg.x - 1;
  int y_row_limit = _pg.y - 1;

  //double curr_offset = b_offset_1;
  double curr_intercept = p1_y_intercept > p2_y_intercept ? limit_y_intercept : 0;
  double sampling_intercept = p1_y_intercept > p2_y_intercept ? curr_intercept - 1 : curr_intercept + 1;

  double intercept_gradient_end = Math.max(p1_y_intercept, p2_y_intercept); // Create condition that encompasses both b1 > b2 && b1 < b2
  double intercept_gradient_begin = Math.min(p1_y_intercept, p2_y_intercept);
  double intercept_counter = 0;

  
  double curr_weight = _init_weight;

  while (intercept_counter <= intercept_gradient_end) {
    
    double y1, y2;
    int y1R, y2R;
    
    for (int x = 0; x <= x_col_limit; x++) {
     
      y1 = inverse_slope*x+curr_intercept;
      y2 = inverse_slope*x+sampling_intercept;
      
      y1R = slope_guide == 0 ? 0 : (int)Math.floor(Math.min(y1, y2)); // Check for 0 slope to avoid OOB.
      y2R = slope_guide == 0 ? y_row_limit: (int)Math.ceil(Math.max(y1, y2));
     
      if (y1R > -1 && y2R < y_row_limit) {
        for (int y = y1R; y <= y2R; y++) {
          
          if (intercept_counter >= intercept_gradient_begin) {
            result.points.get(x).get(y).weight = clamp(curr_weight, 0, 1);
          } else {
            result.points.get(x).get(y).weight = _init_weight;
          }
        }
      }
    }

    if (p1_y_intercept > p2_y_intercept) {
      curr_intercept--;
      sampling_intercept--;
    } else {
      curr_intercept++;
      sampling_intercept++;
    }  
    
    intercept_counter++;
    if (intercept_counter >= intercept_gradient_begin) {
      curr_weight -= _decay;
    }
  
  }
  
  return result;
  
}
*/

// IMPURE
// VECTOR[POINT] -> VOID
// Draws all points in a POINT Vector onto the window
// Where:
// _pv -> Vector to fetch points from
// _type -> Type of Processing object to draw (INT) [1: POINT, 2: CIRCLE, 3: RECT]
public void drawPointArray(ArrayList<Grid_Point> _pg, int type, boolean _display_weight) {
  
  int col;
  
  for (int i = 0; i < _pg.size(); i++) {
    
    if (_display_weight) {
      col = weightToRGB(_pg.get(i).weight);
      stroke(col);
      fill(col);
    } else {
      stroke(255);
      fill(255);
    }
    
      switch(type) {
         case 1:
           point(_pg.get(i).x, _pg.get(i).y);
           break;
         case 2:
           circle(_pg.get(i).x, _pg.get(i).y, 5);
           break;
          case 3:
           square(_pg.get(i).x, _pg.get(i).y, 5);
           break;
            
       }
    }
}

// IMPURE
// POINT_GRID -> VOID
// Draws all points of a POINT_GRID pg onto the window
// Where:
// pg -> Point_Grid to draw (POINT_GRID)
// type -> Type of Processing object to draw (INT) [1: POINT, 2: CIRCLE, 3: RECT]
public void drawPointGrid(Point_Grid _pg, int _type, boolean _display_weight) {
  
  for (int i = 0; i < _pg.points.size(); i++) {
    
    for (int y = 0; y < _pg.points.get(i).size(); y++) {
      
      if (_display_weight) {
        int col = weightToRGB(_pg.points.get(i).get(y).weight);
        stroke(col);
        fill(col);
      } else {
        stroke(255);
        fill(255);
      }
      
       switch(_type) {
         
         case 1:
           point(_pg.points.get(i).get(y).x, _pg.points.get(i).get(y).y);
           break;
         case 2:
           circle(_pg.points.get(i).get(y).x, _pg.points.get(i).get(y).y, 3);
           break;
          case 3:
           rectMode(CENTER);
           square(_pg.points.get(i).get(y).x, _pg.points.get(i).get(y).y, 5);
           break;
            
       }
    }
  }
}
// INT, INT, POINT_GRID -> POINT
// Fetches a POINT from a POINT_GRID
// Where:
// _col -> column index of desired point
// _row -> row index of desired point
public Grid_Point getPoint(int _col, int _row, Point_Grid _pg) {
  _col = Math.floorMod(_col, _pg.x);
  _row = Math.floorMod(_row, _pg.y);
  
  return _pg.points.get(_col).get(_row);
}

public Grid_Point getPointSafe(int _col, int _row, Point_Grid _pg) {
  if (_col > _pg.x - 1 || _row > _pg.y - 1 || _col < 0 || _row < 0) {
    throw new java.lang.RuntimeException("Unsafe Point");
  } else {
    return _pg.points.get(_col).get(_row);
  }
  
}

// POINT_GRID, INT -> VECTOR[POINT]
// Fetches a column of POINTs from a POINT_GRID
// Where:
// _pg -> POINT_GRID to fetch from (POINT_GRID)
// _index -> column to grab
public ArrayList<Grid_Point> getColumnByIndex(Point_Grid _pg, int _index) {
  
  ArrayList<Grid_Point> result = _pg.points.get(_index);
  return result;
  
}

// POINT_GRID, INT -> VECTOR[POINT]
// Fetches a row of POINTs from a POINT_GRID
// Where:
// _pg -> POINT_GRID to fetch from (POINT_GRID)
// _index -> row to grab
public ArrayList<Grid_Point> getRowByIndex(Point_Grid _pg, int _index) {
  
  ArrayList<Grid_Point> result = new ArrayList<Grid_Point> ();
  
  for (int i = 0; i < _pg.points.size(); i++) {
    result.add(_pg.points.get(i).get(_index));
  }
  
  return result;
}

// INT, INT, POINT_GRID -> POINT
// Fetches a vertically and horizontally symmetrical POINT based on a source POINT and POINT_GRID
// Where:
// _col -> column index of source point
// _row -> row index of source point
// _pg -> POINT_GRID to fetch from
public Grid_Point getOppositePoint(int _col, int _row, Point_Grid _pg){
  
  int grid_width = _pg.x - 1;
  int grid_height = _pg.y - 1;
  int opposite_x = grid_width - _col;
  int opposite_y = grid_height - _row;
  
  return getPoint(opposite_x, opposite_y, _pg);
  
}

// INT, POINT_GRID -> POINT 
// Fetches a vertically symmetrical POINT based on a source POINT and POINT_GRID
// Where:
// _col -> column index of source point
// _row -> row index of source point
// _pg -> POINT_GRID to fetch from
public Grid_Point getOppositePointVert(int _col, int _row, Point_Grid _pg) {
  
  int grid_height = _pg.y - 1;
  int opposite_y = grid_height - _row;
  
  return getPoint(_col, opposite_y, _pg);
  
}

// INT, POINT_GRID -> POINT 
// Fetches a horizontally symmetrical POINT based on a source POINT and POINT_GRID
// Where:
// _col -> column index of source point
// _row -> row index of source point
// _pg -> POINT_GRID to fetch from
public Grid_Point getOppositePointHor(int _col, int _row, Point_Grid _pg) {
  
  int grid_width = _pg.x - 1;
  int opposite_x = grid_width - _col;
  
  return getPoint(opposite_x, _row, _pg);
  
}

// IMPURE
// INT, INT, INT, INT, POINT_GRID -> VECTOR<GRID_POINT>
// fetches points on grid according to line given by (_col0, _row0), (_col1, _row1)
// uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
// Where:
// _col0, _row0 -> start point of line (by col and row index of POINT_GRID)
// _col1, _row1 -> end point of line (by col and row index of POINT_GRID)
// _pg -> POINT_GRID to sample from
public ArrayList<Grid_Point> getLine(int _col0, int _row0, int _col1, int _row1, Point_Grid _pg) {
  
  ArrayList<Grid_Point> result = new ArrayList<Grid_Point>();
  int dx = abs(_col1 - _col0);
  int dy = -abs(_row1 - _row0);
  int sx = _col0 < _col1 ? 1 : -1;
  int sy = _row0 < _row1 ? 1 : -1;
  int err = dx + dy, e2;
  
  while (true) {
    if (checkBounds(_col0, _row0, _col1, _row1, _pg)) { // Make sure we're not out of bounds.
      result.add(getPoint(_col0, _row0, _pg));
    }
    e2 = 2 * err;
    if (e2 >= dy) {
      if (_col0 == _col1);
      err += dy; _col0 += sx;
    }
    if (e2 <= dx) {
      if (_row0 == _row1) break;
      err += dx; _row0 += sy;
    }
  }
  
  return result;
  
}

// IMPURE
// INT, INT, INT, INT, POINT_GRID -> VECTOR<GRID_POINT>
// fetches points on grid according to line given by (_col0, _row0), (_col1, _row1)
// instead of an optimized algorithm, uses a non-optimized slope-intercept based method.
// Where:
// _col0, _row0 -> start point of line (by col and row index of POINT_GRID)
// _col1, _row1 -> end point of line (by col and row index of POINT_GRID)
// _pg -> POINT_GRID to sample from
public ArrayList<Grid_Point> getLine_No_Op(int _col0, int _row0, int _col1, int _row1, Point_Grid _pg) {
  
  ArrayList<Grid_Point> result = new ArrayList<Grid_Point>();
  
  boolean dir = _col0 < _col1;
  int start_x = dir ? _col0 : _col1;
  int start_y = dir ? _row0 : _row1;
  int end_x = dir ? _col1 : _col0;
  int end_y = dir ? _row1 : _row0;
  float slope = (float)(end_y - start_y) / (float)(end_x - start_x);
  float offset = start_y - slope*start_x;
  float y;
  
  while (start_x++ != end_x) {
    y = slope*start_x + offset;
    result.add(_pg.points.get(start_x).get((int)y));
  }
  
  return result;
  
}

// IMPURE
// INT, INT, INT, PG -> VECTOR<GRID_POINT>
// fetches points on grid according to circle with center (_col, _row) and radius (_rad)
// uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
// Where:
// _col, _row -> center of circle
// _rad -> radius of circle
// _pg -> POINT_GRID to sample from
public ArrayList<Grid_Point> getCircle(int _col, int _row, int _rad, Point_Grid _pg) {
  
  ArrayList<Grid_Point> result = new ArrayList<Grid_Point>();
  
    int x = -_rad;
    int y = 0;
    int err = 2-2*_rad;
    
    while (x < 0) {
      if (_col-x < _pg.x && _col-x > -1 && _row+y < _pg.y && _row+y > -1) { // Same as with line (out of bounds checks).
        result.add(getPoint(_col-x, _row+y, _pg));
      }
      if (_col-y > -1 && _col-y < _pg.x && _row-x < _pg.y && _row-x > -1) {
        result.add(getPoint(_col-y, _row-x, _pg));
      }
      if (_col+x > -1 && _col+x < _pg.x && _row-y > -1 && _row-y < _pg.y) {
        result.add(getPoint(_col+x, _row-y, _pg));
      }
      if (_col+y < _pg.x && _col+y > -1 && _row+x > -1 && _row+x < _pg.y) {
        result.add(getPoint(_col+y, _row+x, _pg));
      }
      _rad = err;
      if (_rad <= y) {
        y += 1;
        err += y*2+1;
      }
      if (_rad > x || err > y) {
        x += 1;
        err += x*2+1;
      }
    }
  
  return result;
  
}

// IMPURE
// INT, INT, LIST<INT>, INT, BOOL, POINT_GRID -> VECTOR<GRID_POINT>
// fetches points according to a list of directions (explained below) for a certain number of iterations
// Where:
// _col, _row -> origin of pattern
// _dlist -> list of steps to take, where: 0:top, 1:top-right, 2:right, 3:bottom-right, etc.
// _reps -> number of steps to take (from 0, where none are taken, to ...)
// _overflow -> allow for pattern to wrap around edges (if a similar point is found, pattern will break regardless of reps)
// _pg -> point grid to sample from
public ArrayList<Grid_Point> getPattern(int _col, int _row, List<Integer> _dlist, int _reps, boolean _overflow, Point_Grid _pg) {
  
  Set<Grid_Point> temp_result = new HashSet<Grid_Point>(); // Consider just checking ArrayList for duplicates
  
  Grid_Point currentPoint = new Grid_Point(getPoint(_col, _row, _pg));
  int step = 0;
  int pointer = 0;
  int mod = _dlist.size();
  
  while (step < _reps) {
    if (temp_result.contains(currentPoint) || currentPoint == null) break;
    temp_result.add(new Grid_Point(currentPoint));
    
    pointer = step % mod;
    //print(_dlist.get(pointer));
    
    switch(_dlist.get(pointer)) {
      case 0:
        currentPoint = _overflow ? getPoint(currentPoint.gridIndexX, currentPoint.gridIndexY - 1, _pg) : getPointSafe(currentPoint.gridIndexX, currentPoint.gridIndexY - 1, _pg);
        break;
      case 1:
        currentPoint = _overflow ? getPoint(currentPoint.gridIndexX + 1, currentPoint.gridIndexY - 1, _pg) : getPointSafe(currentPoint.gridIndexX + 1, currentPoint.gridIndexY - 1, _pg);
        break;
      case 2:
        currentPoint = _overflow ? getPoint(currentPoint.gridIndexX + 1, currentPoint.gridIndexY, _pg) : getPointSafe(currentPoint.gridIndexX + 1, currentPoint.gridIndexY, _pg);
        break;
      case 3:
        currentPoint = _overflow ? getPoint(currentPoint.gridIndexX + 1, currentPoint.gridIndexY + 1, _pg) : getPointSafe(currentPoint.gridIndexX + 1, currentPoint.gridIndexY + 1, _pg);
        break;
      case 4:
        currentPoint = _overflow ? getPoint(currentPoint.gridIndexX, currentPoint.gridIndexY + 1, _pg) : getPointSafe(currentPoint.gridIndexX, currentPoint.gridIndexY + 1, _pg);
        break;
      case 5:
        currentPoint = _overflow ? getPoint(currentPoint.gridIndexX - 1, currentPoint.gridIndexY + 1, _pg) : getPointSafe(currentPoint.gridIndexX - 1, currentPoint.gridIndexY + 1, _pg);
        break;
      case 6:
        currentPoint = _overflow ? getPoint(currentPoint.gridIndexX - 1, currentPoint.gridIndexY, _pg) : getPointSafe(currentPoint.gridIndexX - 1, currentPoint.gridIndexY, _pg);
        break;
      case 7:
        currentPoint = _overflow ? getPoint(currentPoint.gridIndexX - 1, currentPoint.gridIndexY - 1, _pg) : getPointSafe(currentPoint.gridIndexX - 1, currentPoint.gridIndexY - 1, _pg);
        break;
    }
    
    step += 1;
    
  }
  
  ArrayList<Grid_Point> result = new ArrayList<Grid_Point>(temp_result.size());
  Iterator<Grid_Point> it = temp_result.iterator();
  
  while (it.hasNext()) {
    result.add(it.next());
  }
  
  return result;
  
}

// Returns a selection of points based on an application of perlin noise
// weights onto Grid_Points in a given Point_Grid, and a threshold to select from
// Where:
// _low: bottom cutoff for weight
// _high: top cutoff for weight
// _pg: Point_Grid to sample from
public ArrayList<Grid_Point> getPerlin(double _low, double _high, Point_Grid _pg) {
  
  ArrayList<Grid_Point> result = new ArrayList<Grid_Point>();
  Point_Grid mod_grid = new Point_Grid(_pg);
  
  mod_grid = applyPerlin(0, 1, 0, false, mod_grid);
 
  Iterator<ArrayList<Grid_Point>> iter_x = mod_grid.points.iterator();
  Grid_Point currPoint;
  
  while (iter_x.hasNext()) {
    Iterator<Grid_Point> iter_y = iter_x.next().iterator();
    while (iter_y.hasNext()) {
      currPoint = iter_y.next();
      if (currPoint.weight > _low && currPoint.weight < _high) {
        result.add(currPoint);
      }
    }
  }
  
  return result;
  
}

// Returns a selection of points based on a random application of
// weights onto Grid_Points in a given Point_Grid, and a threshold to select from
// Where:
// _low: bottom cutoff for weight
// _high: top cutoff for weight
// _pg: Point_Grid to sample from
public ArrayList<Grid_Point> getRandom(double _low, double _high, Point_Grid _pg) {
  
  ArrayList<Grid_Point> result = new ArrayList<Grid_Point>();
  Point_Grid mod_grid = new Point_Grid(_pg);
  
  mod_grid = applyRandom(false, mod_grid);
 
  Iterator<ArrayList<Grid_Point>> iter_x = mod_grid.points.iterator();
  Grid_Point currPoint;
  
  while (iter_x.hasNext()) {
    Iterator<Grid_Point> iter_y = iter_x.next().iterator();
    while (iter_y.hasNext()) {
      currPoint = iter_y.next();
      if (currPoint.weight > _low && currPoint.weight < _high) {
        result.add(currPoint);
      }
    }
  }
  
  return result;
  
}

// Returns a selection of points based on a threshold filter applied to weights
// of Grid_Points in a given Point_Grid
// Where:
// _low: bottom cutoff for weight
// _high: top cutoff for weight
// _pg: Point_Grid to sample from
public ArrayList<Grid_Point> getThreshold(double _low, double _high, Point_Grid _pg) {
  
  ArrayList<Grid_Point> result = new ArrayList<Grid_Point>();
 
  Iterator<ArrayList<Grid_Point>> iter_x = _pg.points.iterator();
  Grid_Point currPoint;
  
  while (iter_x.hasNext()) {
    Iterator<Grid_Point> iter_y = iter_x.next().iterator();
    while (iter_y.hasNext()) {
      currPoint = iter_y.next();
      if (currPoint.weight > _low && currPoint.weight < _high) {
        result.add(currPoint);
      }
    }
  }
  
  return result;
  
}
// TODO: Fix likely horrible precision errors here.
// DOUBLE -> INT
// Maps alpha values (1.00 - 0.00) to std RGB vals (255-0)
// Where:
// _in -> alpha value to map
// _out -> resulting RGB scale value
public int weightToRGB(double _in) {
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
public Tuple2<Integer, Integer> plotCircle(int _x, int _centerX, int _centerY, float _r) {
  
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
public int plotCircleTop(int _x, int _centerX, int _centerY, float _r) {
  
  return (int)sqrt(sq(_r) - sq(_x-_centerX)) + _centerY;
  
}

// INT, INT, INT, FLOAT -> INT
// Returns the negative Y value corresponding to a given X of a desired circle.
// NOTE: Avoid use if possible (function uses sqrt).
// Where:
// _x -> x value to apply f(x)
// _centerX, _centerY -> center of desired circle
// _r -> radius of desired circle
public int plotCircleBottom(int _x, int _centerX, int _centerY, float _r) {
  
  return -(int)sqrt(sq(_r) - sq(_x-_centerX)) + _centerY;
  
}

// INT, INT, INT, INT, POINT_GRID -> BOOLEAN
// Checks whether the given row and column values exceed the number of columns and rows in a POINT_GRID
// Where:
// _col0, _row0 -> initial col and row values
// _col1, _row1 -> final col and row values
// _pg -> Point_Grid against which to check
public boolean checkBounds(int _col0, int _row0, int _col1, int _row1, Point_Grid _pg) {
  return checkRowBounds(_row0, _pg) && checkRowBounds(_row1, _pg) && checkColBounds(_col0, _pg) && checkColBounds(_col1, _pg);
}

// INT, POINT_GRID -> BOOLEAN
// Checks whether the given row exceeds the bounds of the given POINT_GRID
// Where:
// _row -> row value to check
// _pg -> Point_Grid against which to check
public boolean checkRowBounds(int _row, Point_Grid _pg) {
  return _row > -1 && _row < _pg.y;
}

// INT, POINT_GRID -> BOOLEAN
// Checks whether the given column exceeds the bounds of the given POINT_GRID
// Where:
// _col -> col value to check
// _pg -> Point_Grid against which to check
public boolean checkColBounds(int _col, Point_Grid _pg) {
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
public float easeInOutCubic (float _x, float _begin, float _change, float _duration) {
  if ((_x/=_duration/2) < 1) return _change/2*_x*_x*_x + _begin;
  return _change/2*((_x-=2)*_x*_x + 2) + _begin;
}

// POINT_GRID -> ARRAYLIST<ARRAYLIST<GRID_POINT>>
// Deep clones points from a given Point_Grid into a new ArrayList.
// Used to avoid shallow copies.
// Where:
// _pg -> Point_Grid to copy from
public ArrayList<ArrayList<Grid_Point>> clonePoints(Point_Grid _pg) {
  
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
public Point_Grid addGridWeights(Point_Grid _pg1, Point_Grid _pg2) {
  
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
public Point_Grid subtractGridWeights(Point_Grid _pg1, Point_Grid _pg2) {
  
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
public int rgbToLuma(int _r, int _g, int _b) {
  return (_r+_r+_r+_b+_g+_g+_g+_g)>>3;
}

// DOUBLE, DOUBLE, DOUBLE -> DOUBLE
// A sin function, returns a value between 1 and -1.
// Where:
// _x -> input value to map
// _amp -> amplitude of function
// _freq -> frequency of function
// _shift -> x-axis shift of function
public double sinMap(double _x, double _freq, double _shift) {
  return sin((float)(_freq*_x - _freq*_shift));
}

int grid_width = 200;
int grid_height = 150;



Point_Grid grid;
Point_Grid base_grid;
ArrayList<Grid_Point> perlin_list;
ArrayList<Grid_Point> pattern_list;
ArrayList<Grid_Point> pattern_list_2;
ArrayList<Grid_Point> pattern_list_3;
ArrayList<Grid_Point> circle;
Selection top, bottom;

AniSequence seq;

public void settings() {
  size(1980, 1080);
  fullScreen(1);
  Point grid_center = new Point(width/2, height/2);
  grid = new Point_Grid(grid_width, grid_height, grid_center, 10, 5);
  base_grid = new Point_Grid(grid, true);
   top = new Selection(0, 0, base_grid.x - 1, (base_grid.y - 1) / 2, base_grid);
   bottom = new Selection(0, (base_grid.y) / 2, base_grid.x - 1, base_grid.y - 1, base_grid);
  //base_grid = applySmoothRadGradient_Slow((base_grid.x - 1) / 2, (base_grid.y - 1) / 2, 50, 1, 0.1, false, false, base_grid);
  //base_grid = addToPositions(0, 70, top, base_grid);
  //base_grid = addToPositions(0, -70, bottom, base_grid);
    
}

public void setup() {
  
  frameRate(24);
}

int counter = 0;
float perlin_counter = 0;
int time = 0;
int time_x, time_y;

public void draw() {
  background(0);
  stroke(255);
 
  //pattern = getLine_No_Op(5, 2, 15, 20, grid);
  counter += 1;
  time_x = counter % base_grid.x;
  time_y = counter % base_grid.y;
  int stepper = counter*8 ;
  
  base_grid = applySinRadGradient((base_grid.x - 1) / 2, (base_grid.y - 1) / 2, 120, 1, 0.1f, counter, false, false, grid);
  //base_grid = applyPerlin(0, 0.2, counter, true, base_grid);
  base_grid = addToPositions(0, 70, top, base_grid);
  base_grid = addToPositions(0, -70, bottom, base_grid);
  
  
  //pattern_list = getPattern(0, time_y, Arrays.asList(2, 4, 4, 2), stepper, true, base_grid);  
  pattern_list_2 = getPattern(time_x, 0, Arrays.asList(4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2), stepper, true, base_grid);
  //pattern_list_3 = getPattern(0, time_y, Arrays.asList(2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 6, 6, 6, 6, 6, 4, 4, 4), stepper, true, base_grid);  
  circle = getCircle(base_grid.x / 2, base_grid.y / 2, time_x, base_grid);
 
  
  //base_grid = setWeights(1, base_grid);
  //drawPointGrid(base_grid, 2, true);
  //drawPointArray(pattern_list, 2, false);
  drawPointArray(pattern_list_2, 3, true);
  //drawPointArray(pattern_list_3, 3, true);
  //drawPointArray(circle, 2, true);
 
}
/* SETTINGS

  size(1980, 1080);
  fullScreen(1);
  Point grid_center = new Point(width/2, height/2);
  grid = new Point_Grid(grid_width, grid_height, grid_center, 10, 5);
  base_grid = new Point_Grid(grid, true);
  top = new Selection(0, 0, base_grid.x - 1, (base_grid.y - 1) / 2, base_grid);
  bottom = new Selection(0, (base_grid.y) / 2, base_grid.x - 1, base_grid.y - 1, base_grid);
   
*/

/* DRAW

  counter += 1;
  time_x = counter % base_grid.x;
  time_y = counter % base_grid.y;
  int stepper = counter*2 ;
  
  base_grid = applySinRadGradient((base_grid.x - 1) / 2, (base_grid.y - 1) / 2, 120, 1, 0.1, counter, false, false, grid);
  base_grid = applyPerlin(0, 1, counter, true, base_grid);
  base_grid = addToPositions(0, 70, top, base_grid);
  base_grid = addToPositions(0, -70, bottom, base_grid);
  
  pattern_list_2 = getPattern(time_x, 0, Arrays.asList(4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2), stepper, true, base_grid);
  
  drawPointArray(pattern_list_2, 3, true);
  
*/

/* DRAW

  counter += 1;
  time_x = counter % base_grid.x;
  time_y = counter % base_grid.y;
  int stepper = counter*8 ;
  
  base_grid = applySinRadGradient((base_grid.x - 1) / 2, (base_grid.y - 1) / 2, 120, 1, 0.1, counter, false, false, grid);
  base_grid = applyPerlin(0, 0.2, counter, true, base_grid);
  base_grid = addToPositions(0, 70, top, base_grid);
  base_grid = addToPositions(0, -70, bottom, base_grid);
  
  pattern_list_3 = getPattern(0, time_y, Arrays.asList(2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 6, 6, 6, 6, 6, 4, 4, 4), stepper, true, base_grid);  
 
  drawPointArray(pattern_list_3, 3, true);
  
*/
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "Data_Types" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
