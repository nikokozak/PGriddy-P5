
Point_Grid setWeights(double _weight, Point_Grid _pg) {
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

Point_Grid addToWeights(double _weight, Point_Grid _pg) {
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

Point_Grid addToPositions(float _x, float _y, Point_Grid _pg) {
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

Point_Grid addToPositions(float _x, float _y, Selection _s, Point_Grid _pg) {
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

Point_Grid multPositions(float _x, float _y, Point_Grid _pg) {
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

Point_Grid multPositions(float _x, float _y, Selection _s, Point_Grid _pg) {
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

Point_Grid applyLinRadGradient_Slow (int _col, int _row, int _r, double _init_decay, double _sample_rate, boolean _inverse, boolean _blend, Point_Grid _pg) {
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
    curr_weight = clamp(curr_weight, 0.0, 1.0);
    
  }
  
  if (_blend) result = addGridWeights(_pg, result);
  return result;
  
}

Point_Grid applyLinRadGradient(int _col, int _row, int _rad, double _init_weight, boolean _inverse, boolean _blend, Point_Grid _pg) {
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
    curr_weight = clamp(curr_weight, 0.0, 1.0);
    
  }
  
  if (_blend) grid_result = addGridWeights(_pg, grid_result);
  return grid_result;
  
}

Point_Grid applySmoothRadGradient(int _col, int _row, int _rad, double _init_weight, boolean _inverse, boolean _blend, Point_Grid _pg) {
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
    curr_weight = clamp(curr_weight, 0.0, 1.0);
    
    
  }
  
  if (_blend) grid_result = addGridWeights(_pg, grid_result);
  return grid_result;
  
}

Point_Grid applySmoothRadGradient_Slow(int _col, int _row, int _r, double _init_weight, double _sample_rate, boolean _inverse, boolean _blend, Point_Grid _pg) {
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
    curr_weight = clamp(curr_weight, 0.0, 1.0);
    
  }
  
  if (_blend) result = addGridWeights(_pg, result);
  return result;
  
}

Point_Grid applySinRadGradient(int _col, int _row, int _rad, double _init_weight, double _freq, double _shift, boolean _inverse, boolean _blend, Point_Grid _pg) {
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
    curr_weight = clamp(curr_weight, 0.0, 1.0);
  }
  
  if (_blend) grid_result = addGridWeights(_pg, grid_result);
  return grid_result;
}

Point_Grid applySinRadGradient_Slow(int _col, int _row, int _r, double _init_weight, double _sample_rate, double _freq, double _shift, boolean _inverse, boolean _blend, Point_Grid _pg) {
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
    curr_weight = clamp(curr_weight, 0.0, 1.0);
    
  }
  
  if (_blend) result = addGridWeights(_pg, result);
  return result;
  
}

Point_Grid applyPerlin(float _min, float _max, float _time, boolean _blend, Point_Grid _pg) {
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

Point_Grid applyRandom(boolean _blend, Point_Grid _pg) {
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
      result.points.get(currPoint.gridIndexX).get(currPoint.gridIndexY).weight = random(0.0, 1.0);
    }
  }
  
  if (_blend) result = addGridWeights(_pg, result);
  return result;
  
}

Point_Grid applyImage(PImage _img, String _mode, boolean _blend, Point_Grid _pg) {
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
  color currPixel;
  
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
