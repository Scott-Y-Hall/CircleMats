import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { createStruktorKnot } from './knots/Struktor.js';
import { createVainovskaKnot, createVainovska2Knot, createSamebaKnot } from './knots/Vainovska.js';
import { createWarlowKnot, createWarlow2Knot } from './knots/Warlow.js';
import { createKringleKnot, createYetterKnot, createYetterPlusKnot } from './knots/Yetter.js';
import { createPeesoKnot } from './knots/Peeso.js';
import { createRattanKnot } from './knots/Rattan.js';
import { createPitonKnot } from './knots/Piton.js';
import { createRadianceKnot, createSardinaKnot, createSardinaAltKnot, createSardina2Knot, createSardina3Knot, createSardina4Knot, createSardina5Knot } from './knots/Sardina.js';

export function createKnotPoints() {
    let nodepoints = [];
    if (_matType == 'K')         { nodepoints = createKringleKnot();    }
    if (_matType == 'Y')         { nodepoints = createYetterKnot();     }
    if (_matType == 'YPlus')     { nodepoints = createYetterPlusKnot(); }
    if (_matType == 'Pi')        { nodepoints = createPitonKnot();      }
    if (_matType == 'Pe')        { nodepoints = createPeesoKnot();      }
    if (_matType == 'R')         { nodepoints = createRattanKnot();     }
    if (_matType == 'Ra')        { nodepoints = createRadianceKnot();   }
    if (_matType == 'S')         { nodepoints = createStruktorKnot();   }
    if (_matType == 'W')         { nodepoints = createWarlowKnot();     }
    if (_matType == 'W2')        { nodepoints = createWarlow2Knot();    }
    if (_matType == 'Sa')        { nodepoints = createSardinaKnot();    }
    if (_matType == 'Saa')       { nodepoints = createSardinaAltKnot(); }
    if (_matType == 'S2')        { nodepoints = createSardina2Knot();   }
    if (_matType == 'S3')        { nodepoints = createSardina3Knot();   }
    if (_matType == 'S4')        { nodepoints = createSardina4Knot();   }
    if (_matType == 'S5')        { nodepoints = createSardina5Knot();   }
    if (_matType == 'V')         { nodepoints = createVainovskaKnot();  }
    if (_matType == 'V2')        { nodepoints = createVainovska2Knot(); }
    if (_matType == 'V3')        { nodepoints = createSamebaKnot();     }
    if (nodepoints.length == 0)  { nodepoints = createYetterPlusKnot(); }
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

let _matType = 'Y'; // Default value

export function setMatType(type) {
    _matType = type;
}

export function getMatType() {
    return _matType;
}

export const matName = {
    Y:     'Yetter',
    YPlus: 'Yetter+',
    K:     'Kringle',
    Pe:    'Peeso',
    Pi:    'Piton',
    R:     'Rattan',
    Ra:    'Radiance',
    S:     'Struktor',
    Sa:    'Sardina',
    //Saa: 'Sardina Alt',
    S2:    'Sardina2',
    S3:    'Sardina3',
    S4:    'Sardina4',
    S5:    'Sardina5',
    W:     'Warlow',
    W2:    'Warlow2',
    V:     'Vainovska',
    V2:    'Vainovska2',
    V3:    'Sameba',
};
