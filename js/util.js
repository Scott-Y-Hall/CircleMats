/**
 * Computes a point and its control points for a given size and angle.
 *
 * @param {number} size - The radius or size of the circle.
 * @param {number} angle - The angle in degrees from the positive x-axis.
 * @param {number} cp1 - The offset for the first control point.
 * @param {number} cp2 - The offset for the second control point.
 * @param {number} [tilt=0] - The optional tilt angle in degrees for control points.
 * @returns {Object} An object containing the main point (`p`) and two control points (`cp1`, `cp2`).
 */
export function createPoint(size, angle, cp1, cp2, tilt = 0) {
    angle += 90;
    let x = size * Math.cos((angle * Math.PI) / 180);
    let y = -size * Math.sin((angle * Math.PI) / 180);
    let cpx1 = x + cp1 * Math.cos(((angle + 90 + tilt) * Math.PI) / 180);
    let cpy1 = y - cp1 * Math.sin(((angle + 90 + tilt) * Math.PI) / 180);
    let cpx2 = x + cp2 * Math.cos(((angle - 90 + tilt) * Math.PI) / 180);
    let cpy2 = y - cp2 * Math.sin(((angle - 90 + tilt) * Math.PI) / 180);
    return { p: { x, y }, cp1: { x: cpx1, y: cpy1 }, cp2: { x: cpx2, y: cpy2 } };
}

/**
 * Creates a string representation of a path segment based on the given point data.
 *
 * @param {Object} d - The point data containing the main point (`p`) and control points (`cp1`, `cp2`).
 * @param {Object} d.p - The main point with `x` and `y` coordinates.
 * @param {Object} d.cp1 - The first control point with `x` and `y` coordinates.
 * @param {Object} d.cp2 - The second control point with `x` and `y` coordinates.
 * @param {string} d.mode - The mode of the point ('start', 'end', 'close', or 'middle').
 * @returns {string} A string representing the path segment in SVG path data format.
 */
export function createPointString(d) {
    if (d.mode === 'start') {
        return `M${d.p.x},${d.p.y} C${d.cp2.x},${d.cp2.y}`;
    } else if (d.mode === 'end') {
        return `${d.cp1.x},${d.cp1.y} ${d.p.x},${d.p.y}`;
    } else if (d.mode === 'close') {
        return `${d.cp1.x},${d.cp1.y} ${d.p.x},${d.p.y} Z`;
    } else {
        return `${d.cp1.x},${d.cp1.y} ${d.p.x},${d.p.y} ${d.cp2.x},${d.cp2.y}`;
    }
}
