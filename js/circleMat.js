import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
const { select, scaleOrdinal } = d3;
const { schemeCategory10 } = d3;
const { ascending } = d3;
import * as definePresets from './definePresets.js';
import { createKnotPoints, matName, setMatType } from './matPoints.js';
import { control_flags } from './mat.js';
import { getSliderDevDefs, loadPreset } from './sliders.js';
import { button, createButtonData } from './buttons.js';
import { svgFullScreen, updateMat } from './mat.js';

const matNameArray = Object.keys(matName).map((d) => ({ key: d, value: matName[d] }));
export const presets = definePresets.definePresets();
const presetArray = Object.keys(matName).map((d) => ({
    key: d,
    value: Object.keys(presets[d])
        .map(Number)
        .filter((d) => d)
        .sort(ascending),
}));
export const color = scaleOrdinal(schemeCategory10);
const matCtrl = { width: 800, height: 800, translate: 'translate(0,80)' };
export const sliderCtrl = { width: 800, height: 400, translate: 'translate(0,940)' };
export const optionCtrl = { width: 800, height: 480, translate: 'translate(800,500)' };
let width;
let height;
if (window.innerWidth < window.innerHeight) {
    width = Math.max(matCtrl.width, sliderCtrl.width);
    height = matCtrl.height + sliderCtrl.height + optionCtrl.height + 300;
    sliderCtrl.translate = 'translate(0,940)';
    optionCtrl.translate = 'translate(0,1370)';
} else {
    width = matCtrl.width + sliderCtrl.width;
    height = Math.max(matCtrl.height + 100, sliderCtrl.height + optionCtrl.height + 100);
    sliderCtrl.translate = 'translate(800,70)';
}
var svg = select('body')
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
export var segments_g = svg.append('g');
export var highlights = svg.append('g');
export var mat = svg.append('g');
export var circle_g = svg.append('g');
export var slider_g = d3.select('svg#mat').append('g').attr('id', 'sliders').attr('transform', sliderCtrl.translate);
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
        setMatType(d.key);
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

// Create button data with the correct height
const buttonData = createButtonData(optionCtrl.height);
// Add buttons
const buttons = option_g.selectAll('.button').data(buttonData).join('g').attr('class', 'button').call(button);
// Unpress all buttons
buttonData.forEach((d) => (control_flags[d.label] = 0));
window.addEventListener('resize', svgFullScreen);

function initPresets() {
    Object.keys(presets).forEach((d) => (presets[d].dev = getSliderDevDefs()));
}

// Initialize presets after all modules are loaded
initPresets();

loadPreset('Y', 4);
updateMat(createKnotPoints());
