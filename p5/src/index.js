import * as p5 from 'p5'

// -------------- SETUP ---------------- //

const size = {
	width: 100,
	height: 100
}

const sketch = (p) => {
	p.setup = () => {
		p.createCanvas(size.width, size.height);
	}

	p.draw = () => {
		p.background(0);
		p.fill(255);
		p.circle(10, 10, 10);
	}
}

const container = document.getElementById('p5');
const instance = new p5(sketch, container);
