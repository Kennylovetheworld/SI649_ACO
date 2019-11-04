$(document).ready(function() {

	var W = 1600;
	var H = 900;
	var ratio = W/H;
	var renderer = PIXI.autoDetectRenderer(W, H, { transparent: true }, null, false, true);
	var started = false;

    document.body.appendChild(renderer.view);
    renderer.view.style.width = (window.innerWidth - 20) + "px";
    renderer.view.style.height = (window.innerHeight - 20) + "px";
    renderer.view.style.display = "block";

    window.addEventListener('resize', function () {
        renderer.view.style.width = (window.innerWidth - 20) + "px";
        renderer.view.style.height = Math.min(window.innerHeight - 20, (window.innerWidth / ratio - 20)) + "px"; 
    }, false);

    // stats
    var stats = new Stats();

    // gui
    function initDatGui() {
        var gui = new dat.GUI();
        var controllers = [];
        controllers.push(gui.add(params, 'nbAnts', 1, 200).name('Number of Ants'));
        gui.add(params, 'simulationSpeed', 1, 3).step(0.01).name('Algorithm Speed');
        controllers.push(gui.add(params, 'ACOAlpha', 0.5, 2).step(0.01).name('Alpha ACO (history factor)'));
        controllers.push(gui.add(params, 'ACOBeta', 1.5, 4).step(0.01).name('Beta ACO (heuristic factor)'));
        controllers.push(gui.add(params, 'greedy', 0, 1).step(0.01).name('Greedy level when choosing potential solution'));
        gui.add(params, 'showPheromones').name('Pheromones').onChange(function (value) {
            antColony.togglePheromones();
        });
        gui.add(params, 'showPath').name('Best Path').onChange(function (value) {
            antColony.togglePath();
        });
        gui.add(params, 'showCandidatePath').name('Candidate Path').onChange(function (value) {
            antColony.togglePath();
        });

        controllers.forEach(function (ctrl) {
            ctrl.onChange(function (value) {
                antColony.reset();
            });
        });
    }

    // fonts
    WebFontConfig = {
        google: {
            families: [ 'Lato' ]
        },

        active: function () {
            run();
        }
    };

    (function () { // local scope
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
    }());

    function run() {
        ant.init(W, H);
        candidateAnt.init(W, H);
        antColony.init(W, H);

        // first render
        renderer.render(antColony.container);
        initDatGui();
        antColony.togglePheromones();
        antColony.togglePath();

        function render() {
            var time = Date.now();
            stats.begin();
            TWEEN.update();
            antColony.render();
            renderer.render(antColony.container);
            stats.end();
            requestAnimationFrame(render);
        }

        $('#help').popup({
            transition: 'all 0.1s',
            autoopen: true,
            background: true,
            color: '#00274C',
            opacity: 1,
            closetransitionend: function () {
                if (!started) {
                    requestAnimationFrame(render);
                    started = true;
                }
            }
        });

        $('#intro_img').click(function () {
            $('#help').popup();
        });
    }
});
