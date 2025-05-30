import { createPoint } from '../util.js';
import { getControls } from '../sliders.js';

export function createYetterKnot() {
    var c = getControls(4);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.largeCircle, -x * c.angle + c.angle / 2, c.startcp, c.startcp));
        nodepoints.push(createPoint(300, -x * c.angle - c.angle / 5, c.angle, c.midcp / 2));
        nodepoints.push(createPoint(c.smallCircle, -x * c.angle + 180, c.midcp, c.midcp));
        nodepoints.push(createPoint(300, -x * c.angle + c.angle / 5, c.midcp / 2, c.angle));
    }
    nodepoints.push(createPoint(c.largeCircle, -(c.knots - 1) * c.angle - c.angle / 2, c.startcp, c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}

export function createYetterPlusKnot() {
    var c = getControls(8);
    //c.tilt = 14;
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.middleCircle, -x * c.angle + c.angle / 2, c.startcp, c.startcp));
        nodepoints.push(createPoint(390, -x * c.angle - (3 * c.angle) / 16, -c.angle * 2, -c.angle * 2, -c.tilt));
        nodepoints.push(createPoint(c.largeCircle * 1.0, -x * c.angle - c.angle / 4, c.angle * 2, c.angle * 2));
        nodepoints.push(createPoint(390, -x * c.angle - (5 * c.angle) / 16, -c.angle * 2, -c.midcp * 0.7, c.tilt));
        nodepoints.push(createPoint(c.smallCircle, -x * c.angle + 180, c.midcp, c.midcp));
        nodepoints.push(createPoint(390, -x * c.angle + (5 * c.angle) / 16, -c.midcp * 0.7, -c.angle * 2, -c.tilt));
        nodepoints.push(createPoint(c.largeCircle * 1.0, -x * c.angle + c.angle / 4, c.angle * 2, c.angle * 2));
        nodepoints.push(createPoint(390, -x * c.angle + (3 * c.angle) / 16, -c.angle * 2, -c.angle * 2, c.tilt));
    }
    nodepoints.push(createPoint(c.middleCircle, -(c.knots - 1) * c.angle - c.angle / 2, c.startcp, c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}

export function createKringleKnot() {
    var c = getControls(4);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.largeCircle, -x * c.angle + c.angle / 2, c.startcp, c.startcp));
        nodepoints.push(createPoint(300, -x * c.angle - c.angle / 5, c.angle, c.midcp / 2));
        nodepoints.push(createPoint(c.smallCircle, -x * c.angle, -c.midcp, -c.midcp));
        nodepoints.push(createPoint(300, -x * c.angle + c.angle / 5, c.midcp / 2, c.angle));
    }
    nodepoints.push(createPoint(c.largeCircle, -(c.knots - 1) * c.angle - c.angle / 2, c.startcp, c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}

