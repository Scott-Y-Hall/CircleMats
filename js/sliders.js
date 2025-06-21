import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { updateMat, control_flags } from './mat.js';
import { createKnotPoints } from './matPoints.js';

let ppk; // Points per knot - used in getControls and sliderdragged

// Slider control configuration
export const sliderCtrl = { width: 800, height: 400, translate: 'translate(0,940)' };

// Initialize with default values that will be set by the main application
let presets = {};
let slider_g = null;

// Function to initialize slider module with required dependencies
export function initSlidersModule(initialPresets, sliderGroup) {
    presets = initialPresets;
    slider_g = sliderGroup;
    return { sliderCtrl };
}

export function createSliders(g, sliders) {
    var sl_g = g
        .selectAll('g')
        .data(sliders)
        .join('g')
        .attr('transform', (d, i) => 'translate(' + (i * sliderCtrl.width) / sliders.length + ', 0)')
        .attr('id', (d) => 'slider_' + d.name)
        .call(createSlider);
    //sl_g.select('rect').attr('width', d => sliderCtrl.width / sliderCtrl.length - 4);
    sl_g.selectAll('rect').attr('y', (d) => d3
        .scaleLinear()
        .range([sliderCtrl.height - 10, 10])
        .clamp(true)
        .domain([d.min, d.max])(d.value)
    );
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
export function getSliderDevDefs() {
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
        CP1: { min: -300, max: 300 },
        CP2: { min: -300, max: 300 },
        Segments: { min: 2, max: 27 },
    };
}
export function updateSliders(g) {
    g.select('rect').attr('y', (d) => d.y);
    g.select('text#value').text((d) => d.value);
}

export function createSlider(g) {
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
export let underOver;
export let intersections;
export function sliderdragstarted(event) {
    d3.select(this).raise().classed('on', 1);
    underOver = control_flags.UnderOver;
    intersections = control_flags.Int;
    control_flags.Int = 0;
    if (d3.select(this.parentNode).attr('id') != 'slider_Segments') {
        control_flags.UnderOver = 0;
    }
}
export function sliderdragged(event, d) {
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
    updateMat();
}
export function sliderdragended() {
    d3.select(this).classed('on', 0);
    control_flags.UnderOver = underOver;
    control_flags.Int = intersections;
    updateMat();
}
export const sliderdrag = d3.drag().on('start', sliderdragstarted).on('drag', sliderdragged).on('end', sliderdragended);
export function loadPreset(matType, variant) {
    if (!presets[matType] || !presets[matType][variant]) {
        console.error(`Preset not found: ${matType} variant ${variant}`);
        return;
    }
    var sliders = presets[matType].sliders;
    createSliders(slider_g, sliders);
    var g = d3.select('#sliders').selectAll('g');
    var type = control_flags.Dev ? 'dev' : 'mat';
    var currentData = sliders.map((slider) => ({ ...slider, ...presets[matType][type][slider.name], ...presets[matType][variant][slider.name] }));
    currentData.every(
        (d) => (d.y = d3
            .scaleLinear()
            .range([sliderCtrl.height - 10, 10])
            .clamp(true)
            .domain([d.min, d.max])(d.value))
    );
    g.data(currentData).join('g');
    updateSliders(g);
    updateMat(undefined, matType);
}

export function getControls(pointsPerKnot) {
    ppk = pointsPerKnot;
    var data = d3.select('#sliders').selectAll('g').data();
    var knots = data.find((d) => d.name == 'Knots').value;
    var angle = Math.floor(36000 / knots) / 100;
    d3.select('#angle').html(angle);
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


