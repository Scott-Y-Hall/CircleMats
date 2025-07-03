import { createPoint } from '../util.js';
import { getControls } from '../sliders.js';
import { control_flags } from '../mat.js';

export function RadianceKnot() {
    control_flags.Fit = 1;
    const c = getControls(6);
    //c.tilt = 12;
    const nodepoints = [];
    for (let x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.largeCircle, x * c.angle - c.angle / 2, c.startcp, c.startcp));
        nodepoints.push(createPoint(c.smallCircle, x * c.angle - (7 * c.angle) / 4, -c.extracp * 10, -c.midcp, -c.tilt));
        nodepoints.push(createPoint(c.extraCircle, x * c.angle - (0 * c.angle) / 6, -c.midcp / 2, -c.midcp / 2, -40));
        nodepoints.push(createPoint(c.largeCircle, x * c.angle + 0 * c.angle, c.midcp, c.midcp));
        nodepoints.push(createPoint(c.extraCircle, x * c.angle + (0 * c.angle) / 6, -c.midcp / 2, -c.midcp / 2, 40));
        nodepoints.push(createPoint(c.smallCircle, x * c.angle + (7 * c.angle) / 4, -c.midcp, -c.extracp * 10, c.tilt));
    }
    nodepoints.push(createPoint(c.largeCircle, (c.knots - 1) * c.angle + c.angle / 2, c.startcp, c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}

export function SardinaKnot() {
    const c = getControls(4);
    const nodepoints = [];
    for (let x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.largeCircle, -x * c.angle + c.angle / 2, c.startcp, c.startcp));
        nodepoints.push(createPoint(300, -x * c.angle - c.angle / 5, c.angle, c.midcp / 2));
        if (x % 2) {
            nodepoints.push(createPoint(c.smallCircle * 2, -x * c.angle, -c.midcp / 2, -c.midcp / 2));
        } else {
            nodepoints.push(createPoint(c.smallCircle, -x * c.angle + 180, c.midcp, c.midcp));
        }
        nodepoints.push(createPoint(300, -x * c.angle + c.angle / 5, c.midcp / 2, c.angle));
    }
    nodepoints.push(createPoint(c.largeCircle, -(c.knots - 1) * c.angle - c.angle / 2, c.startcp, c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}

export function SardinaAltKnot() {
    const c = getControls(4);
    const nodepoints = [];
    for (let x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.largeCircle, -x * c.angle + c.angle / 2, c.startcp, c.startcp));
        nodepoints.push(createPoint(300, -x * c.angle - c.angle / 5, c.angle, c.midcp / 2));
        if (x % 2) {
            nodepoints.push(createPoint(-(c.smallCircle + c.largeCircle) / 2, -x * c.angle, -c.midcp, -c.midcp));
        } else {
            nodepoints.push(createPoint(c.smallCircle, -x * c.angle + 180, c.midcp, c.midcp));
        }
        nodepoints.push(createPoint(300, -x * c.angle + c.angle / 5, c.midcp / 2, c.angle));
    }
    nodepoints.push(createPoint(c.largeCircle, -(c.knots - 1) * c.angle - c.angle / 2, c.startcp, c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}

export function Sardina2Knot() {
    const c = getControls(4);
    const nodepoints = [];
    for (let x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.smallCircle, -x * c.angle + c.angle / 2, c.startcp, c.startcp));
        nodepoints.push(createPoint(300, -x * c.angle + c.angle / 3, -c.startcp / 3, -c.midcp));
        nodepoints.push(createPoint(c.largeCircle, -x * c.angle + 180, -c.midcp, -c.midcp));
        nodepoints.push(createPoint(300, -x * c.angle - c.angle / 3, -c.midcp, -c.startcp / 3));
    }
    nodepoints.push(createPoint(c.smallCircle, -(c.knots - 1) * c.angle - c.angle / 2, c.startcp, c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}

export function Sardina3Knot() {
    const c = getControls(2);
    const nodepoints = [];
    for (let x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(-c.smallCircle, -x * c.angle + c.angle / 2, c.startcp, c.startcp));
        nodepoints.push(createPoint(c.largeCircle, -x * c.angle + 180, c.midcp, c.midcp));
    }
    nodepoints.push(createPoint(-c.smallCircle, -(c.knots - 1) * c.angle - c.angle / 2, c.startcp, c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}

export function Sardina4Knot() {
    const c = getControls(7);
    let skip = Math.ceil(c.knots / 2);
    let factor = (c.knots + 18) / 30;
    const nodepoints = [];
    for (let x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.smallCircle, skip * x * c.angle, -c.startcp, -c.startcp));
        nodepoints.push(createPoint(c.largeCircle, 180 + skip * x * c.angle - c.angle / 8, -c.midcp, -c.angle));
        nodepoints.push(createPoint(c.largeCircle * factor, 180 + skip * x * c.angle + (2 * c.angle) / 8, -c.angle, -c.angle));
        nodepoints.push(createPoint(c.largeCircle, 180 + skip * x * c.angle + (5 * c.angle) / 8, -c.angle, -c.midcp / 2));
        nodepoints.push(createPoint(c.largeCircle, skip * x * c.angle - c.angle / 8, -c.midcp / 2, -c.angle));
        nodepoints.push(createPoint(c.largeCircle * factor, skip * x * c.angle + (2 * c.angle) / 8, -c.angle, -c.angle));
        nodepoints.push(createPoint(c.largeCircle, skip * x * c.angle + (5 * c.angle) / 8, -c.angle, -c.midcp));
    }
    nodepoints.push(createPoint(c.smallCircle, (skip * c.knots - 0) * c.angle, -c.startcp, -c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}

export function Sardina5Knot() {
    const c = getControls(6);
    const nodepoints = [];
    for (let x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.largeCircle, -x * c.angle + c.angle / 2, 30 + c.angle, 30 + c.angle));
        nodepoints.push(createPoint(300, -x * c.angle - c.angle / 5, c.angle, c.midcp / 2));
        nodepoints.push(createPoint(c.extraCircle, -x * c.angle - c.extraAngle - c.angle / 5, c.extracp, c.extracp, c.tilt));
        nodepoints.push(createPoint(c.smallCircle, -x * c.angle + 180, -c.startcp, -c.startcp));
        nodepoints.push(createPoint(c.extraCircle, -x * c.angle + c.extraAngle + c.angle / 5, c.extracp, c.extracp, -c.tilt));
        nodepoints.push(createPoint(300, -x * c.angle + c.angle / 5, c.midcp / 2, c.angle));
    }
    nodepoints.push(createPoint(c.largeCircle, -(c.knots - 1) * c.angle - c.angle / 2, 150, 150));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}
