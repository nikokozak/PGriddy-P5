export function arraySelector(column, row, matrixWidth, array)
{
  return array[row * matrixWidth + column];
}

export function map(source, inMin, inMax, outMin, outMax)
{
  return (source - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

export function weightToRGB(weight)
{
  return map(weight, 0.0, 1.0, 0, 255);
}
