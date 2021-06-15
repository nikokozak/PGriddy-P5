import Point from './point';
import GridPoint from './grid_point';

export function arraySelector(column: number,
                              row: number,
                              matrixWidth: number,
                              array: Array<any>) : any
{
  return array[column * matrixWidth + row];
}

export function map(source: number,
                    inMin: number,
                    inMax: number,
                    outMin: number,
                    outMax: number) : number
{
  return (source - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

export function clamp(input: number,
                      floor: number,
                      ceiling: number) : number
{
  return Math.min(Math.max(input, floor), ceiling);
}

export function weightToRGB(weight: number) : number
  // Maps alpha values (1.00 - 0.00) to std RGB vals (255-0)
  // Where:
  // _in -> alpha value to map
{
  return map(weight, 0.0, 1.0, 0, 255);
}

export function rgbToLuma(red: number, green: number, blue: number) : number
  // Approximate Luma value from RGB values, rough approximation (takes values of 0-255 and returns same range).
  // Where:
  // _r -> red channel
  // _g -> green channel
  // _b -> blue channel
{
  return (red + red + red + blue + green + green + green + green) >> 3;
}

export function plotInCircle(input: number, centerX: number, centerY: number, radius: number) : {a: number, b: number}
  // Returns a 2-value Tuple containing positive and negative Y values of a desired circle.
  // NOTE: Avoid use if possible (function uses sqrt).
  // Where:
  // _x -> x value to apply f(x)
  // _centerX, _centerY -> center of desired circle
  // _r -> radius of desired circle
{
  let posY = plotCircleTop(input, centerX, centerY, radius);
  let negY = (posY * -1) + (centerY * 2);

  return {a: posY, b: negY};
}

export function plotCircleTop(input: number, centerX: number, centerY: number, radius: number) : number
  // Returns the positive Y value corresponding to a given X of a desired circle.
  // NOTE: Avoid use if possible (function uses sqrt).
  // Where:
  // _x -> x value to apply f(x)
  // _centerX, _centerY -> center of desired circle
  // _r -> radius of desired circle
{
  return Math.round(Math.sqrt(radius ** 2 - (input - centerX) ** 2)) + centerY;
}

export function plotCircleBottom(input: number, centerX: number, centerY: number, radius: number) : number
  // Returns the negative Y value corresponding to a given X of a desired circle.
  // NOTE: Avoid use if possible (function uses sqrt).
  // Where:
  // _x -> x value to apply f(x)
  // _centerX, _centerY -> center of desired circle
  // _r -> radius of desired circle
{
  return plotCircleTop(input, centerX, centerY, radius) * -1;
}

export function sinMap(input: number, frequency: number, shift: number) : number
  // A sin function, returns a value between 1 and -1.
  // Where:
  // _x -> input value to map
  // _amp -> amplitude of function
  // _freq -> frequency of function
  // _shift -> x-axis shift of function
{
  return Math.sin(frequency * input - frequency * shift);
}

export function easeInOutCubic(input: number, begin: number, change: number, duration: number) : number
  // Maps an x value to a y value using an in-out-cubic easing function
  // Adapted from Robert Penner's Easing Functions
  // Where:
  // _x -> x value to map
  // _begin -> beginning value
  // _change -> change in value
  // _duration -> duration or extent of function
{
  if ((input /= duration/2) < 1) return change/2 * (input ** 3) + begin;
  return change/2 * ((input -= 2) * input * input + 2) + begin;
}

export const attrOrDefault = (paramObj: any, paramAttr: string, alt: any) : any =>
  // General helper for extracting options from a param object, 
  // and providing a default alternative if the param is null.
{
  if (paramObj) {
    return paramObj.hasOwnProperty(paramAttr) ? paramObj[paramAttr] : alt;
  } else {
    return alt;
  }
}

export const forEachPoint = (points: Array<Point | GridPoint>, fun: Function) : Array<Point | GridPoint> =>
  // General helper for point iteration.
  // points -> points to iterate through
  // fun (point, index) -> function to affect points with
{
  for (let i = 0, n = points.length; i < n; i++) {
    fun(points[i], i);
  }
  return points;
}
