import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
const { select } = d3;
import { matNameArray, presets, presetArray } from './matPoints.js';
import { initMatModule } from './mat.js';
import { initSlidersModule, loadPreset as loadPresetFn } from './sliders.js';
import { createButtons } from './buttons.js';

const matCtrl = { width: 800, height: 800, translate: 'translate(0,80)' };
const sliderCtrl = { width: 800, height: 400, translate: 'translate(0,940)' };
const optionCtrl = { width: 800, height: 480, translate: 'translate(800,500)' };
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

// Initial screen setup will be handled in initApp
const svgElement = svg.append('path').attr('id', 'tail').attr('fill', 'none').attr('stroke', '#EE3333').attr('stroke-width', '5');
svg.append('path').attr('id', 'matpath').attr('fill', 'none').attr('stroke', '#333333').attr('stroke-width', '5');
const segments_g = svg.append('g');
const highlights_g = svg.append('g');
const mat_g = svg.append('g');
const circle_g = svg.append('g');
const slider_g = d3.select('svg#mat').append('g').attr('id', 'sliders').attr('transform', sliderCtrl.translate);
var option_g = d3.select('svg#mat').append('g').attr('id', 'options').attr('transform', optionCtrl.translate);
d3.select('svg#mat')
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
        const matApi = initMatModule(circle_g, highlights_g, mat_g, segments_g);
        matApi.updateMat(undefined, d.key);
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
    .on('click', (x, d) => loadPresetFn(d3.select(x.currentTarget.parentNode).datum().key, d));

// Create buttons and add them to options_g
createButtons(option_g, optionCtrl.height);

// Initialize the application
const initApp = () => {
    // Initialize mat module with required dependencies
    const matApi = initMatModule(circle_g, highlights_g, mat_g, segments_g);
    
    // Initialize sliders module with required dependencies
    initSlidersModule(presets, slider_g);
    
    // Initial screen setup
    matApi.svgFullScreen();
    
    // Load initial preset (which will update the mat)
    loadPresetFn('Y', 4);
    
    // Set up window resize handler using matApi's svgFullScreen
    window.addEventListener('resize', () => matApi.svgFullScreen());
};

// Start the application
initApp();
