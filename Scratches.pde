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
