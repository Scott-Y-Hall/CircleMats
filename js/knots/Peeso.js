import { createPoint } from '../util.js';
import { getControls } from '../sliders.js';

export function createPeesoKnot() {
    var c = getControls(2);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.smallCircle, -x * c.angle + c.angle / 2, c.startcp, c.startcp));
        nodepoints.push(createPoint(c.largeCircle, -x * c.angle + 180, c.midcp, c.midcp));
    }
    nodepoints.push(createPoint(c.smallCircle, -(c.knots - 1) * c.angle - c.angle / 2, c.startcp, c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}
