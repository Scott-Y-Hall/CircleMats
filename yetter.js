import * as d3 from 'https://d3js.org/d3.v6.min.js';
import { button } from './d3.button.js';
import * as definePresets from './definePresets.js';

var matType;
var matName = {
    Y: 'Yetter',
    YPlus: 'Yetter+',
    K: 'Kringle',
    Pe: 'Peeso',
    Pi: 'Piton',
    R: 'Rattan',
    Ra: 'Radiance',
    S: 'Struktor',
    Sa: 'Sardina',
    //Saa: 'Sardina Alt',
    S2: 'Sardina2',
    S3: 'Sardina3',
    S4: 'Sardina4',
    S5: 'Sardina5',
    W: 'Warlow',
    W2: 'Warlow2',
    V: 'Vainovska',
    V2: 'Vainovska2',
};
var matNameArray = Object.keys(matName).map((d) => ({ key: d, value: matName[d] }));
var presets = definePresets.definePresets();
var presetArray = Object.keys(matName).map((d) => ({
    key: d,
    value: Object.keys(presets[d])
        .map(Number)
        .filter((d) => d)
        .sort(d3.ascending),
}));
var color = d3.scaleOrdinal(d3.schemeCategory10);
var matCtrl = { width: 800, height: 800, translate: 'translate(0,50)' };
var sliderCtrl = { width: 800, height: 400, translate: 'translate(0,950)' };
var optionCtrl = { width: 800, height: 450, translate: 'translate(800,500)' };
var width;
var height;
if (window.innerWidth < window.innerHeight) {
    width = Math.max(matCtrl.width, sliderCtrl.width);
    height = matCtrl.height + sliderCtrl.height + optionCtrl.height + 300;
    sliderCtrl.translate = 'translate(0,950)';
    optionCtrl.translate = 'translate(0,1400)';
} else {
    width = matCtrl.width + sliderCtrl.width;
    height = Math.max(matCtrl.height + 100, sliderCtrl.height + optionCtrl.height + 100);
    sliderCtrl.translate = 'translate(800,70)';
}
var svg = d3
    .select('body')
    .append('svg')
    .attr('id', 'mat')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .append('g')
    .attr('transform', matCtrl.translate)
    .append('svg')
    .attr('width', matCtrl.width)
    .attr('height', matCtrl.height)
    .attr('viewBox', '-' + matCtrl.width / 2 + ' -' + matCtrl.height / 2 + ' ' + matCtrl.width + ' ' + matCtrl.height);
svgFullScreen();
svg.append('path').attr('id', 'tail').attr('fill', 'none').attr('stroke', '#EE3333').attr('stroke-width', '5');
svg.append('path').attr('id', 'matpath').attr('fill', 'none').attr('stroke', '#333333').attr('stroke-width', '5');
var segments_g = svg.append('g');
var highlights = svg.append('g');
var mat = svg.append('g');
var circle_g = svg.append('g');
var slider_g = d3.select('svg#mat').append('g').attr('id', 'sliders').attr('transform', sliderCtrl.translate);
var option_g = d3.select('svg#mat').append('g').attr('id', 'options').attr('transform', optionCtrl.translate);
var title_g = d3
    .select('svg#mat')
    .append('text')
    .attr('id', 'title')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(' + matCtrl.width / 2 + ',54)');
option_g.append('text').attr('id', 'angle').attr('text-anchor', 'end').attr('transform', 'translate(50,36)').text('');
option_g.append('text').attr('text-anchor', 'start').attr('transform', 'translate(54,36)').text('Degrees per Step');
option_g
    .append('g')
    .attr('id', 'mattype')
    .selectAll('text')
    .data(matNameArray)
    .join('text')
    .text((d) => d.value)
    .attr('y', (d, i) => 55 + 18 * i)
    .on('click', (x, d) => {
        matType = d.key;
        updateMat(createKnotPoints());
    });
var presets_g = option_g
    .append('g')
    .attr('id', 'presets')
    .selectAll('g')
    .data(presetArray)
    .join('g')
    .attr('transform', (d, i) => 'translate(98,' + (55 + i * 18) + ')');
presets_g
    .selectAll('text')
    .data((d) => d.value)
    .join('text')
    .text((d) => '( ' + d + ' )')
    .attr('text-anchor', 'middle')
    .attr('x', (d, i) => 0 + 40 * i)
    .on('click', (x, d) => loadPreset(d3.select(x.currentTarget.parentNode).datum().key, d));

var buttonData = [
    { label: 'UnderOver', x: 11, y: optionCtrl.height - 50 },
    { label: 'SingleLoop', x: 172, y: optionCtrl.height - 50 },
    { label: 'Circles', x: 336, y: optionCtrl.height - 50 },
    { label: 'CtrlPts', x: 445, y: optionCtrl.height - 50 },
    { label: 'Fit', x: 641, y: optionCtrl.height - 50 },
    { label: 'Int', x: 700, y: optionCtrl.height - 108 },
    { label: 'Dev', x: 700, y: optionCtrl.height - 50 },
];
var control_flags = {};
buttonData.map((d) => (control_flags[d.label] = 0));
//buttonData = [];

var button = d3
    .button()
    .on('press', (x, d) => {
        control_flags[d.label] = 1;
        updateMat(d.label === 'SingleLoop' ? createKnotPoints() : d3.select('#matpath').datum());
    })
    .on('release', (x, d) => {
        control_flags[d.label] = 0;
        updateMat(d.label === 'SingleLoop' ? createKnotPoints() : d3.select('#matpath').datum());
    });

// Add buttons
var buttons = option_g.selectAll('.button').data(buttonData).join('g').attr('class', 'button').call(button);

window.addEventListener('resize', svgFullScreen);

function svgFullScreen() {
    var htmlwidth = d3.select('html').node().clientWidth;
    var htmlheight = d3.select('html').node().clientHeight;
    //console.log(htmlwidth + ',' + htmlheight);
    d3.select('#mat').attr('width', htmlwidth).attr('height', htmlheight);
}

function svgMatZoom() {
    var vbox = '-400 -400 800 800';
    if (control_flags.Fit) {
        var bbox = d3.select('#mat svg').node().getBBox();
        var off = Math.floor(Math.min(bbox.x - 9, bbox.y - 9, -400) / 10) * 10;
        var size = -2 * off;
        vbox = off + ' ' + off + ' ' + size + ' ' + size;
    }
    d3.select('#mat svg').attr('viewBox', vbox);
}

function btwn(a, b1, b2) {
    if (a >= b1 && a <= b2) {
        return true;
    }
    if (a >= b2 && a <= b1) {
        return true;
    }
    return false;
}

function line_line_intersect(line1, line2) {
    var x1 = line1.x1,
        x2 = line1.x2,
        x3 = line2.x1,
        x4 = line2.x2;
    var y1 = line1.y1,
        y2 = line1.y2,
        y3 = line2.y1,
        y4 = line2.y2;
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

var PAL = [];

function getPAL(path, i) {
    if (typeof PAL[i] === 'undefined') {
        PAL[i] = path.node().getPointAtLength(i);
    }
    return PAL[i];
}

function path_intersections(path) {
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

function adjust_point(pt, path) {
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

function distance_to_closest_X(point, pathX) {
    return d3.min(pathX.map((d) => (point.x - d.x) ** 2 + (point.y - d.y) ** 2));
    return Math.sqrt(d3.min(pathX.map((d) => (point.x - d.x) ** 2 + (point.y - d.y) ** 2)));
}

function create_dasharray(pathX) {
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

function draw_intersections(pts) {
    highlights.selectAll('circle').remove();
    pts.forEach(function (pt) {
        highlights.append('circle').attr('cx', pt.p1.x).attr('cy', pt.p1.y).attr('r', 8).attr('fill', 'none').attr('stroke', 'red');
        highlights.append('circle').attr('cx', pt.p2.x).attr('cy', pt.p2.y).attr('r', 8).attr('fill', 'none').attr('stroke', 'green');
        highlights.append('circle').attr('cx', pt.x).attr('cy', pt.y).attr('r', 8).attr('fill', 'none').attr('stroke', 'steelblue');
        highlights.append('circle').attr('cx', pt.p1.x).attr('cy', pt.p1.y).attr('r', 2).attr('fill', 'red').attr('stroke', 'none');
        highlights.append('circle').attr('cx', pt.p2.x).attr('cy', pt.p2.y).attr('r', 2).attr('fill', 'green').attr('stroke', 'none');
        highlights.append('circle').attr('cx', pt.x).attr('cy', pt.y).attr('r', 2).attr('fill', 'steelblue').attr('stroke', 'none');
    });
}

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

//d3.select("#slider").on("change", function() { d3.select("#n_segments_text").text(this.value); updateMat(); });

//d3.select("#intersect").on("change", function() {
d3.selectAll('input')
    .on('input', function () {
        updateMat(createKnotPoints());
    })
    .on('change', function () {
        updateMat(createKnotPoints());
    });

//d3.select("#segment").on("change", function() { updateMat(); });

//draw_intersections( pathX );

function updateMat(knotpoints) {
    showCircles();
    d3.select('#title').text(matName[matType] + ' Mat');

    if (control_flags.CtrlPts) {
        showControlPoints(knotpoints);
    } else {
        showControlPoints([]);
    }
    updatePaths(knotpoints);
}

function updatePaths(knotpoints) {
    let tail = [];
    if (knotpoints[knotpoints.length - 2].mode == 'end2') {
        tail = JSON.parse(JSON.stringify(knotpoints));  // Deep copy
        knotpoints[knotpoints.length - 2].mode = 'end';
        knotpoints.splice(knotpoints.length - 1);
    }
    let svg = d3.select('#mat g svg');
    svg.selectAll('path')
        .data(
            [ tail, knotpoints ]
        ).join('path')
        .attr('d', d => d.map((p) => createPointString(p)).toString());
    let matpath = d3.select('#matpath');
    let data = d3.select('#sliders').selectAll('g').data();
    let show = data.find((d) => d.name == 'Segments');
    let dasharray = '';

    PAL = [];
    if (show.value == show.max) {
        if (control_flags.UnderOver) {
            dasharray = create_dasharray(path_intersections(matpath));
        }
        svg.selectAll('path').attr('stroke-dasharray', dasharray);
    }
    //var pathX = path_intersections(matpath);
    if (control_flags.Int) {
        draw_intersections(path_intersections(matpath));
    } else {
        highlights.selectAll('circle').remove();
    }
    //if (d3.select("#intersect").property("checked")){ draw_intersections(pathX); } else { highlights.selectAll("circle").remove(); }
    //if (d3.select("#segment").property("checked")){ draw_segments( matpath, 300 ); //d3.select("#slider").node().value); } else { segments_g.selectAll("line").remove(); }
    svgMatZoom();

}

function showControlPoints(knotpoints) {
    var matt_cp = mat.selectAll('g').data([knotpoints]).join('g');
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
        .attr('index', (d,i) => i)
        .attr('stroke', '#5ba1d5');
    matt_cp
        .selectAll('g.line0')
        .selectAll('circle')
        .data((d) => d)
        .join('circle')
        .attr('cx', (d) => d.p.x)
        .attr('cy', (d) => d.p.y)
        .attr('r', 14)
        .attr('index', (d,i) => i)
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
        .attr('index', (d,i) => i)
        .attr('stroke', '#727272');
    matt_cp
        .selectAll('g.line1')
        .selectAll('circle')
        .data((d) => d)
        .join('circle')
        .attr('cx', (d) => d.cp1.x)
        .attr('cy', (d) => d.cp1.y)
        .attr('r', 14)
        .attr('index', (d,i) => i)
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
        .attr('index', (d,i) => i)
        .attr('stroke', '#727272');
    matt_cp
        .selectAll('g.line2')
        .selectAll('circle')
        .data((d) => d)
        .join('circle')
        .attr('cx', (d) => d.cp2.x)
        .attr('cy', (d) => d.cp2.y)
        .attr('r', 14)
        .attr('index', (d,i) => i)
        .attr('fill', '#d9a400')
        .call(cp2drag);
}

function showCircles() {
    var data = d3.select('#sliders').selectAll('g').data();
    var largeCircle = data.find((d) => d.name == 'LargeCircle').value;
    var smallCircle = data.find((d) => d.name == 'SmallCircle').value;
    var extraCircle = (data.find((d) => d.name == 'ExtraCircle') ?? { value: 0 }).value;
    var middleCircle = (largeCircle + smallCircle) / 2;
    var circles = [];
    var lines = [];
    if (control_flags.Circles) {
        circles = [
            { x: 0, y: 0, r: smallCircle },
            { x: 0, y: 0, r: middleCircle },
            { x: 0, y: 0, r: largeCircle },
            { x: 0, y: 0, r: extraCircle },
        ];
        lines = [
            [-390, 0, 390, 0],
            [0, -390, 0, 390],
        ];
    }
    circle_g
        .selectAll('circle')
        .data(circles)
        .join('circle')
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('r', (d) => Math.abs(d.r))
        .attr('fill', 'none')
        .attr('stroke', (d) => (d.r < 0 ? 'red' : '#181818')); //.call(drag);
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

function getSliderDefs() {
    return [
        { name: 'Knots' },
        { name: 'LargeCircle' },
        { name: 'SmallCircle' },
        { name: 'StartCP' },
        { name: 'MiddleCP' },
        //{ name: "Tilt" },
        { name: 'Segments' },
    ];
}

function getSliderDevDefs() {
    return {
        Knots: { min: 3, max: 19 },
        LargeCircle: { min: -500, max: 500 },
        SmallCircle: { min: -500, max: 500 },
        ExtraCircle: { min: -100, max: 400 },
        StartCP: { min: -300, max: 300 },
        MiddleCP: { min: -300, max: 300 },
        ExtraCP: { min: -300, max: 300 },
        Tilt: { min: -360, max: 360 },
        ExtraAngle: { min: -360, max: 360 },
        Segments: { min: 2, max: 27 },
    };
}

function createSliders(g, sliders) {
    var sl_g = g
        .selectAll('g')
        .data(sliders)
        .join('g')
        .attr('transform', (d, i) => 'translate(' + (i * sliderCtrl.width) / sliders.length + ', 0)')
        .attr('id', (d) => 'slider_' + d.name)
        .call(createSlider);
    //sl_g.select('rect').attr('width', d => sliderCtrl.width / sliderCtrl.length - 4);
    sl_g.selectAll('rect').attr('y', (d) =>
        d3
            .scaleLinear()
            .range([sliderCtrl.height - 10, 10])
            .clamp(true)
            .domain([d.min, d.max])(d.value)
    );
}

function updateSliders(g) {
    g.select('rect').attr('y', (d) => d.y);
    g.select('text#value').text((d) => d.value);
}

function createSlider(g) {
    g.selectAll('line')
        .data((d) => [d])
        .join('line')
        .attr('x1', 50)
        .attr('y1', 10)
        .attr('x2', 50)
        .attr('y2', sliderCtrl.height + 50);
    g.selectAll('rect')
        .data((d) => [d])
        .join('rect')
        .attr('x', 1)
        .attr('y', 5)
        .attr('width', 98)
        .attr('height', 60)
        .call(sliderdrag);
    g.selectAll('text')
        .data((d) => [
            { id: 'name', value: d.name },
            { id: 'value', value: d.value },
        ])
        .join('text')
        .attr('id', (d) => d.id)
        .classed('slider_value', (d) => d.id == 'value')
        .attr('text-anchor', 'middle')
        .attr('transform', (d) => (d.id == 'value' ? 'translate(50, -20)' : 'translate(50, 0)'))
        .text((d) => d.value);
}

var ppk;
function getControls(pointsPerKnot) {
    ppk = pointsPerKnot;
    var data = d3.select('#sliders').selectAll('g').data();
    var knots = data.find((d) => d.name == 'Knots').value;
    var angle = Math.floor(36000 / knots) / 100;
    d3.selectAll('#angle').html(angle);
    var showmax = 1 + pointsPerKnot * knots;
    var show = data.find((d) => d.name == 'Segments').value;
    var single = control_flags.SingleLoop;
    var largeCircle = data.find((d) => d.name == 'LargeCircle').value;
    var smallCircle = data.find((d) => d.name == 'SmallCircle').value;
    var extraCircle = (data.find((d) => d.name == 'ExtraCircle') ?? { value: 0 }).value;
    var middleCircle = (largeCircle + smallCircle) / 2;
    var showCircle = control_flags.Circles;
    var startcp = data.find((d) => d.name == 'StartCP').value * 10;
    var midcp = data.find((d) => d.name == 'MiddleCP').value * 10;
    var extracp = (data.find((d) => d.name == 'ExtraCP') ?? { value: 0 }).value;
    var cp1 = (data.find((d) => d.name == 'CP1') ?? { value: 0 }).value;
    var cp2 = (data.find((d) => d.name == 'CP2') ?? { value: 0 }).value;
    var tilt = (data.find((d) => d.name == 'Tilt') ?? { value: 0 }).value;
    var extraAngle = (data.find((d) => d.name == 'ExtraAngle') ?? { value: 0 }).value;
    if (single) {
        show = pointsPerKnot + 1;
    }
    if (0) {
        show = showmax;
    }
    return { knots, angle, show, single, largeCircle, smallCircle, middleCircle, showCircle, startcp, midcp, tilt, extracp, extraCircle, extraAngle, cp1, cp2 };
}

var underOver;
var intersections;
function sliderdragstarted() {
    d3.select(this).raise().classed('on', 1);
    underOver = control_flags.UnderOver;
    intersections = control_flags.Int;
    control_flags.Int = 0;
        if (d3.select(this.parentNode).attr('id') != 'slider_Segments') {
        control_flags.UnderOver = 0;
    }
}

function sliderdragged(event, d) {
    d.value = d3
        .scaleLinear()
        .domain([sliderCtrl.height - 10, 10])
        .clamp(true)
        .rangeRound([d.min, d.max])(event.y);
    d.y = d3
        .scaleLinear()
        .domain([sliderCtrl.height - 10, 10])
        .clamp(true)
        .rangeRound([d.min, d.max])
        .invert(d.value);
    //console.log(event.y + ' ' + d.value + ' ' + d.y);
    d3.select(this).attr('y', (d) => d.y);
    d3.select(this.parentNode).select('text#name').text(d.name);
    d3.select(this.parentNode).select('text#value').text(d.value);
    if (d3.select(this.parentNode).attr('id') == 'slider_Knots') {
        var fullSlider = 1 + ppk * d.value;
        var g = d3.select('#sliders').selectAll('g');
        var currentData = g.data();
        var segments = currentData.find((d) => d.name == 'Segments');
        segments.max = segments.value = fullSlider;
        segments.y = 10;
        g.data(currentData).join('g');
        updateSliders(g);
    }
    updateMat(createKnotPoints());
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

function sliderdragended() {
    d3.select(this).classed('on', 0);
    control_flags.UnderOver = underOver;
    control_flags.Int = intersections;
    updateMat(createKnotPoints());
}

function cpdragended() {
    d3.select(this).classed('on', 0);
    control_flags.UnderOver = underOver;
    control_flags.Int = intersections;
    let knotpoints = d3.select('#matpath').datum();
    updatePaths(knotpoints);
}

const sliderdrag = d3.drag().on('start', sliderdragstarted).on('drag', sliderdragged).on('end', sliderdragended);
const cp1drag = d3.drag().on('start', sliderdragstarted).on('drag', cp1dragged).on('end', cpdragended);
const cp2drag = d3.drag().on('start', sliderdragstarted).on('drag', cp2dragged).on('end', cpdragended);
const pointdrag = d3.drag().on('start', sliderdragstarted).on('drag', pointdragged).on('end', cpdragended);

function createKnotPoints() {
    let nodepoints = [];
    if (matType == 'K')         { nodepoints = createKringleKnot();    }
    if (matType == 'Y')         { nodepoints = createYetterKnot();     }
    if (matType == 'YPlus')     { nodepoints = createYetterPlusKnot(); }
    if (matType == 'Pi')        { nodepoints = createPitonKnot();      }
    if (matType == 'Pe')        { nodepoints = createPeesoKnot();      }
    if (matType == 'R')         { nodepoints = createRattanKnot();     }
    if (matType == 'Ra')        { nodepoints = createRadianceKnot();   }
    if (matType == 'S')         { nodepoints = createStruktorKnot();   }
    if (matType == 'W')         { nodepoints = createWarlowKnot();     }
    if (matType == 'W2')        { nodepoints = createWarlow2Knot();    }
    if (matType == 'Sa')        { nodepoints = createSardinaKnot();    }
    if (matType == 'Saa')       { nodepoints = createSardinaAltKnot(); }
    if (matType == 'S2')        { nodepoints = createSardina2Knot();   }
    if (matType == 'S3')        { nodepoints = createSardina3Knot();   }
    if (matType == 'S4')        { nodepoints = createSardina4Knot();   }
    if (matType == 'S5')        { nodepoints = createSardina5Knot();   }
    if (matType == 'V')         { nodepoints = createVainovskaKnot();  }
    if (matType == 'V2')        { nodepoints = createVainovska2Knot(); }
    if (nodepoints.length == 0) { nodepoints = createYetterPlusKnot(); }
    let data = d3.select('#sliders').selectAll('g').data();
    let show = data.find((d) => d.name == 'Segments').value;
    if (nodepoints.length > show) {
        nodepoints.splice(show + 1);
        nodepoints[nodepoints.length - 2].mode = 'end2';
    }
    nodepoints[0].mode = 'start';
    nodepoints[nodepoints.length - 1].mode = 'end';
    return nodepoints;
}

function createVainovskaKnot() {
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

function createVainovska2Knot() {
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

function createWarlowKnot() {
    var c = getControls(4);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
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

function createWarlow2Knot() {
    var c = getControls(4);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
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

function createRadianceKnot() {
    control_flags.Fit = 1;
    var c = getControls(6);
    //c.tilt = 12;
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
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

function createStruktorKnot() {
    var c = getControls(8);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.largeCircle, -x * c.angle + c.angle / 2, c.startcp, c.startcp));
        nodepoints.push(createPoint(300, -x * c.angle - 45, c.startcp / 3, 50));
        nodepoints.push(createPoint(200, -x * c.angle - 90, 100, 100));
        nodepoints.push(createPoint(300, -x * c.angle - 135, 50, c.startcp / 2));
        nodepoints.push(createPoint(c.smallCircle, -x * c.angle, c.midcp, c.midcp));
        nodepoints.push(createPoint(300, -x * c.angle + 135, c.startcp / 2, 50));
        nodepoints.push(createPoint(200, -x * c.angle + 90, 100, 100));
        nodepoints.push(createPoint(300, -x * c.angle + 45, 50, c.startcp / 3));
    }
    nodepoints.push(createPoint(c.largeCircle, -(c.knots - 1) * c.angle - c.angle / 2, c.startcp, c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}

function createKringleKnot() {
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

function createYetterKnot() {
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

function createYetterPlusKnot() {
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

function createSardinaKnot() {
    var c = getControls(4);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
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

function createSardinaAltKnot() {
    var c = getControls(4);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
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

function createSardina2Knot() {
    var c = getControls(4);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
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

function createSardina3Knot() {
    var c = getControls(2);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(-c.smallCircle, -x * c.angle + c.angle / 2, c.startcp, c.startcp));
        nodepoints.push(createPoint(c.largeCircle, -x * c.angle + 180, c.midcp, c.midcp));
    }
    nodepoints.push(createPoint(-c.smallCircle, -(c.knots - 1) * c.angle - c.angle / 2, c.startcp, c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}

function createSardina4Knot() {
    var c = getControls(7);
    let skip = Math.ceil(c.knots / 2);
    let factor = (c.knots + 18) / 30;
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
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

function createSardina5Knot() {
    var c = getControls(6);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
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

function createPeesoKnot() {
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

function createPitonKnot() {
    var c = getControls(2);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.smallCircle, 180 + 4 * x * c.angle - c.angle * 2, -c.startcp, -c.startcp));
        nodepoints.push(createPoint(c.largeCircle, 180 + (4 - c.knots) * x * c.angle, -c.midcp, -c.midcp));
    }
    nodepoints.push(createPoint(c.smallCircle, 180 + 4 * (c.knots - 1) * c.angle + c.angle * 2, -c.startcp, -c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}

function createRattanKnot() {
    var c = getControls(2);
    var nodepoints = [];
    for (var x = 0; x < c.knots; x++) {
        nodepoints.push(createPoint(c.smallCircle, -x * c.angle + c.angle / 2, -c.startcp, -c.startcp));
        nodepoints.push(createPoint(c.largeCircle, -x * c.angle + 180, -c.midcp, -c.midcp));
    }
    nodepoints.push(createPoint(c.smallCircle, -(c.knots - 1) * c.angle - c.angle / 2, -c.startcp, -c.startcp));
    if (c.single) {
        nodepoints.splice(c.show);
    }
    return nodepoints;
}

function createPoint(size, angle, cp1, cp2, tilt = 0) {
    angle += 90;
    let x = size * Math.cos((angle * Math.PI) / 180);
    let y = -size * Math.sin((angle * Math.PI) / 180);
    let cpx1 = x + cp1 * Math.cos(((angle + 90 + tilt) * Math.PI) / 180);
    let cpy1 = y - cp1 * Math.sin(((angle + 90 + tilt) * Math.PI) / 180);
    let cpx2 = x + cp2 * Math.cos(((angle - 90 + tilt) * Math.PI) / 180);
    let cpy2 = y - cp2 * Math.sin(((angle - 90 + tilt) * Math.PI) / 180);
    return { p: { x, y }, cp1: { x: cpx1, y: cpy1 }, cp2: { x: cpx2, y: cpy2 } };
}

function createPointString(d) {
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

function loadPreset(mat, variant) {
    matType = mat;
    var sliders = presets[matType].sliders;
    createSliders(slider_g, sliders);
    var g = d3.select('#sliders').selectAll('g');
    var type = control_flags.Dev ? 'dev' : 'mat';
    var currentData = sliders.map((slider) => ({ ...slider, ...presets[mat][type][slider.name], ...presets[mat][variant][slider.name] }));
    currentData.every(
        (d) =>
            (d.y = d3
                .scaleLinear()
                .range([sliderCtrl.height - 10, 10])
                .clamp(true)
                .domain([d.min, d.max])(d.value))
    );
    g.data(currentData).join('g');
    updateSliders(g);
    //underOver = control_flags.UnderOver;
    //control_flags.UnderOver = 0;
    //updateMat();
    //control_flags.UnderOver = underOver;
    updateMat(createKnotPoints());
}

Object.keys(presets).forEach((d) => (presets[d].dev = getSliderDevDefs()));

loadPreset('Y', 4);
updateMat(createKnotPoints());
