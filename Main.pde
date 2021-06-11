
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

void settings() {
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

void setup() {
  
  frameRate(24);
}

int counter = 0;
float perlin_counter = 0;
int time = 0;
int time_x, time_y;

void draw() {
  background(0);
  stroke(255);
 
  //pattern = getLine_No_Op(5, 2, 15, 20, grid);
  counter += 1;
  time_x = counter % base_grid.x;
  time_y = counter % base_grid.y;
  int stepper = counter*8 ;
  
  base_grid = applySinRadGradient((base_grid.x - 1) / 2, (base_grid.y - 1) / 2, 120, 1, 0.1, counter, false, false, grid);
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
