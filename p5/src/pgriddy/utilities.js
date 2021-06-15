export function arraySelector(column, row, matrixWidth, array)
{
  return array[column * matrixWidth + row];
}

export function map(source, inMin, inMax, outMin, outMax)
{
  return (source - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

export function clamp(input, floor, ceiling)
{
  return Math.min(Math.max(input, floor), ceiling);
}

export function weightToRGB(weight)
  // Maps alpha values (1.00 - 0.00) to std RGB vals (255-0)
  // Where:
  // _in -> alpha value to map
{
  return map(weight, 0.0, 1.0, 0, 255);
}

export function rgbToLuma(red, green, blue)
  // Approximate Luma value from RGB values, rough approximation (takes values of 0-255 and returns same range).
  // Where:
  // _r -> red channel
  // _g -> green channel
  // _b -> blue channel
{
  return (red + red + red + blue + green + green + green + green) >> 3;
}

export function plotInCircle(input, centerX, centerY, radius)
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

export function plotCircleTop(input, centerX, centerY, radius)
  // Returns the positive Y value corresponding to a given X of a desired circle.
  // NOTE: Avoid use if possible (function uses sqrt).
  // Where:
  // _x -> x value to apply f(x)
  // _centerX, _centerY -> center of desired circle
  // _r -> radius of desired circle
{
  return Math.round(Math.sqrt(radius ** 2 - (input - centerX) ** 2)) + centerY;
}

export function plotCircleBottom(input, centerX, centerY, radius)
  // Returns the negative Y value corresponding to a given X of a desired circle.
  // NOTE: Avoid use if possible (function uses sqrt).
  // Where:
  // _x -> x value to apply f(x)
  // _centerX, _centerY -> center of desired circle
  // _r -> radius of desired circle
{
  return plotCircleTop(input, centerX, centerY, radius) * -1;
}

export function sinMap(input, frequency, shift)
  // A sin function, returns a value between 1 and -1.
  // Where:
  // _x -> input value to map
  // _amp -> amplitude of function
  // _freq -> frequency of function
  // _shift -> x-axis shift of function
{
  return Math.sin(frequency * input - frequency * shift);
}

export function easeInOutCubic(input, begin, change, duration)
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
