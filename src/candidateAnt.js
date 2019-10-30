var candidateAnt = (function(ps) {
    'use strict';

    // rendering
	var antTex = [];
	var tweens = [];
	var ant;
    var vanish;
    var antSpeed = 13;

    function _initGraphics() {
        for (var i = 1; i <= 3; i++) {
            antTex.push(PIXI.Texture.fromImage("img/candidateAnt_" + i + ".png"));
        }

        ant = new PIXI.extras.MovieClip(antTex);
        ant.animationSpeed = 0.1;
        ant.play();
        ant.anchor.x = 0.5;
        ant.anchor.y = 0.5;
        ant.scale.x = 0.1;
        ant.scale.y = 0.1;
		// Start the ant out of bounds
        ant.position.x = -1000;
        ant.position.y = -1000;

    }

    function _steerAngle(start, end) {
        var dx = end.x - start.x;
        var dy = end.y - start.y;
        return Math.atan2(dy, dx) + Math.PI / 2;
    }

    return {

        init: function (width, height) {
            _initGraphics();
        },

        getSprite: function () {
            return ant;
        },

        followPath: function (path) {
            if (tweens[0]) tweens[0].stop();
            if (vanish) vanish.stop();

            var rot = {angle: ant.rotation};
            tweens = _.flatten(path.map(function (p, i) {
                return [
                    new TWEEN.Tween(rot)
                        .to({angle: _steerAngle(p, path[(i+1)%path.length].position)}, 100 / antSpeed)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onUpdate(function () {
                            ant.rotation = this.angle;
                        }),

                    new TWEEN.Tween(ant.position)
                        .to({ x: path[(i+1)%path.length].position.x * ps.bcp_Thumbnail.div + ps.bcp_Thumbnail.x, y: path[(i+1)%path.length].position.y * ps.bcp_Thumbnail.div + ps.bcp_Thumbnail.y }, 1000 / antSpeed)
                        .easing(TWEEN.Easing.Cubic.Out)
                        .onUpdate(function () {
                            ant.position.x = this.x;
                            ant.position.y = this.y;
                        })
                ];
            }));

            vanish = new TWEEN.Tween({alpha: ant.alpha})
                .to({alpha: 0}, 0)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function () {
                    ant.alpha = this.alpha;
                })
                .onComplete(function () {
                    ant.position.x = path[0].position.x * ps.bcp_Thumbnail.div + ps.bcp_Thumbnail.x;
                    ant.position.y = path[0].position.y * ps.bcp_Thumbnail.div + ps.bcp_Thumbnail.y;
                });

            var appear = new TWEEN.Tween({alpha: ant.alpha})
                .to({alpha: 1}, 0)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function () {
                    ant.alpha = this.alpha;
                });

            vanish.chain(appear);
            appear.chain(tweens[0]);

            tweens.forEach(function (t, i) {
                t.chain(tweens[(i+1)%tweens.length]);
            });

            vanish.start();

        }

    };

})(params);
