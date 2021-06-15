import { clamp, plotInCircle, easeInOutCubic, map, sinMap, attrOrDefault, forEachPoint } from './utilities';
import { noise } from './noise';
import Point from './point';
import GridPoint from './grid_point';
import PointGrid from './point_grid';

// TODO: Fix blending.

/************************************************/
/************ GENERAL APPLICATORS ***************/
/************************************************/

export const setWeights = (points: Array<Point | GridPoint>) : Function => 
  // Sets all weights in a given set of points
  // weight -> new weight (value between 0 and 1)
{
  return (weight: number) : Array<Point | GridPoint> => {

    weight = clamp(weight, 0, 1);

    return forEachPoint(points, (point: Point | GridPoint, _i: number) => {
      point.weight = weight;
    });
  };
};

export const addToWeights = (points: Array<Point | GridPoint>): Function =>
// Adds a given number to all weights in a given set of Points.
// weight -> amount to add (value between 0 and 1)
{
  return (weight: number) => {

    return forEachPoint(points, (point: Point | GridPoint, _i: number) => {
      point.weight = clamp(point.weight + weight, 0, 1);
    });

  };
};

export const multiplyWeights = (points: Array<Point | GridPoint>): Function =>
// Multiplies all weights in a given set of Points.
// weight -> amount to add (value between 0 and 1)
{
  return (weight: number) => {

    return forEachPoint(points, (point: Point | GridPoint, _i: number) => {
      point.weight = clamp(point.weight * weight, 0, 1);
    });

  };
};

export const addToPositions = (points: Array<Point | GridPoint>): Function =>
// Moves points by adding the provided values to X and Y coordinates, scaled according to each point's weight.
// Where:
// x -> amount to add to Point.x
// y -> amount to add to Point.y
{
  return (x: number, y: number) => {

    return forEachPoint(points, (point: Point | GridPoint, _i: number) => {
      point.x += x;
      point.y += y;
    });

  };
};

export const addToPositionsWeighted = (points: Array<Point | GridPoint>) =>
// Moves points by adding the provided values to X and Y coordinates, scaled according to each point's weight.
// Where:
// x -> amount to add to Point.x
// y -> amount to add to Point.y
{
  return (x: number, y: number) => {

    return forEachPoint(points, (point: Point | GridPoint, _i: number) => {
      point.x += x * point.weight;
      point.y += y * point.weight;
    });

  };
};

export const multPositions = (points: Array<Point | GridPoint>) =>
// Moves points in a grid by multiplying the provided values to X and Y coordinates.
// Where:
// x -> amount to add to GRID_POINT.x
// y -> amount to add to GRID_POINT.y
{
  return (x: number, y: number) => {

    return forEachPoint(points, (point: Point | GridPoint, _i: number) => {
      point.x *= x;
      point.y *= y;
    });

  };
};

export const multPositionsWeighted = (points: Array<Point | GridPoint>) =>
// Moves points in a grid by multiplying the provided values to X and Y coordinates, scaled according to each point's weight.
// Where:
// x -> amount to add to GRID_POINT.x
// y -> amount to add to GRID_POINT.y
{
  return (x: number, y: number) => {

    return forEachPoint(points, (point: Point | GridPoint, _i: number) => {
      point.x *= x * point.weight;
      point.y *= y * point.weight;
    });

  };
};


export const applyPGLinRadGradientSlow = (pointGrid: PointGrid) : Function =>
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
  const applicatorFn = makeSlowRadialApplicator((context: any) => {
    const decayFactor = context.radius / context.sampleRate;
    const decay = context.initWeight / decayFactor;

    return context.inverse ? 
      context.currWeight + decay :
      context.currWeight - decay;
  });

  return applicatorFn(pointGrid);

}


export const applyPGLinRadGradient = (pointGrid: PointGrid) : Function =>
  // Modifies weights of Grid_Points in a given Point_Grid according to a radial gradient, returns a new Point_Grid
  // uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
  // Where:
  // column, row -> origin of gradient
  // radius -> radius of gradient (i.e. extent of gradient effect)
  // initWeight -> initial weight value for gradient
  // inverse -> whether to invert the gradient
  // blend -> whether to add the gradient onto the previous Point_Grid or start anew
{

  const applicatorFn = makeRadialApplicator((context: any) => {
    const decay = context.initWeight / context.radius;

    return context.inverse ? 
      context.currWeight + decay :
      context.currWeight - decay;
  });

  return applicatorFn(pointGrid);

}

export const applyPGSmoothRadGradient = (pointGrid: PointGrid) : Function => 
  // Modifies weights of Grid_Points in a given Point_Grid according to a radial gradient, using an in-out-easing function. Returns a new Point_Grid
  // uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
  // Where:
  // _col, _row -> origin of gradient
  // _rad -> radius of gradient (i.e. extent of gradient effect)
  // _init_weight -> initial weight value for gradient
  // _inverse -> whether to invert the gradient
  // _blend -> whether to add the gradient onto the previous Point_Grid or start anew
{
  const applicatorFn = makeRadialApplicator((context: any) => {
    return easeInOutCubic(context.currRad,
      context.inverse ? 0 : context.initWeight,
      context.inverse ? context.initWeight : context.initWeight * -1,
      context.radius);
  });

  return applicatorFn(pointGrid);

};

export const applyPGSmoothRadGradientSlow = (pointGrid: PointGrid) : Function =>
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
  const applicatorFn = makeSlowRadialApplicator((context: any) => {
    return easeInOutCubic(context.currRad,
      context.inverse ? 0 : context.initWeight,
      context.inverse ? context.initWeight : context.initWeight * -1,
      context.radius);
  });

  return applicatorFn(pointGrid);

}

export const applyPGSinRadGradient = (pointGrid: PointGrid) =>
// Modifies weights of Grid_Points in a given Point_Grid according to a radial gradient, using an in-out-easing function. Returns a new Point_Grid
// uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
// Where:
// _col, _row -> origin of gradient
// _rad -> radius of gradient (i.e. extent of gradient effect)
// _init_weight -> initial weight value for gradient
// _inverse -> whether to invert the gradient
// _blend -> whether to add the gradient onto the previous Point_Grid or start anew
{
  
  const applicatorFn = makeRadialApplicator((context: any) => {
    const frequency = attrOrDefault(context.params, 'frequency', 1);
    const shift = attrOrDefault(context.params, 'shift', 1);
    return sinMap(context.currRad, frequency, shift);
  });

  return applicatorFn(pointGrid);

};

export const applyPGSinRadGradientSlow = (pointGrid: PointGrid) =>
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
  
  const applicatorFn = makeSlowRadialApplicator((context: any) => {
    // Freq and shift can be passed in as params to the final func.
    const frequency = attrOrDefault(context.params, 'frequency', 1);
    const shift = attrOrDefault(context.params, 'shift', 1);

    return sinMap(context.currRad, frequency, shift);
  });

  return applicatorFn(pointGrid);

}

export const applyPerlin = (points: Array<Point | GridPoint>) =>
  // Apply weights to point in Point_Grid based on Perlin Noise.
  // Perlin positions are taken from Grid_Points in Grid.
  // Where:
  // _min -> Min weight threshold
  // _max -> Max weight threshold
  // _time -> Time (Z-axis) factor for animating Perlin (takes values from 0.0 - 1.0);
  // _blend -> Whether to blend weight with any previous weight present in Point_Grid
{
  return (params: any) => 
  {
    let min = attrOrDefault(params, 'min', 0);
    let max = attrOrDefault(params, 'max', 1);
    let time = attrOrDefault(params, 'time', 0);
    let blend = attrOrDefault(params, 'blend', false);
    
    //console.log(noise.perlin3(1, 1, 0));
    
    return forEachPoint(points, (point: Point | GridPoint, _i: number) => {
      //TODO: Figure out blending
      point.weight = map(noise.perlin3(point.x, point.y, time), 0, 1, min, max);
    });
  }
}

export const applySimplex = (points: Array<Point | GridPoint>) =>
  // Apply weights to point in Point_Grid based on Perlin Noise.
  // Perlin positions are taken from Grid_Points in Grid.
  // Where:
  // _min -> Min weight threshold
  // _max -> Max weight threshold
  // _time -> Time (Z-axis) factor for animating Perlin (takes values from 0.0 - 1.0);
  // _blend -> Whether to blend weight with any previous weight present in Point_Grid
{
  return (params: any) => 
  {
    let min = attrOrDefault(params, 'min', 0);
    let max = attrOrDefault(params, 'max', 1);
    let time = attrOrDefault(params, 'time', 0);
    let blend = attrOrDefault(params, 'blend', false);
    
    return forEachPoint(points, (point: Point | GridPoint, _i: number) => {
      // TODO: Figure out blending
      point.weight = map(noise.simplex3(point.x, point.y, time), 0, 1, min, max);
    });
  }
}

export const applyRandom = (points: Array<Point | GridPoint>) =>
{
  return (blend = false) =>
  {
    return forEachPoint(points, (point: Point | GridPoint, _i: number) => {
      // TODO: bring in random function.
      point.weight = Math.random();
    });
  }
}

export const applyPGImage = (pointGrid: PointGrid): Function =>
  // Loads an image and applies weights to Grid_Points in Point_Grid
  // based on R, G, B, L (lightness) values or combinations thereof.
  // Where:
  // _file -> filename of image to load
  // _scale -> scale the image to encompass full grid or load image at center of grid (no scale applied)
  // _mode -> any of the following: "r", "g", "b", "l" (luma)
{
  return (params: any) =>
  {
    // TODO: Figure out how to bring in P5 sensibly as dependency.   
  }
}

const makeSlowRadialApplicator = (weightFn: Function): Function =>
  // Factory for slow radial applicator functions. 
  // Takes a weight function which in turn receives all variables in the applicator builder function scope.
  // Returns a curried function that must then be curried again with again with a pointGrid.
  // Further variable declarations can be made in the weightFn declaration, using the context to fetch params for example.
{
  return (pointGrid: PointGrid): Function => {
    return (params: any) =>
    {
      let column = attrOrDefault(params, 'column', 0);
      let row = attrOrDefault(params, 'row', 0);
      let radius = attrOrDefault(params, 'radius', 10);
      let initWeight = attrOrDefault(params, 'initWeight', 1);
      let sampleRate = attrOrDefault(params, 'sampleRate', 0.5);
      let blend = attrOrDefault(params, 'blend', false);
      let inverse = attrOrDefault(params, 'inverse', false);

      let currRad = 0;
      let initX = column - radius;
      let finX = column + radius;
      let currX = initX;
      let currWeight = initWeight;

      let yVal = {a: 0, b: 0};

      while (currRad <= radius) {

        while (currX <= finX) {

          yVal = plotInCircle(currX, column, row, currRad);

          if (pointGrid.checkColBounds(currX) && pointGrid.checkRowBounds(yVal.a)) {
            const point = pointGrid.getPoint(currX, yVal.a);
            point.weight =
              blend ?
              clamp(point.weight + currWeight, 0, 1)
              : currWeight;
          }

          if (pointGrid.checkColBounds(currX) && pointGrid.checkRowBounds(yVal.b)) {
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
        currWeight = weightFn({column, row,
          radius, initWeight, sampleRate, blend,
          inverse, currRad, initX, finX, currX,
          currWeight, yVal, params });
        currWeight = clamp(currWeight, 0, 1);

      }

      return pointGrid.points;

    };
  }
}

const makeRadialApplicator = (weightFn: Function): Function =>
  // Modifies weights of Grid_Points in a given Point_Grid according to a radial gradient, using an in-out-easing function. Returns a new Point_Grid
  // uses modified rasterizing algorithm by Alois Zingl (http://members.chello.at/~easyfilter/Bresenham.pdf)
  // Where:
  // _col, _row -> origin of gradient
  // _rad -> radius of gradient (i.e. extent of gradient effect)
  // _init_weight -> initial weight value for gradient
  // _inverse -> whether to invert the gradient
  // _blend -> whether to add the gradient onto the previous Point_Grid or start anew
{
  return (pointGrid: PointGrid): Function =>
  {
    return (params: any) =>
    {
      let column = attrOrDefault(params, 'column', 0);
      let row = attrOrDefault(params, 'row', 0);
      let radius = attrOrDefault(params, 'radius', 10);
      let initWeight = attrOrDefault(params, 'initWeight', 1);
      let blend = attrOrDefault(params, 'blend', false);
      let inverse = attrOrDefault(params, 'inverse', false);

      let currRad = 0;
      let innerRad = 0;
      let currWeight = initWeight;

      if (pointGrid.checkColBounds(column) && pointGrid.checkRowBounds(row)) {
        pointGrid.getPoint(column, row).weight = currWeight;
      }

      while (currRad <= radius) {

        innerRad = currRad;
        let x = currRad * -1;
        let y = 0;
        let err = 2 - 2 * currRad;

        while (x < 0) {
          if (pointGrid.checkColBounds(column - x) && pointGrid.checkRowBounds(row + y)) {
            pointGrid.getPoint(column - x, row + y).weight = currWeight;
          }
          if (pointGrid.checkColBounds(column - y) && pointGrid.checkRowBounds(row - x)) {
            pointGrid.getPoint(column - y, row - x).weight = currWeight;
          }
          if (pointGrid.checkColBounds(column + x) && pointGrid.checkRowBounds(row - y)) {
            pointGrid.getPoint(column + x, row - y).weight = currWeight;
          }
          if (pointGrid.checkColBounds(column + y) && pointGrid.checkColBounds(row + x)) {
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

        currWeight = weightFn({
          column, row, radius, initWeight, blend, inverse,
          currRad, innerRad, currWeight, x, y, err, params
        });
        currWeight = clamp(currWeight, 0, 1);

      }

      if (blend) {} // TODO

      return pointGrid.points;
    };
  }
};

