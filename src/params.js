var params = (function() {
    'use strict';

    return {
        nbAnts: 10,
        decay: 0.1,
        localPheromone: 0.1,
        greedy: 0.9,
        antSpeed: 2,
        simulationSpeed: 1,
        showPheromones: true,
        showPath: false,
        showCandidatePath: false,
        bcp_Thumbnail: {x: -30, y: 250, div: 1/3},
        ACOAlpha: 1.0,
        ACOBeta: 2.5
    };

}());