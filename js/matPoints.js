import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { StruktorKnot }                                                                                      from './knots/Struktor.js';
import { VainovskaKnot, Vainovska2Knot, SamebaKnot }                                                         from './knots/Vainovska.js';
import { WarlowKnot, Warlow2Knot }                                                                           from './knots/Warlow.js';
import { YetterKnot, YetterPlusKnot }                                                                        from './knots/Yetter.js';
import { PeesoKnot }                                                                                         from './knots/Peeso.js';
import { KringleKnot, RattanKnot, PitonKnot }                                                                from './knots/Common.js';
import { RadianceKnot, SardinaKnot, SardinaAltKnot, Sardina2Knot, Sardina3Knot, Sardina4Knot, Sardina5Knot } from './knots/Sardina.js';

/**
 * Creates knot points based on the current or provided mat type
 * @param {string} [newMatType] - Optional mat type to update before creating points
 * @returns {Array} Array of knot points
 */
export function createKnotPoints(newMatType) {
    // Update _matType if a new type is provided
    if (newMatType !== undefined) {
        _matType = newMatType;
    }
    let nodepoints = [];
    if (_matType == 'K')         { nodepoints = KringleKnot();    }
    if (_matType == 'Y')         { nodepoints = YetterKnot();     }
    if (_matType == 'YPlus')     { nodepoints = YetterPlusKnot(); }
    if (_matType == 'Pi')        { nodepoints = PitonKnot();      }
    if (_matType == 'Pe')        { nodepoints = PeesoKnot();      }
    if (_matType == 'R')         { nodepoints = RattanKnot();     }
    if (_matType == 'Ra')        { nodepoints = RadianceKnot();   }
    if (_matType == 'S')         { nodepoints = StruktorKnot();   }
    if (_matType == 'W')         { nodepoints = WarlowKnot();     }
    if (_matType == 'W2')        { nodepoints = Warlow2Knot();    }
    if (_matType == 'Sa')        { nodepoints = SardinaKnot();    }
    if (_matType == 'Saa')       { nodepoints = SardinaAltKnot(); }
    if (_matType == 'S2')        { nodepoints = Sardina2Knot();   }
    if (_matType == 'S3')        { nodepoints = Sardina3Knot();   }
    if (_matType == 'S4')        { nodepoints = Sardina4Knot();   }
    if (_matType == 'S5')        { nodepoints = Sardina5Knot();   }
    if (_matType == 'V')         { nodepoints = VainovskaKnot();  }
    if (_matType == 'V2')        { nodepoints = Vainovska2Knot(); }
    if (_matType == 'V3')        { nodepoints = SamebaKnot();     }
    if (nodepoints.length == 0)  { nodepoints = YetterPlusKnot(); }
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

// Internal variable to track the current mat type
let _matType = 'Y'; // Default value

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
