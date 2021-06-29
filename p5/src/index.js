const p5 = require('p5');
import PointGrid from './pgriddy/point_grid';
import Point from './pgriddy/point';

// -------------- SETUP ---------------- //

const size = {
	width: 500,
	height: 500
}

const sketch = (p) => {

  let gridCenter = new Point(size.width / 2, size.height / 2);
  let grid = new PointGrid(20, 20, gridCenter, 10, 10);
	let pattern;
	let counter = 0;

	p.setup = () => {
		p.createCanvas(size.width, size.height);
	}

	p.draw = () => {
		p.background(0);
		p.fill(255);
		p.circle(10, 10, 10);
    //grid.draw(p, 2);
		pattern = grid.getPattern(0, 0, [2, 3, 4, 1], p.frameCount, true);
		pattern.draw(p, 2);
	}
}

const container = document.getElementById('p5');
const instance = new p5(sketch, container);
