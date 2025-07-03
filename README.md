# CircleMats

Interactive visualization tool for creating and exploring circular mat patterns with various knot designs.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://scott-y-hall.github.io/CircleMats/)

## Features

- Interactive web-based interface
- Multiple preset knot patterns
- Real-time parameter adjustments
- Export patterns as SVG
- Responsive design

## Getting Started

### View Online

Simply visit the [live demo](https://scott-y-hall.github.io/CircleMats/) to start creating patterns in your browser.

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Scott-Y-Hall/CircleMats.git
   cd CircleMats
   ```

2. Open `index.html` in a modern web browser.

## How to Use

1. **Select a Pattern**:
   - Choose from various preset patterns in the left panel
   - Each pattern has unique characteristics and behaviors

2. **Adjust Parameters**:
   - Use the sliders to modify pattern attributes
   - Common parameters include:
     - `Knots`: Number of repetitions around the circle
     - `LargeCircle`: Radius of the outer circle
     - `SmallCircle`: Radius of the inner circle
     - `Segments`: Number of segments to display

3. **Interactive Controls**:  TODO
   - Click and drag the canvas to rotate the view
   - Use mouse wheel to zoom in/out

## Adding New Knots

To add a new knot pattern:

1. Create a new JavaScript file in the `js/knots/` directory (e.g., `MyKnot.js`)

2. Define your knot function following this template:
   ```javascript
   import { createPoint } from '../util.js';
   import { getControls } from '../sliders.js';
   
   export function MyKnot() {
       const c = getControls(<number of points per knot>); // Number of points per knot
       const nodepoints = [];
       
       // Your knot logic here
       for (let x = 0; x < c.knots; x++) {
           // Add points using createPoint(radius, angle, cp1, cp2, tilt)
           nodepoints.push(createPoint(c.largeCircle, -x * c.angle + c.angle/2, c.startcp, c.startcp));
           // Add the same number of points per knot as defined in getControls()
       }
       
       // Close the loop by adding the first point again, but all the way around the mat
       nodepoints.push(createPoint(c.largeCircle, -(c.knots - 1) * c.angle - c.angle / 2, c.startcp, c.startcp));
       
       if (c.single) {
           nodepoints.splice(c.show);
       }
       
       return nodepoints;
   }
   ```

3. Import and register your new knot in `js/matPoints.js`:
   ```javascript
   import { MyKnot } from './knots/MyKnot.js';
   
   // Add to the switch statement in createKnotPoints
   if (_matType === 'M') { nodepoints = MyKnot(); }
   ```

4. Update the `matNameArray` in `js/matPoints.js` to include your new knot:
   ```javascript
   export const matNameArray = [
       // ... existing knots
       { key: 'M', value: 'My New Knot' }
   ];
   ```

## Available Controls

- `Knots`: Number of pattern repetitions around the circle
- `LargeCircle`: Controls the outer radius
- `SmallCircle`: Controls the inner radius
- `StartCP`: Start control point for curves
- `MiddleCP`: Middle control point for curves
- `Segments`: Number of segments to display (lower for better performance)

## Keyboard Shortcuts  TODO

- `R`: Reset view
- `S`: Toggle single loop mode
- `U`: Toggle under/over rendering
- `I`: Toggle intersection points

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).


