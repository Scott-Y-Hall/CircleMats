import { createPoint } from '../util.js';
import { getControls } from '../sliders.js';

export function WarlowKnot() {
    const c = getControls(4);
    const nodepoints = [];
    for (let x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.smallCircle, -x * c.angle + c.angle / 2, c.startcp, c.startcp));
        nodepoints.push(createPoint(300, -x * c.angle - (180 - c.angle / 4), c.startcp, c.startcp));
        nodepoints.push(createPoint(-c.largeCircle, -x * c.angle, c.midcp, c.midcp));
        nodepoints.push(createPoint(300, -x * c.angle + (180 - c.angle / 4), c.startcp, c.startcp));
    }
    nodepoints.push(createPoint(c.smallCircle, -(c.knots - 1) * c.angle - c.angle / 2, c.startcp, c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}
export function Warlow2Knot() {
    const c = getControls(4);
    const nodepoints = [];
    for (let x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.smallCircle, -x * c.angle + c.angle / 2, -c.startcp, -c.startcp));
        nodepoints.push(createPoint(300, -x * c.angle + 180 + (3 * c.angle) / 4, -c.startcp, -c.midcp));
        nodepoints.push(createPoint(c.largeCircle, -x * c.angle, -c.midcp, -c.midcp));
        nodepoints.push(createPoint(300, -x * c.angle + 180 - (3 * c.angle) / 4, -c.midcp, -c.startcp));
    }
    nodepoints.push(createPoint(c.smallCircle, -(c.knots - 1) * c.angle - c.angle / 2, -c.startcp, -c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}
