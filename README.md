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

The following SVG shows a bezier curve with control points:
<div>
    <svg width="200" height="200" viewBox="0 0 200 200">
        <!-- Control points and handles -->
        <line x1="20" y1="170" x2="20" y2="40" stroke="#aaa" stroke-width="1" stroke-dasharray="5,5"/>
        <line x1="180" y1="170" x2="180" y2="40" stroke="#aaa" stroke-width="1" stroke-dasharray="5,5"/>
        <circle cx="20" cy="170" r="4" fill="#0a0"/>
        <circle cx="20" cy="40" r="4" fill="#f00"/>
        <circle cx="180" cy="40" r="4" fill="#0a0"/>
        <circle cx="180" cy="170" r="4" fill="#06f"/>
        <!-- Bezier curve -->
        <path d="M 20 40 C 20 170 180 40 180 170" 
            fill="none" 
            stroke="#999" 
            stroke-width="3"/>
        <!-- Labels -->
        <text x="5"   y="30"  fill="#f00" font-size="12">Start</text>
        <text x="10"  y="190" fill="#0a0" font-size="12">Control</text>
        <text x="160" y="30"  fill="#0a0" font-size="12">Control</text>
        <text x="170" y="190" fill="#06f" font-size="12">End</text>
    </svg>
</div>

To get the over/under effect, a stroke-dasharray is added to the path element.  The stroke-dasharray is defined by the intersection of the curve with itself.  SVG paths can be broken into points using the getPointAtLength function.  This allows the path to be broken into segments, and the intersection of the segments can be found.  The intersection is found by using the path_intersections function.  Each intersection pair of points is then checked on the line to make sure the points are close enough to be considered an intersection.  The path_intersections function returns an array of intersection points.  The intersection points are then used to define the stroke-dasharray with alternating overs and unders.  Unders are defined as a gap of 20, centered on the intersection point.  The stroke-dasharray is then added to the path element.
This is very computationally expensive, and can take a long time to calculate.  This area can be improved by using a more efficient algorithm to find the intersections.  TODO

<svg width="200" height="200" viewBox="-50 -50 100 100"><path id="matpath" fill="none" stroke="#999" stroke-width="2" d="M-18.186533479473212,-10.499999999999998 C-43.18653347947322,32.80127018922193,-40.00000000000001,41.99999999999999 -7.715274834628325e-15,42 39.99999999999999,42.00000000000001,43.1865334794732,32.80127018922194 18.186533479473212,-10.499999999999998 -6.813466520526795,-53.80127018922193,-16.373066958946406,-55.64101615137753 -36.373066958946424,-20.999999999999996 -56.373066958946424,13.641016151377546,-50,21 1.2858791391047208e-15,21 50,20.999999999999993,56.37306695894642,13.641016151377553 36.373066958946424,-20.999999999999996 16.37306695894642,-55.64101615137754,6.813466520526777,-53.80127018922194 -18.186533479473212,-10.500000000000002" stroke-dasharray="123,20,146,20,146,20,1000000"></path></svg>

With points and control points:

<svg width="200" height="200" viewBox="-60 -60 120 120">
<path id="matpathpcp" fill="none" stroke="#666" stroke-width="3" d="M-18.186533479473212,-10.499999999999998 C-43.18653347947322,32.80127018922193,-40.00000000000001,41.99999999999999 -7.715274834628325e-15,42 39.99999999999999,42.00099999999999,43.1865334794732,32.80127018922194 18.186533479473212,-10.499999999999998 -6.813466520526795,-53.80127018922193,-16.373066958946406,-55.64101615137753 -36.373066958946424,-20.999999999999996 -56.373066958946424,13.641016151377546,-50,21 1.2858791391047208e-15,21 50,20.999999999999993,56.37306695894642,13.641016151377553 36.373066958946424,-20.999999999999996 16.37306695894642,-55.64101615137754,6.813466520526777,-53.80127018922194 -18.186533479473212,-10.500000000000002" stroke-dasharray="123,20,146,20,146,20,1000000">
</path>
<line   x1="-18.186533479473212"    y1="-10.499999999999998" x2="0" y2="0" index="0" stroke="#5ba1d5"></line>
<line   x1="-7.715274834628325e-15" y1="42"                  x2="0" y2="0" index="1" stroke="#5ba1d5"></line>
<line   x1="18.186533479473212"     y1="-10.499999999999998" x2="0" y2="0" index="2" stroke="#5ba1d5"></line>
<line   x1="-36.373066958946424"    y1="-20.999999999999996" x2="0" y2="0" index="3" stroke="#5ba1d5"></line>
<line   x1="1.2858791391047208e-15" y1="21"                  x2="0" y2="0" index="4" stroke="#5ba1d5"></line>
<line   x1="36.373066958946424"     y1="-20.999999999999996" x2="0" y2="0" index="5" stroke="#5ba1d5"></line>
<line   x1="-18.186533479473212"    y1="-10.500000000000002" x2="0" y2="0" index="6" stroke="#5ba1d5"></line>
<circle cx="-18.186533479473212"    cy="-10.499999999999998" r="3" index="0" fill="#5ba1d5"></circle>
<circle cx="-7.715274834628325e-15" cy="42"                  r="3" index="1" fill="#5ba1d5"></circle>
<circle cx="18.186533479473212"     cy="-10.499999999999998" r="3" index="2" fill="#5ba1d5"></circle>
<circle cx="-36.373066958946424"    cy="-20.999999999999996" r="3" index="3" fill="#5ba1d5"></circle>
<circle cx="1.2858791391047208e-15" cy="21"                  r="3" index="4" fill="#5ba1d5"></circle>
<circle cx="36.373066958946424"     cy="-20.999999999999996" r="3" index="5" fill="#5ba1d5"></circle>
<circle cx="-18.186533479473212"    cy="-10.500000000000002" r="3" index="6" fill="#5ba1d5"></circle>
<line   x1="-18.186533479473212"    y1="-10.499999999999998" x2="6.813466520526809"   y2="-53.80127018922192" index="0" stroke="#aaa" stroke-dasharray="5,5"></line>
<line   x1="-7.715274834628325e-15" y1="42"                  x2="-40.00000000000001"  y2="41.99999999999999"  index="1" stroke="#eee" stroke-dasharray="5,5"></line>
<line   x1="18.186533479473212"     y1="-10.499999999999998" x2="43.1865334794732"    y2="32.80127018922194"  index="2" stroke="#eee" stroke-dasharray="5,5"></line>
<line   x1="-36.373066958946424"    y1="-20.999999999999996" x2="-16.373066958946406" y2="-55.64101615137753" index="3" stroke="#eee" stroke-dasharray="5,5"></line>
<line   x1="1.2858791391047208e-15" y1="21"                  x2="-50"                 y2="21"                 index="4" stroke="#eee" stroke-dasharray="5,5"></line>
<line   x1="36.373066958946424"     y1="-20.999999999999996" x2="56.37306695894642"   y2="13.641016151377553" index="5" stroke="#eee" stroke-dasharray="5,5"></line>
<line   x1="-18.186533479473212"    y1="-10.500000000000002" x2="6.813466520526777"   y2="-53.80127018922194" index="6" stroke="#eee" stroke-dasharray="5,5"></line>
<circle cx="6.813466520526809"      cy="-53.80127018922192"  r="2" index="0" fill="#d9a400"></circle>
<circle cx="-40.00000000000001"     cy="41.99999999999999"   r="2" index="1" fill="#d9a400"></circle>
<circle cx="43.1865334794732"       cy="32.80127018922194"   r="2" index="2" fill="#d9a400"></circle>
<circle cx="-16.373066958946406"    cy="-55.64101615137753"  r="2" index="3" fill="#d9a400"></circle>
<circle cx="-50"                    cy="21"                  r="2" index="4" fill="#d9a400"></circle>
<circle cx="56.37306695894642"      cy="13.641016151377553"  r="2" index="5" fill="#d9a400"></circle>
<circle cx="6.813466520526777"      cy="-53.80127018922194"  r="2" index="6" fill="#d9a400"></circle>
<line   x1="-18.186533479473212"    y1="-10.499999999999998" x2="-43.18653347947322"  y2="32.80127018922193"  index="0" stroke="#eee" stroke-dasharray="5,5"></line>
<line   x1="-7.715274834628325e-15" y1="42"                  x2="39.99999999999999"   y2="42.00000000000001"  index="1" stroke="#eee" stroke-dasharray="5,5"></line>
<line   x1="18.186533479473212"     y1="-10.499999999999998" x2="-6.813466520526795"  y2="-53.80127018922193" index="2" stroke="#eee" stroke-dasharray="5,5"></line>
<line   x1="-36.373066958946424"    y1="-20.999999999999996" x2="-56.373066958946424" y2="13.641016151377546" index="3" stroke="#eee" stroke-dasharray="5,5"></line>
<line   x1="1.2858791391047208e-15" y1="21"                  x2="50"                  y2="20.999999999999993" index="4" stroke="#eee" stroke-dasharray="5,5"></line>
<line   x1="36.373066958946424"     y1="-20.999999999999996" x2="16.37306695894642"   y2="-55.64101615137754" index="5" stroke="#eee" stroke-dasharray="5,5"></line>
<line   x1="-18.186533479473212"    y1="-10.500000000000002" x2="-43.18653347947322"  y2="32.80127018922193"  index="6" stroke="#eee" stroke-dasharray="5,5"></line>
<circle cx="-43.18653347947322"     cy="32.80127018922193"   r="2" index="0" fill="#d9a400"></circle>
<circle cx="39.99999999999999"      cy="42.00000000000001"   r="2" index="1" fill="#d9a400"></circle>
<circle cx="-6.813466520526795"     cy="-53.80127018922193"  r="2" index="2" fill="#d9a400"></circle>
<circle cx="-56.373066958946424"    cy="13.641016151377546"  r="2" index="3" fill="#d9a400"></circle>
<circle cx="50"                     cy="20.999999999999993"  r="2" index="4" fill="#d9a400"></circle>
<circle cx="16.37306695894642"      cy="-55.64101615137754"  r="2" index="5" fill="#d9a400"></circle>
<circle cx="-43.18653347947322"     cy="32.80127018922193"   r="2" index="6" fill="#d9a400"></circle>
</svg>

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


