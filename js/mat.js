import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
const { select } = d3;
import { createKnotPoints, matName } from './matPoints.js';
import { createPointString } from './util.js';
import { underOver, intersections, sliderdragstarted } from './sliders.js';

// These will be initialized by the main application
let circle_g = null;
let color = null;
let highlights_g = null;
let mat_g = null;
let segments_g = null;

// Function to initialize mat module with required dependencies
export function initMatModule(circleGroup, colorScale, highlightsGroup, matGroup, segmentsGroup) {
    circle_g = circleGroup;
    color = colorScale;
    highlights_g = highlightsGroup;
    mat_g = matGroup;
    segments_g = segmentsGroup;
    
    // Return the public API
    return {
        updateMat,
        svgFullScreen,
        control_flags,
        // Export other functions that need to be called from outside
    };
}

//d3.select("#segment").on("change", function() { updateMat(); });
//draw_intersections( pathX );

/**
 * Updates the mat display with the provided knot points or creates new ones
 * @param {Array} [knotpoints] - Optional array of knot points to display
 * @param {string} [newMatType] - Optional mat type to use when creating new knot points
 */
export function updateMat(knotpoints, newMatType) {
    if (!circle_g || !highlights_g || !mat_g || !segments_g) {
        console.error('Mat module not properly initialized');
        return;
    }
    
    // If no knotpoints provided, create them with optional matType
    const pointsToUse = knotpoints || createKnotPoints(newMatType);
    
    showCircles();
    select('#title').text(matName());

    if (control_flags.CtrlPts) {
        showControlPoints(pointsToUse);
    } else {
        showControlPoints([]);
    }
    updatePaths(pointsToUse);
}

export function updatePaths(knotpoints) {
    if (!highlights_g || !segments_g) {
        console.error('Mat module not properly initialized');
        return;
    }
    
    let tail = [];
    if (knotpoints.length > 1 && knotpoints[knotpoints.length - 2].mode == 'end2') {
        tail = JSON.parse(JSON.stringify(knotpoints)); // Deep copy
        knotpoints[knotpoints.length - 2].mode = 'end';
        knotpoints.splice(knotpoints.length - 1);
    }
    
    const svg = select('#mat g svg');
    if (!svg.empty()) {
        svg.selectAll('path')
            .data([tail, knotpoints])
            .join('path')
            .attr('d', d => d.map((p) => createPointString(p)).toString());
    }
    
    const matpath = select('#matpath');
    const sliderData = select('#sliders').selectAll('g').data();
    const show = Array.isArray(sliderData) ? sliderData.find((d) => d && d.name === 'Segments') : null;
    let dasharray = '';

    PAL = [];
    
    if (show && show.value === show.max) {
        if (control_flags.UnderOver) {
            dasharray = create_dasharray(path_intersections(matpath));
        }
        svg.selectAll('path').attr('stroke-dasharray', dasharray);
    }
    
    if (control_flags.Int) {
        draw_intersections(path_intersections(matpath));
    } else if (highlights_g) {
        highlights_g.selectAll('circle').remove();
    }
    
    svgMatZoom();
}

export function showControlPoints(knotpoints) {
    if (!mat_g) {
        console.error('mat_g is not initialized');
        return;
    }
    
    var matt_cp = mat_g.selectAll('g').data([knotpoints]).join('g');
    matt_cp
        .selectAll('g')
        .data((d) => [d, d, d])
        .join('g')
        .attr('class', (d, i) => 'line' + i);
    matt_cp
        .selectAll('g.line0')
        .selectAll('line')
        .data((d) => d)
        .join('line')
        .attr('x1', (d) => d.p.x)
        .attr('y1', (d) => d.p.y)
        .attr('x2', '0')
        .attr('y2', '0')
        .attr('index', (d, i) => i)
        .attr('stroke', '#5ba1d5');
    matt_cp
        .selectAll('g.line0')
        .selectAll('circle')
        .data((d) => d)
        .join('circle')
        .attr('cx', (d) => d.p.x)
        .attr('cy', (d) => d.p.y)
        .attr('r', 14)
        .attr('index', (d, i) => i)
        .attr('fill', '#5ba1d5')
        .call(pointdrag);
    matt_cp
        .selectAll('g.line1')
        .selectAll('line')
        .data((d) => d)
        .join('line')
        .attr('x1', (d) => d.p.x)
        .attr('y1', (d) => d.p.y)
        .attr('x2', (d) => d.cp1.x)
        .attr('y2', (d) => d.cp1.y)
        .attr('index', (d, i) => i)
        .attr('stroke', '#727272');
    matt_cp
        .selectAll('g.line1')
        .selectAll('circle')
        .data((d) => d)
        .join('circle')
        .attr('cx', (d) => d.cp1.x)
        .attr('cy', (d) => d.cp1.y)
        .attr('r', 14)
        .attr('index', (d, i) => i)
        .attr('fill', '#d9a400')
        .call(cp1drag);
    matt_cp
        .selectAll('g.line2')
        .selectAll('line')
        .data((d) => d)
        .join('line')
        .attr('x1', (d) => d.p.x)
        .attr('y1', (d) => d.p.y)
        .attr('x2', (d) => d.cp2.x)
        .attr('y2', (d) => d.cp2.y)
        .attr('index', (d, i) => i)
        .attr('stroke', '#727272');
    matt_cp
        .selectAll('g.line2')
        .selectAll('circle')
        .data((d) => d)
        .join('circle')
        .attr('cx', (d) => d.cp2.x)
        .attr('cy', (d) => d.cp2.y)
        .attr('r', 14)
        .attr('index', (d, i) => i)
        .attr('fill', '#d9a400')
        .call(cp2drag);
}

export function showCircles() {
    if (!circle_g) {
        console.error('circle_g is not initialized');
        return;
    }
    
    const sliderData = select('#sliders').selectAll('g').data();
    const getSliderValue = (name, defaultValue = 0) => {
        const slider = Array.isArray(sliderData) ? sliderData.find(d => d && d.name === name) : null;
        return slider ? slider.value : defaultValue;
    };
    
    const largeCircle = getSliderValue('LargeCircle', 100);
    const smallCircle = getSliderValue('SmallCircle', 50);
    const extraCircle = getSliderValue('ExtraCircle', 0);
    const middleCircle = (largeCircle + smallCircle) / 2;
    
    let circles = [];
    const lines = [];
    
    if (control_flags.Circles) {
        circles = [
            { x: 0, y: 0, r: smallCircle },
            { x: 0, y: 0, r: middleCircle },
            { x: 0, y: 0, r: largeCircle },
            { x: 0, y: 0, r: extraCircle },
        ].filter(circle => circle.r !== 0); // Only show circles with non-zero radius
        
        lines.push(
            [-390, 0, 390, 0],
            [0, -390, 0, 390]
        );
    }
    
    // Update circles
    circle_g
        .selectAll('circle')
        .data(circles, (d, i) => `${d.r}-${i}`)
        .join(
            enter => enter.append('circle')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('r', d => Math.abs(d.r))
                .attr('fill', 'none')
                .attr('stroke', '#000000'),
            update => update
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('r', d => Math.abs(d.r)),
            exit => exit.remove()
        );
        
    // Update crosshair lines
    const linesGroup = circle_g.selectAll('g.crosshair').data(control_flags.Circles ? [lines] : []);
    
    linesGroup.exit().remove();
    
    const linesEnter = linesGroup.enter()
        .append('g')
        .attr('class', 'crosshair');
        
    linesEnter.merge(linesGroup)
        .selectAll('line')
        .data(d => d)
        .join('line')
        .attr('x1', d => d[0])
        .attr('y1', d => d[1])
        .attr('x2', d => d[2])
        .attr('y2', d => d[3])
        .attr('stroke', '#000000')
        .attr('stroke-width', 1);
    
    // Style circles with red stroke if radius is negative
    circle_g.selectAll('circle')
        .attr('stroke', d => d.r < 0 ? 'red' : '#181818');
        
    return { largeCircle, smallCircle, middleCircle, extraCircle };
    circle_g
        .selectAll('line')
        .data(lines)
        .join('line')
        .attr('x1', (d) => d[0])
        .attr('y1', (d) => d[1])
        .attr('x2', (d) => d[2])
        .attr('y2', (d) => d[3])
        .attr('stroke', '#181818');
}

function pointdragged(event, d) {
    let knotpoints = d3.select('#matpath').datum();
    let index = d3.select(this).attr('index');
    d3.select(this).attr('cx', knotpoints[index].p.x = event.x).attr('cy', knotpoints[index].p.y = event.y);
    d3.select(this.parentNode.parentNode).selectAll("line[index='" + index + "']").attr('x1', event.x).attr('y1', event.y);
    updatePaths(knotpoints);
    //showControlPoints(knotpoints);
}

function cp1dragged(event, d) {
    let knotpoints = d3.select('#matpath').datum();
    let index = d3.select(this).attr('index');
    d3.select(this).attr('cx', knotpoints[index].cp1.x = event.x).attr('cy', knotpoints[index].cp1.y = event.y);
    d3.select(this.parentNode).selectAll("line[index='" + index + "']").attr('x2', event.x).attr('y2', event.y);
    updatePaths(knotpoints);
    //showControlPoints(knotpoints);
}

function cp2dragged(event, d) {
    let knotpoints = d3.select('#matpath').datum();
    let index = d3.select(this).attr('index');
    d3.select(this).attr('cx', knotpoints[index].cp2.x = event.x).attr('cy', knotpoints[index].cp2.y = event.y);
    d3.select(this.parentNode).selectAll("line[index='" + index + "']").attr('x2', event.x).attr('y2', event.y);
    updatePaths(knotpoints);
    //showControlPoints(knotpoints);
}

function cpdragended() {
    d3.select(this).classed('on', 0);
    control_flags.UnderOver = underOver;
    control_flags.Int = intersections;
    let knotpoints = d3.select('#matpath').datum();
    updatePaths(knotpoints);
}

export const cp1drag = d3.drag().on('start', sliderdragstarted).on('drag', cp1dragged).on('end', cpdragended);
export const cp2drag = d3.drag().on('start', sliderdragstarted).on('drag', cp2dragged).on('end', cpdragended);
export const pointdrag = d3.drag().on('start', sliderdragstarted).on('drag', pointdragged).on('end', cpdragended);
function draw_segments(path, qty) {
    var length = path.node().getTotalLength();
    var segments = [];
    if (qty > 0) {
        for (var i = 0; i < qty; i++) {
            var pos1 = getPAL(path, (length * i) / qty);
            var pos2 = getPAL(path, (length * (i + 1)) / qty);
            segments.push({ pos1: pos1, pos2: pos2 });
        }
    }
    segments_g
        .selectAll('line')
        .data(segments)
        .join('line')
        .attr('class', 'segment')
        .attr('x1', (d) => d.pos1.x)
        .attr('y1', (d) => d.pos1.y)
        .attr('x2', (d) => d.pos2.x)
        .attr('y2', (d) => d.pos2.y)
        .attr('stroke', (d, i) => color(i));
}

export function draw_intersections(pts) {
    if (!highlights_g) {
        console.error('highlights_g is not initialized');
        return;
    }
    
    // Clear existing intersection markers
    highlights_g.selectAll('circle').remove();
    
    // Add new intersection markers for each intersection point
    pts.forEach(function (pt) {
        // Large circles (outlines)
        highlights_g.append('circle').attr('cx', pt.p1.x).attr('cy', pt.p1.y).attr('r', 8).attr('fill', 'none').attr('stroke', 'red');
        highlights_g.append('circle').attr('cx', pt.p2.x).attr('cy', pt.p2.y).attr('r', 8).attr('fill', 'none').attr('stroke', 'green');
        highlights_g.append('circle').attr('cx', pt.x).attr('cy', pt.y).attr('r', 8).attr('fill', 'none').attr('stroke', 'steelblue');
            
        // Small filled circles
        highlights_g.append('circle').attr('cx', pt.p1.x).attr('cy', pt.p1.y).attr('r', 2).attr('fill', 'red').attr('stroke', 'none');
        highlights_g.append('circle').attr('cx', pt.p2.x).attr('cy', pt.p2.y).attr('r', 2).attr('fill', 'green').attr('stroke', 'none');
        highlights_g.append('circle').attr('cx', pt.x).attr('cy', pt.y).attr('r', 2).attr('fill', 'steelblue').attr('stroke', 'none');
    });
}

export function create_dasharray(pathX) {
    var dasharray = '';
    var arrayX = pathX.flatMap((d) => [d.i1, d.i2]).sort((a, b) => a - b);
    var min = 100000;
    for (var i = 0; i < arrayX.length - 1; i++) {
        min = Math.min(min, arrayX[i + 1] - arrayX[i]);
    }
    //console.log(min);
    var curPos = 0;
    for (var i = 1; i < arrayX.length; i += 2) {
        var seg_length = arrayX[i] - curPos - 10;
        if (seg_length < 0) {
            seg_length = 0;
        }
        dasharray += seg_length + ',20,';
        curPos = arrayX[i] + 10;
    }
    dasharray += '1000000'; // Fix this with a sane value 20210219 SYH
    return dasharray;
}

function distance_to_closest_X(point, pathX) {
    return d3.min(pathX.map((d) => (point.x - d.x) ** 2 + (point.y - d.y) ** 2));
    return Math.sqrt(d3.min(pathX.map((d) => (point.x - d.x) ** 2 + (point.y - d.y) ** 2)));
}

export function adjust_point(pt, path) {
    var startP1 = getPAL(path, pt.i1);
    var startP2 = getPAL(path, pt.i2);
    var startDist = Math.sqrt((startP1.x - startP2.x) ** 2 + (startP1.y - startP2.y) ** 2);
    var minDist = startDist;
    var minI1 = pt.i1;
    var minI2 = pt.i2;
    var moved = false;
    if (minDist < 0.05) return moved;
    //console.log(startDist);
    for (var i = pt.i1 - 2; i <= pt.i1 + 2; i++) {
        for (var j = pt.i2 - 2; j <= pt.i2 + 2; j++) {
            if (i < 0) {
                i = 0;
            }
            if (j < 0) {
                j = 0;
            }
            var curP1 = getPAL(path, i);
            var curP2 = getPAL(path, j);
            var curDist = Math.sqrt((curP1.x - curP2.x) ** 2 + (curP1.y - curP2.y) ** 2);
            if (curDist < minDist) {
                moved = true;
                minDist = curDist;
                minI1 = i;
                minI2 = j;
                //console.log( curDist, i,pt.i1,j,pt.i2 );
            }
        }
    }
    pt.i1 = minI1;
    pt.i2 = minI2;
    return moved;
}

export function path_intersections(path) {
    var data = d3.select('#sliders').selectAll('g').data();
    var knots = data.find((d) => d.name == 'Knots').value;
    var length = path.node().getTotalLength();
    var step = Math.floor(length / knots / 50);
    var nodes = [];
    for (var i = 0; i < length; i += step) {
        nodes.push({ p: getPAL(path, i), i });
    }
    nodes.push({ p: getPAL(path, length), i: length });
    var pts = [];
    var segments = [];
    for (var i = 0; i < nodes.length - 3; i++) {
        var pos1 = nodes[i];
        var pos2 = nodes[i + 1];
        //segments.push({pos1:pos1.p, pos2:pos2.p});
        var line1 = { x1: pos1.p.x, x2: pos2.p.x, y1: pos1.p.y, y2: pos2.p.y, i1: pos1.i, i2: pos2.i };
        for (var j = i + 2; j < nodes.length - 1; j++) {
            var pos3 = nodes[j];
            var pos4 = nodes[j + 1];
            var line2 = { x1: pos3.p.x, x2: pos4.p.x, y1: pos3.p.y, y2: pos4.p.y, i1: pos3.i, i2: pos4.i };
            var pt = line_line_intersect(line1, line2);
            if (typeof pt != 'string') {
                while (adjust_point(pt, path)) {
                    1;
                }
                pt.p1 = getPAL(path, pt.i1);
                pt.p2 = getPAL(path, pt.i2);
                pts.push(pt);
                //console.log(pt);
                //draw_intersections(pts);
            }
        }
    }
    segments_g
        .selectAll('line')
        .data(segments)
        .join('line')
        .attr('class', 'segment')
        .attr('x1', (d) => d.pos1.x)
        .attr('y1', (d) => d.pos1.y)
        .attr('x2', (d) => d.pos2.x)
        .attr('y2', (d) => d.pos2.y)
        .attr('stroke', (d, i) => color(i));
    return pts;
}

export function getPAL(path, i) {
    if (typeof PAL[i] === 'undefined') {
        PAL[i] = path.node().getPointAtLength(i);
    }
    return PAL[i];
}
export let PAL = [];
export function line_line_intersect(line1, line2) {
    var x1 = line1.x1, x2 = line1.x2, x3 = line2.x1, x4 = line2.x2;
    var y1 = line1.y1, y2 = line1.y2, y3 = line2.y1, y4 = line2.y2;
    var pt_denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    var pt_x_num = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
    var pt_y_num = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
    if (pt_denom == 0) {
        return 'parallel';
    } else {
        var pt = { x: pt_x_num / pt_denom, y: pt_y_num / pt_denom };
        var per1 = (pt.x - x1) / (x2 - x1);
        var per2 = (pt.x - x3) / (x4 - x3);
        pt.i1 = Math.round((line1.i2 - line1.i1) * per1 + line1.i1);
        pt.i2 = Math.round((line2.i2 - line2.i1) * per2 + line2.i1);
        if (btwn(pt.x, x1, x2) && btwn(pt.y, y1, y2) && btwn(pt.x, x3, x4) && btwn(pt.y, y3, y4)) {
            return pt;
        } else {
            return 'not in range';
        }
    }
}

export function btwn(a, b1, b2) {
    if (a >= b1 && a <= b2) {
        return true;
    }
    if (a >= b2 && a <= b1) {
        return true;
    }
    return false;
}

export function svgFullScreen() {
    var htmlwidth = select('html').node().clientWidth;
    var htmlheight = select('html').node().clientHeight;
    //console.log(htmlwidth + ',' + htmlheight);
    select('#mat').attr('width', htmlwidth).attr('height', htmlheight);
}
export function svgMatZoom() {
    var vbox = '-400 -400 800 800';
    if (control_flags.Fit) {
        var bbox = select('#mat svg').node().getBBox();
        var off = Math.floor(Math.min(bbox.x - 9, bbox.y - 9, -400) / 10) * 10;
        var size = -2 * off;
        vbox = off + ' ' + off + ' ' + size + ' ' + size;
    }
    select('#mat svg').attr('viewBox', vbox);
}
export const control_flags = {
    CtrlPts: false,
    UnderOver: 0,
    Int: 0,
    SingleLoop: false,
    Circles: false,
    Dev: false
};

