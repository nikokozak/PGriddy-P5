export function arraySelector(column, row, matrixWidth, array) 
{
  return array[row * matrixWidth + column];
};
