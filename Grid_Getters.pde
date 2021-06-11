// INT, INT, POINT_GRID -> POINT
// Fetches a POINT from a POINT_GRID
// Where:
// _col -> column index of desired point
// _row -> row index of desired point
Grid_Point getPoint(int _col, int _row, Point_Grid _pg) {
  _col = Math.floorMod(_col, _pg.x);
  _row = Math.floorMod(_row, _pg.y);
  
  return _pg.points.get(_col).get(_row);
}

Grid_Point getPointSafe(int _col, int _row, Point_Grid _pg) {
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
ArrayList<Grid_Point> getColumnByIndex(Point_Grid _pg, int _index) {
  
  ArrayList<Grid_Point> result = _pg.points.get(_index);
  return result;
  
}

// POINT_GRID, INT -> VECTOR[POINT]
// Fetches a row of POINTs from a POINT_GRID
// Where:
// _pg -> POINT_GRID to fetch from (POINT_GRID)
// _index -> row to grab
ArrayList<Grid_Point> getRowByIndex(Point_Grid _pg, int _index) {
  
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
Grid_Point getOppositePoint(int _col, int _row, Point_Grid _pg){
  
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
Grid_Point getOppositePointVert(int _col, int _row, Point_Grid _pg) {
  
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
Grid_Point getOppositePointHor(int _col, int _row, Point_Grid _pg) {
  
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
ArrayList<Grid_Point> getLine(int _col0, int _row0, int _col1, int _row1, Point_Grid _pg) {
  
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
ArrayList<Grid_Point> getLine_No_Op(int _col0, int _row0, int _col1, int _row1, Point_Grid _pg) {
  
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
ArrayList<Grid_Point> getCircle(int _col, int _row, int _rad, Point_Grid _pg) {
  
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
ArrayList<Grid_Point> getPattern(int _col, int _row, List<Integer> _dlist, int _reps, boolean _overflow, Point_Grid _pg) {
  
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
ArrayList<Grid_Point> getPerlin(double _low, double _high, Point_Grid _pg) {
  
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
ArrayList<Grid_Point> getRandom(double _low, double _high, Point_Grid _pg) {
  
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
ArrayList<Grid_Point> getThreshold(double _low, double _high, Point_Grid _pg) {
  
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
