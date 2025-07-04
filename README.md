# CircleMats

Interactive visualization tool for creating and exploring circular mat patterns with various knot designs.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://scott-y-hall.github.io/CircleMats/)

## Theory of operation

SVG paths are made up of a series of bezier curves, which are defined by endpoints and control points. To achieve smooth transitions between curves, the endpoint of one curve is the startpoint of the next curve, and the control points are 180 degrees apart from each other.  The start and end points must be the same distance from the center of the circle.  Each mat is defined by a knot, which is then repeated around the circle.  All points are define in radial coordinates, with the center of the circle at (0,0).  The radius is the distance from the center of the circle to the point, and the angle is the angle from the positive x-axis to the point.

The createPoint function is used to create a point in radial coordinates.  It takes the following parameters:
- radius: The distance from the center of the circle to the point
- angle: The angle from the positive x-axis to the point
- cp1: The first control point.  This control point lies on a tangent to the circle to the left of the point
- cp2: The second control point.  This control point lies on a tangent to the circle to the right of the point
- tilt: The tilt of the curve (optional, affects how far off of tangent the control points are)

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
   getControls() returns an object containing the following properties:
   - knots: Number of knots
   - angle: Angle between knots
   - show: Number of points to show
   - single: Boolean indicating whether to show a single loop
   - largeCircle: Radius of the large circle
   - smallCircle: Radius of the small circle
   - middleCircle: Radius of the middle circle
   - showCircle: Boolean indicating whether to show the circle
   - startcp: Start control point
   - midcp: Middle control point
   - tilt: Tilt of the curve
   - extracp: Extra control point
   - extraCircle: Radius of the extra circle
   - extraAngle: Extra angle
   - cp1: First control point
   - cp2: Second control point

   These values are controlled by the sliders in the UI.  Some sliders are optional, and will be zero if not present.

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

5. Add entries in definePresets.js for your new knot.
Each mat needs to be defined by the mattype (e.g., 'M').  Each mattype section has a sliders array that defines the sliders to be used for that mattype.  Each slider has a name that matches the name in the sliders array.  The mat section defines the min and max values for each slider.  The variant section defines the default values for each slider for each variant.  Each variant is listed on the presets grid in the UI.
    ```javascript
         M: {
            sliders: [
                { name: 'Knots' },
                { name: 'LargeCircle' },
                { name: 'SmallCircle' },
                { name: 'StartCP' },
                { name: 'MiddleCP' },
                { name: 'Segments' },
            ],
            mat: {
                Knots: { min: 3, max: 9 },
                LargeCircle: { min: 100, max: 300 },
                SmallCircle: { min: 10, max: 200 },
                StartCP: { min: 0, max: 70 },
                MiddleCP: { min: 0, max: 80 },
                Segments: { min: 2, max: 17 },
            },
            3: {
                Knots: { value: 3 },
                LargeCircle: { value: 175 },
                SmallCircle: { value: 50 },
                StartCP: { value: 10 },
                MiddleCP: { value: 23 },
                Segments: { value: 13, max: 13 },
            }
         }
    ```

## Available Controls

- `Knots`: Number of pattern repetitions around the circle
- `LargeCircle`: Controls the outer radius
- `SmallCircle`: Controls the inner radius
- `StartCP`: Start control point for curves
- `MiddleCP`: Middle control point for curves
- `Segments`: Number of segments to display (lower for better performance)
- `SingleLoop`: Boolean indicating whether to show a single loop
- `Circles`: Boolean indicating whether to show the circle
- `Tilt`: Tilt of the curve
- `ExtraCircle`: Radius of the extra circle
- `ExtraAngle`: Extra angle
- `ExtraCP`: Extra control point
- `CP1`: First control point
- `CP2`: Second control point

## Keyboard Shortcuts  TODO

- `R`: Reset view
- `S`: Toggle single loop mode
- `U`: Toggle under/over rendering
- `I`: Toggle intersection points

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).


