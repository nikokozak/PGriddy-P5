# threejs_template
A basic, dev-mode template for P5.js with Webpack, Typescript and a webpack-web-server. Makes it simple to start playing with a basic P5.js setup without having to trudge through Webpack or P5.js setup.  

## Usage
1. `degit nikokozak/p5_template <target_dir>`
2. `cd <target_dir>`
3. `npm install`
4. `git init`
5. `npm run dev`

## Structure
The basic structure in `src` is as follows:
`index.ts` - basic scene setup.

## Details
For ease of use, the following assumptions are made:
1. "Development" mode is hardcoded into `webpack.config.js`.
2. No html webpack plugin is provided. Instead, a base html file is included in `dist/index.html`.
3. P5.js is bundled in with anything in `src`. Make sure to separate vendor files in production.
4. Only two `npm run` commands are provided: `dev` and `build`. Both run in dev mode, alter to your heart's content.
5. P5.js template is a small 100x100px canvas, and includes a white ellipse.
