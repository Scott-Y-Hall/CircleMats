import { createPoint } from '../util.js';
import { getControls } from '../sliders.js';

export function VainovskaKnot() {
    var c = getControls(4);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.smallCircle, -x * c.angle + c.angle / 2, c.startcp / 2, c.startcp / 2));
        nodepoints.push(createPoint(c.middleCircle, -x * c.angle + c.angle / 4, -c.startcp / 2, -c.midcp / 2));
        nodepoints.push(createPoint(c.largeCircle, -x * c.angle, c.midcp, c.midcp));
        nodepoints.push(createPoint(c.middleCircle, -x * c.angle - c.angle / 4, -c.midcp / 2, -c.startcp / 2));
    }
    nodepoints.push(createPoint(c.smallCircle, -(c.knots - 1) * c.angle - c.angle / 2, c.startcp / 2, c.startcp / 2));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}

export function Vainovska2Knot() {
    var c = getControls(6);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.middleCircle, -x * c.angle + c.angle / 2, c.startcp / 3, c.startcp / 3));
        nodepoints.push(createPoint(c.extraCircle, -x * c.angle + c.extraAngle, -c.cp1 * 5, -c.cp2 * 5, c.tilt));
        nodepoints.push(createPoint(c.smallCircle, -x * c.angle - c.angle / 4, c.midcp, c.midcp));
        nodepoints.push(createPoint(c.largeCircle, -x * c.angle, -c.startcp * 0.7, -c.startcp * 0.7));
        nodepoints.push(createPoint(c.smallCircle, -x * c.angle + c.angle / 4, c.midcp, c.midcp));
        nodepoints.push(createPoint(c.extraCircle, -x * c.angle - c.extraAngle, -c.cp2 * 5, -c.cp1 * 5, -c.tilt));
    }
    nodepoints.push(createPoint(c.middleCircle, -(c.knots - 1) * c.angle - c.angle / 2, c.startcp / 3, c.startcp / 3));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}

export function SamebaKnot() {
    var c = getControls(4);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.smallCircle, x * c.angle - c.angle / 2, -c.startcp / 2, -c.startcp / 2));
        nodepoints.push(createPoint(c.largeCircle, x * c.angle, c.cp2 * 2, c.cp1 * 2, 135));
        nodepoints.push(createPoint(c.extraCircle, x * c.angle + 0, c.midcp, c.midcp));
        nodepoints.push(createPoint(c.largeCircle, x * c.angle, c.cp1 * 2, c.cp2 * 2, -135));
    }
    nodepoints.push(createPoint(c.smallCircle, (c.knots - 1) * c.angle + c.angle / 2, -c.startcp / 2, -c.startcp / 2));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}