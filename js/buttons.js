import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
const { select } = d3;
import { button as d3Button } from './d3.button.js';
import { updateMat, control_flags } from './mat.js';

// Button configuration
const buttonConfig = {
    buttonPositions: [
        { label: 'UnderOver',  x: 11,  yOffset: 50  },
        { label: 'SingleLoop', x: 182, yOffset: 50  },
        { label: 'Circles',    x: 356, yOffset: 50  },
        { label: 'CtrlPts',    x: 472, yOffset: 50  },
        { label: 'Fit',        x: 641, yOffset: 50  },
        { label: 'Int',        x: 700, yOffset: 108 },
        { label: 'Dev',        x: 700, yOffset: 50  },
    ]
};

// Create button data with calculated positions
function createButtonData(optionCtrlHeight) {
    return buttonConfig.buttonPositions.map(btn => ({
        label: btn.label,
        x: btn.x,
        y: optionCtrlHeight - btn.yOffset
    }));
}

// Create and return the buttons group
export function createButtons(container, height) {
    const button = d3Button()
        .on('press', (x, d) => {
            control_flags[d.label] = 1;
            updateMat(d.label === 'SingleLoop' ? undefined : select('#matpath').datum());
        })
        .on('release', (x, d) => {
            control_flags[d.label] = 0;
            updateMat(d.label === 'SingleLoop' ? undefined : select('#matpath').datum());
        });

    // Create button data with the correct height
    const buttonData = createButtonData(height);
    
    // Create and return the buttons group
    return container
        .selectAll('.button')
        .data(buttonData)
        .join('g')
            .attr('class', 'button')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .call(button);
}
