import { clamp, plotInCircle, easeInOutCubic } from './utilities';

// TODO: Fix blending.

/************************************************/
/************ GENERAL APPLICATORS ***************/
/************************************************/

const forEachPoint = (points, fun) =>
{
  for (let i = 0, n = points.length; i < n; i++) {
    fun(points[i], i);
  }
  return points;
}

export const setWeights = (points) =>
  // Sets all weights in a given set of points
  // weight -> new weight (value between 0 and 1)
{
  return (weight) => {

    weight = clamp(weight, 0, 1);

    return forEachPoint(points, (point, _i) => {
      point.weight = weight;
    });
  };
};

export const addToWeights = (points) =>
// Adds a given number to all weights in a given set of Points.
// weight -> amount to add (value between 0 and 1)
{
  return (weight) => {

    return forEachPoint(points, (point, _i) => {
      point.weight = clamp(point.weight + weight, 0, 1);
    });

  };
};

export const addToPositions = (points) =>
// Moves points by adding the provided values to X and Y coordinates, scaled according to each point's weight.
// Where:
// x -> amount to add to Point.x
// y -> amount to add to Point.y
{
  return (x, y) => {

    return forEachPoint(points, (point, _i) => {
      point.x += x;
      point.y += y;
    });

  };
};

export const addToPositionsWeighted = (points) =>
// Moves points by adding the provided values to X and Y coordinates, scaled according to each point's weight.
// Where:
// x -> amount to add to Point.x
// y -> amount to add to Point.y
{
  return (x, y) => {

    return forEachPoint(points, (point, _i) => {
      point.x += x * point.weight;
      point.y += y * point.weight;
    });

  };
};

export const multPositions = (points) =>
// Moves points in a grid by multiplying the provided values to X and Y coordinates.
// Where:
// x -> amount to add to GRID_POINT.x
// y -> amount to add to GRID_POINT.y
{
  return (x, y) => {

    return forEachPoint(points, (point, _i) => {
      point.x *= x;
      point.y *= y;
    });

  };
};

export const multPositionsWeighted = (points) =>
// Moves points in a grid by multiplying the provided values to X and Y coordinates, scaled according to each point's weight.
// Where:
// x -> amount to add to GRID_POINT.x
// y -> amount to add to GRID_POINT.y
{
  return (x, y) => {

    return forEachPoint(points, (point, _i) => {
      point.x *= x * point.weight;
      point.y *= y * point.weight;
    });

  };
};

export const applyPGLinRadGradientSlow = (pointGrid) =>
{
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
  return (params) =>
  {
    let column = params.column || 0;
    let row = params.row || 0;
    let radius = params.radius || 10;
    let initDecay = params.initDecay || 1;
    let sampleRate = params.sampleRate || 0.5;
    let inverse = params.inverse || false;
    let blend = params.blend || false;

    let currRad = 0;
    let initX = column - radius;
    let finX = column + radius;
    let currX = initX;
    let currWeight = initDecay;
    let decayFactor = radius / sampleRate;
    let decay = initDecay / decayFactor;

    let yVal = {};

    while (currRad <= radius) {

      while (currX <= finX) {

        yVal = plotInCircle(currX, column, row, currRad);

        if (pointGrid.checkColumnBounds(currX) && pointGrid.checkRowBounds(yVal.a)) {
          const point = pointGrid.getPoint(currX, yVal.a);
          point.weight =
            blend ?
            clamp(point.weight + currWeight, 0, 1)
            : currWeight;
        }

        if (pointGrid.checkColumnBounds(currX) && pointGrid.checkRowBounds(yVal.b)) {
          const point = pointGrid.getPoint(currX, yVal.b);
          point.weight =
            blend ?
            clamp(point.weight + currWeight, 0, 1)
            : currWeight;
        }

        currX++;

      }

      currRad += sampleRate;
      currX = initX;
      currWeight = inverse ? currWeight + decay : currWeight - decay;
      currWeight = clamp(currWeight, 0, 1);

    }

    return pointGrid.points;

  };
}


export const applyPGLinRadGradient = (pointGrid) =>
  // Modifies weights of Grid_Points in a given Point_Grid according to a radial gradient, returns a new Point_Grid
  // uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
  // Where:
  // column, row -> origin of gradient
  // radius -> radius of gradient (i.e. extent of gradient effect)
  // initWeight -> initial weight value for gradient
  // inverse -> whether to invert the gradient
  // blend -> whether to add the gradient onto the previous Point_Grid or start anew
{
  return (params) =>
  {
    let column = params.column || 0;
    let row = params.row || 0;
    let radius = params.radius || 10;
    let initWeight = params.initDecay || 1;
    let inverse = params.inverse || false;
    let blend = params.blend || false;

    let currRad = 0;
    let innerRad = 0;
    let currWeight = initWeight;
    let decay = initWeight / radius;

    if (pointGrid.checkColumnBounds(column) && pointGrid.checkRowBounds(row)) {
      pointGrid.getPoint(column, row).weight = currWeight;
    }

    while (currRad <= radius) {
      innerRad = currRad;
      let x = currRad;
      let y = 0;
      let err = 2 - 2 * currRad;
      console.log("Curr rad: " + currRad + " Curr rad: " + radius);

      while (x < 0) {

        if (pointGrid.checkColumnBounds(column - x) && pointGrid.checkRowBounds(row + y)) {
          pointGrid.getPoint(column - x, row + y).weight = currWeight;
        }
        if (pointGrid.checkColumnBounds(column - y) && pointGrid.checkRowBounds(row - x)) {
          pointGrid.getPoint(column - y, row - x).weight = currWeight;
        }
        if (pointGrid.checkColumnBounds(column + x) && pointGrid.checkRowBounds(row - y)) {
          pointGrid.getPoint(column + x, row - y).weight = currWeight;
        }
        if (pointGrid.checkColumnBounds(column + y) && pointGrid.checkRowBounds(row + x)) {
          pointGrid.getPoint(column + y, row + x).weight = currWeight;
        }

        innerRad = err;

        if (innerRad <= 0) {
          y += 1;
          err += 2 * y + 1;
        }
        if (innerRad > 0) {
          x += 1;
          err += 2 * x + 1;
        }
      }

      currRad += 1;
      currWeight = inverse ? currWeight + decay : currWeight - decay;
      currWeight = clamp(currWeight, 0, 1);

    }

    if (blend) {} // !TODO!

    return pointGrid.points;

  };
}

export const applyPGSmoothGradient = (pointGrid) =>
  // Modifies weights of Grid_Points in a given Point_Grid according to a radial gradient, using an in-out-easing function. Returns a new Point_Grid
  // uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
  // Where:
  // _col, _row -> origin of gradient
  // _rad -> radius of gradient (i.e. extent of gradient effect)
  // _init_weight -> initial weight value for gradient
  // _inverse -> whether to invert the gradient
  // _blend -> whether to add the gradient onto the previous Point_Grid or start anew
{
  return (params) =>
  {
    let column = params.column || 0;
    let row = params.row || 0;
    let radius = params.radius || 10;
    let initWeight = params.initDecay || 1;
    let inverse = params.inverse || false;
    let blend = params.blend || false;

    let currRad = 0;
    let innerRad = 0;
    let currWeight = initWeight;

    if (pointGrid.checkColumnBounds(column) && pointGrid.checkRowBounds(row)) {
      pointGrid.getPoint(column, row).weight = currWeight;
    }

    while (currRad <= radius) {

      innerRad = currRad;
      let x = currRad * -1;
      let y = 0;
      let err = 2 - 2 * currRad;

      while (x < 0) {
        if (pointGrid.checkColumnBounds(column - x) && pointGrid.checkRowBounds(row + y)) {
          pointGrid.getPoint(column - x, row + y).weight = currWeight;
        }
        if (pointGrid.checkColumnBounds(column - y) && pointGrid.checkRowBounds(row - x)) {
          pointGrid.getPoint(column - y, row - x).weight = currWeight;
        }
        if (pointGrid.checkColumnBounds(column + x) && pointGrid.checkRowBounds(row - y)) {
          pointGrid.getPoint(column + x, row - y).weight = currWeight;
        }
        if (pointGrid.checkColumnBounds(column + y) && pointGrid.checkColumnBounds(row + x)) {
          pointGrid.getPoint(column + y, row + x).weight = currWeight;
        }

        innerRad = err;

        if (innerRad <= 0) {
          y += 1;
          err += 2 * y + 1;
        }

        if (innerRad > 0) {
          x += 1;
          err += 2 * x + 1;
        }
      }

      currRad += 1;

      currWeight = easeInOutCubic(currRad,
                                  inverse ? 0 : initWeight,
                                  inverse ? initWeight : -initWeight,
                                  radius);
      currWeight = clamp(currWeight, 0, 1);

    }

    if (blend) {} // TODO

    return pointGrid.points;
  };
};

export const applyPGSmoothRadGradientSlow = (pointGrid) =>
{
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
  return (params) =>
  {
    let column = params.column || 0;
    let row = params.row || 0;
    let radius = params.radius || 10;
    let initDecay = params.initDecay || 1;
    let sampleRate = params.sampleRate || 0.5;
    let inverse = params.inverse || false;
    let blend = params.blend || false;

    let currRad = 0;
    let initX = column - radius;
    let finX = column + radius;
    let currX = initX;
    let currWeight = initDecay;

    let yVal = {};

    while (currRad <= radius) {

      while (currX <= finX) {

        yVal = plotInCircle(currX, column, row, currRad);

        if (pointGrid.checkColumnBounds(currX) && pointGrid.checkRowBounds(yVal.a)) {
          const point = pointGrid.getPoint(currX, yVal.a);
          point.weight =
            blend ?
            clamp(point.weight + currWeight, 0, 1)
            : currWeight;
        }

        if (pointGrid.checkColumnBounds(currX) && pointGrid.checkRowBounds(yVal.b)) {
          const point = pointGrid.getPoint(currX, yVal.b);
          point.weight =
            blend ?
            clamp(point.weight + currWeight, 0, 1)
            : currWeight;
        }

        currX++;

      }

      currRad += sampleRate;
      currX = initX;
      currWeight = easeInOutCubic(currRad, 
        inverse ? 0 : initWeight, 
        inverse ? initWeight : initWeight * -1,
        radius);
      currWeight = clamp(currWeight, 0, 1);

    }

    return pointGrid.points;

  };
}

export const applyPGSinRadGradient = (pointGrid) =>
// Modifies weights of Grid_Points in a given Point_Grid according to a radial gradient, using an in-out-easing function. Returns a new Point_Grid
// uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
// Where:
// _col, _row -> origin of gradient
// _rad -> radius of gradient (i.e. extent of gradient effect)
// _init_weight -> initial weight value for gradient
// _inverse -> whether to invert the gradient
// _blend -> whether to add the gradient onto the previous Point_Grid or start anew
{
  return (params) =>
  {
    let column = params.column || 0;
    let row = params.row || 0;
    let radius = params.radius || 10;
    let initWeight = params.initDecay || 1;
    let blend = params.blend || false;
    let frequency = params.frequency || 1;
    let shift = params.shift || 1;

    let currRad = 0;
    let innerRad = 0;
    let currWeight = initWeight;

    if (pointGrid.checkColumnBounds(column) && pointGrid.checkRowBounds(row)) {
      pointGrid.getPoint(column, row).weight = currWeight;
    }

    while (currRad <= radius) {

      innerRad = currRad;
      let x = currRad * -1;
      let y = 0;
      let err = 2 - 2 * currRad;

      while (x < 0) {
        if (pointGrid.checkColumnBounds(column - x) && pointGrid.checkRowBounds(row + y)) {
          pointGrid.getPoint(column - x, row + y).weight = currWeight;
        }
        if (pointGrid.checkColumnBounds(column - y) && pointGrid.checkRowBounds(row - x)) {
          pointGrid.getPoint(column - y, row - x).weight = currWeight;
        }
        if (pointGrid.checkColumnBounds(column + x) && pointGrid.checkRowBounds(row - y)) {
          pointGrid.getPoint(column + x, row - y).weight = currWeight;
        }
        if (pointGrid.checkColumnBounds(column + y) && pointGrid.checkColumnBounds(row + x)) {
          pointGrid.getPoint(column + y, row + x).weight = currWeight;
        }

        innerRad = err;

        if (innerRad <= 0) {
          y += 1;
          err += 2 * y + 1;
        }

        if (innerRad > 0) {
          x += 1;
          err += 2 * x + 1;
        }
      }

      currRad += 1;

      currWeight = sinMap(currRad, frequency, shift);
      currWeight = clamp(currWeight, 0, 1);

    }

    if (blend) {} // TODO

    return pointGrid.points;
  };
};

export const applyPGSinRadGradientSlow = (pointGrid) =>
{
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
  return (params) =>
  {
    let column = params.column || 0;
    let row = params.row || 0;
    let radius = params.radius || 10;
    let initDecay = params.initDecay || 1;
    let sampleRate = params.sampleRate || 0.5;
    let frequency = params.frequency || 1;
    let shift = params.shift || 1;
    let blend = params.blend || false;

    let currRad = 0;
    let initX = column - radius;
    let finX = column + radius;
    let currX = initX;
    let currWeight = initDecay;

    let yVal = {};

    while (currRad <= radius) {

      while (currX <= finX) {

        yVal = plotInCircle(currX, column, row, currRad);

        if (pointGrid.checkColumnBounds(currX) && pointGrid.checkRowBounds(yVal.a)) {
          const point = pointGrid.getPoint(currX, yVal.a);
          point.weight =
            blend ?
            clamp(point.weight + currWeight, 0, 1)
            : currWeight;
        }

        if (pointGrid.checkColumnBounds(currX) && pointGrid.checkRowBounds(yVal.b)) {
          const point = pointGrid.getPoint(currX, yVal.b);
          point.weight =
            blend ?
            clamp(point.weight + currWeight, 0, 1)
            : currWeight;
        }

        currX++;

      }

      currRad += sampleRate;
      currX = initX;
      currWeight = sinMap(currRad, frequency, shift);
      currWeight = clamp(currWeight, 0, 1);

    }

    return pointGrid.points;

  };
}

export const applyPerlin = (points) =>
  // Apply weights to point in Point_Grid based on Perlin Noise.
  // Perlin positions are taken from Grid_Points in Grid.
  // Where:
  // _min -> Min weight threshold
  // _max -> Max weight threshold
  // _time -> Time (Z-axis) factor for animating Perlin (takes values from 0.0 - 1.0);
  // _blend -> Whether to blend weight with any previous weight present in Point_Grid
{
  return (params) => 
  {
    let min = params.min || 0;
    let max = params.max || 1;
    let time = params.time || 0;
    let blend = params.blend || false;
    
    return forEachPoint(points, (point, _i) => {
      //TODO : bring in noise function. Figure out blending.
      map(noise(point.x, point.y, time), 0, 1, min, max);
    });
  }
}

export const applyRandom = (points) =>
{
  return (blend = false) =>
  {
    return forEachPoint(points, (point, _i) => {
      // TODO: bring in random function.
      point.weight = random(0, 1);
    });
  }
}

export const applyPGImage = (pointGrid) =>
  // Loads an image and applies weights to Grid_Points in Point_Grid
  // based on R, G, B, L (lightness) values or combinations thereof.
  // Where:
  // _file -> filename of image to load
  // _scale -> scale the image to encompass full grid or load image at center of grid (no scale applied)
  // _mode -> any of the following: "r", "g", "b", "l" (luma)
{
  return (params) =>
  {
    // TODO: Figure out how to bring in P5 sensibly as dependency.   
  }
}

