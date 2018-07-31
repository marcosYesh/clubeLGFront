/*
 jquery.percentageloader.js

 Copyright (c) 2015, David Jeffrey & Piotr Kwiatkowski
 All rights reserved.

 This jQuery plugin is licensed under the Simplified BSD License. Please
 see the file license.txt that was included with the plugin bundle.

 */

(function () {
    "use strict";
    /*jslint browser: true */

    var imageLoaded = false;
    /* Our spiral gradient data */
    var imgdata = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUI5MEMzRkMzMTQyMTFFN0E4MjJFQTFFQ0IxRjUyNUUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUI5MEMzRkIzMTQyMTFFN0E4MjJFQTFFQ0IxRjUyNUUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMzhGN0U3NDkzMDIxMUUxQUVBN0Q1RUM0NTA4QjZFRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowMzhGN0U3NTkzMDIxMUUxQUVBN0Q1RUM0NTA4QjZFRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvF3otMAAB94SURBVHja3F3NtiQ3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",
        gradient = new Image();

    gradient.src = imgdata;
    gradient.addEventListener('load', function () {
        imageLoaded = true;
    });


    window.PercentageLoader = function (el, params) {
        var settings, canvas, percentageText, valueText, items, i, item, selectors, s, ctx, progress,
            value, cX, cY, lingrad, innerGrad, tubeGrad, innerRadius, innerBarRadius, outerBarRadius,
            radius, startAngle, endAngle, counterClockwise, completeAngle, setProgress, setValue,
            applyAngle, drawLoader, clipValue, outerDiv, ready, plugin;


        var fixedProgress = params['maximumProgress'];
        var updatedProgress = 0;

        plugin = this;

        /* Specify default settings */
        settings = {
            width: 256,
            height: 256,
            progress: 0,
            value: '0',
            controllable: false
        };

        /* Override default settings with provided params, if any */
        if (params !== undefined) {
            var prop;
            for (prop in settings) {
                if (settings.hasOwnProperty(prop) && !params.hasOwnProperty(prop)) {
                    params[prop] = settings[prop];
                }
            }
        } else {
            params = settings;
        }

        outerDiv = document.createElement('div');
        outerDiv.style.width = settings.width + 'px';
        outerDiv.style.height = settings.height + 'px';
        outerDiv.style.position = 'relative';

        el.appendChild(outerDiv);

        /* Create our canvas object */
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', settings.width);
        canvas.setAttribute('height', settings.height);
        outerDiv.appendChild(canvas);

        /* Create div elements we'll use for text. Drawing text is
         * possible with canvas but it is tricky working with custom
         * fonts as it is hard to guarantee when they become available
         * with differences between browsers. DOM is a safer bet here */
        percentageText = document.createElement('div');
        percentageText.style.width = (settings.width.toString() - 2) + 'px';
        percentageText.style.textAlign = 'center';
        percentageText.style.height = '50px';
        percentageText.style.left = 0;
        percentageText.style.position = 'absolute';

        valueText = document.createElement('div');
        valueText.style.width = (settings.width - 2).toString() + 'px';
        valueText.style.textAlign = 'center';
        valueText.style.height = '0px';
        valueText.style.overflow = 'hidden';
        valueText.style.left = 0;
        valueText.style.position = 'absolute';

        /* Force text items to not allow selection */
        items = [valueText, percentageText];
        for (i = 0; i < items.length; i += 1) {
            item = items[i];
            selectors = [
                '-webkit-user-select',
                '-khtml-user-select',
                '-moz-user-select',
                '-o-user-select',
                'user-select'];

            for (s = 0; s < selectors.length; s += 1) {
                item.style[selectors[s]] = 'none';
            }
        }

        /* Add the new dom elements to the containing div */
        outerDiv.appendChild(percentageText);
        outerDiv.appendChild(valueText);

        /* Get a reference to the context of our canvas object */
        ctx = canvas.getContext("2d");


        /* Set various initial values */

        /* Centre point */
        cX = (canvas.width / 2) - 1;
        cY = (canvas.height / 2) - 1;

        /* Create our linear gradient for the outer ring */
        lingrad = ctx.createLinearGradient(cX, 0, cX, canvas.height);
        lingrad.addColorStop(0, '#fafafa');
        lingrad.addColorStop(1, '#fafafa');

        /* Create inner gradient for the outer ring */
        innerGrad = ctx.createLinearGradient(cX, cX * 0.133333, cX, canvas.height - cX * 0.133333);
        innerGrad.addColorStop(0, '#fafafa');
        innerGrad.addColorStop(1, '#fafafa');

        /* Tube gradient (background, not the spiral gradient) */
        tubeGrad = ctx.createLinearGradient(cX, 0, cX, canvas.height);
        tubeGrad.addColorStop(0, '#fafafa');
        tubeGrad.addColorStop(1, '#fafafa');

        /* The inner circle is 2/3rds the size of the outer one */
        innerRadius = cX * 0.6666;
        /* Outer radius is the same as the width / 2, same as the centre x
         * (but we leave a little room so the borders aren't truncated) */
        radius = cX - 2;

        /* Calculate the radii of the inner tube */
        innerBarRadius = innerRadius + (cX * 0.06);
        outerBarRadius = radius - (cX * 0.06);

        /* Bottom left angle */
        startAngle = 2.1707963267949;
        /* Bottom right angle */
        endAngle = 0.9707963267949 + (Math.PI * 2.0);

        /* Nicer to pass counterClockwise / clockwise into canvas functions
         * than true / false */
        counterClockwise = false;

        /* Borders should be 1px */
        ctx.lineWidth = 1;

        /**
         * Little helper method for transforming points on a given
         * angle and distance for code clarity
         */
        applyAngle = function (point, angle, distance) {
            return {
                x: point.x + (Math.cos(angle) * distance),
                y: point.y + (Math.sin(angle) * distance)
            };
        };


        /**
         * render the widget in its entirety.
         */
        drawLoader = function () {
            /* Clear canvas entirely */
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            /*** IMAGERY ***/

            /* draw outer circle */
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.strokeStyle = 'transparent';
            ctx.arc(cX, cY, radius, 0, Math.PI * 2, counterClockwise);
            ctx.fill();
            ctx.stroke();

            /* draw inner circle */
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(cX, cY, innerRadius, 0, Math.PI * 2, counterClockwise);
            ctx.fill();
            ctx.strokeStyle = 'transparent';
            ctx.stroke();

            ctx.beginPath();

            /**
             * Helper function - adds a path (without calls to beginPath or closePath)
             * to the context which describes the inner tube. We use this for drawing
             * the background of the inner tube (which is always at 100%) and the
             * progress meter itself, which may vary from 0-100% */
            function makeInnerTubePath(startAngle, endAngle) {
                var centrePoint, startPoint, controlAngle, capLength, c1, c2, point1, point2;
                centrePoint = {
                    x: cX,
                    y: cY
                };

                startPoint = applyAngle(centrePoint, startAngle, innerBarRadius);

                ctx.moveTo(startPoint.x, startPoint.y);

                point1 = applyAngle(centrePoint, endAngle, innerBarRadius);
                point2 = applyAngle(centrePoint, endAngle, outerBarRadius);

                controlAngle = endAngle + (3.142 / 2.0);
                /* Cap length - a fifth of the canvas size minus 4 pixels */
                capLength = (cX * 0.20) - 4;

                c1 = applyAngle(point1, controlAngle, capLength);
                c2 = applyAngle(point2, controlAngle, capLength);

                ctx.arc(cX, cY, innerBarRadius, startAngle, endAngle, false);
                ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, point2.x, point2.y);
                ctx.arc(cX, cY, outerBarRadius, endAngle, startAngle, true);

                point1 = applyAngle(centrePoint, startAngle, innerBarRadius);
                point2 = applyAngle(centrePoint, startAngle, outerBarRadius);

                controlAngle = startAngle - (3.142 / 2.0);

                c1 = applyAngle(point2, controlAngle, capLength);
                c2 = applyAngle(point1, controlAngle, capLength);

                ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, point1.x, point1.y);
            }

            /* Background tube */
            ctx.beginPath();
            ctx.strokeStyle = 'transparent';
            makeInnerTubePath(startAngle, endAngle);

            ctx.fillStyle = tubeGrad;
            ctx.fill();
            ctx.stroke();

            //fix abreurapha
            if ((progress * 100) <= fixedProgress) {
                /* Calculate angles for the the progress metre */
                updatedProgress = progress * 100;
                completeAngle = startAngle + (progress * (endAngle - startAngle));
            }


            ctx.beginPath();
            makeInnerTubePath(startAngle, completeAngle);

            /* We're going to apply a clip so save the current state */
            ctx.save();
            /* Clip so we can apply the image gradient */
            ctx.clip();

            /* Draw the spiral gradient over the clipped area */
            ctx.drawImage(gradient, 0, 0, canvas.width, canvas.height);

            /* Undo the clip */
            ctx.restore();

            /* Draw the outline of the path */
            ctx.beginPath();
            makeInnerTubePath(startAngle, completeAngle);
            ctx.stroke();

            /*** TEXT ***/
            (function () {
                var fontSize, string, smallSize, heightRemaining;
                /* Calculate the size of the font based on the canvas size */
                fontSize = cX / 2;

                percentageText.style.top = ((settings.height / 2) - (fontSize / 2)).toString() + 'px';
                percentageText.style.color = '#d13177';
                percentageText.style.font = fontSize.toString() + 'px LG Smart Bold';
                percentageText.style.textShadow = 'None';

                /* Calculate the text for the given percentage */
                string = '<div style="font-size: 16px; font-family: \'LG Smart\'; margin-top: -20px">' +
                    ' <span style="color: #999">Você</span> <span style="font-family: \'LG Smart Bold\'">concluiu</span></div>' + updatedProgress.toFixed(0) + '%' +
                    '<div style="font-size: 16px; font-family: \'LG Smart\'; margin-top: 0"><span style="color: #999">' + params['bottomText']
                +'</span></div>';

                percentageText.innerHTML = string;

                /* Calculate font and placement of small 'value' text */
                smallSize = cX / 5.5;
                valueText.style.color = '#d13177';
                valueText.style.font = smallSize.toString() + 'px LG Smart Bold';
                valueText.style.height = smallSize.toString() + 'px';
                valueText.style.textShadow = 'None';

                /* Ugly vertical align calculations - fit into bottom ring.
                 * The bottom ring occupes 1/6 of the diameter of the circle */
                heightRemaining = (settings.height * 0.16666666) - smallSize;
                valueText.style.top = ((settings.height * 0.8333333) + (heightRemaining / 4)).toString() + 'px';
            }());
        };

        /**
         * Check the progress value and ensure it is within the correct bounds [0..1]
         */
        clipValue = function () {
            if (progress < 0) {
                progress = 0;
            }

            if (progress > 1.0) {
                progress = 1.0;
            }
        };

        /* Sets the current progress level of the loader
         *
         * @param value the progress value, from 0 to 1. Values outside this range
         * will be clipped
         */
        setProgress = function (value) {
            /* Clip values to the range [0..1] */
            progress = value;
            clipValue();
            drawLoader();
        };

        this.setProgress = setProgress;

        setValue = function (val) {
            value = val;

        };

        ready = function (fn) {
            if (imageLoaded) {
                fn();
            } else {
                gradient.addEventListener('load', fn);
            }
        };

        this.setValue = setValue;
        this.setValue(settings.value);

        this.loaded = ready;

        progress = settings.progress;
        clipValue();

        /* Do an initial draw */
        drawLoader();


        /* In controllable mode, add event handlers */
        if (params.controllable === true) {
            (function () {
                var mouseDown, getDistance, adjustProgressWithXY;
                getDistance = function (x, y) {
                    return Math.sqrt(Math.pow(x - cX, 2) + Math.pow(y - cY, 2));
                };

                mouseDown = false;

                adjustProgressWithXY = function (x, y) {
                    /* within the bar, calculate angle of touch point */
                    var pX, pY, angle, startTouchAngle, range, posValue;
                    pX = x - cX;
                    pY = y - cY;

                    angle = Math.atan2(pY, pX);
                    if (angle > Math.PI / 2.0) {
                        angle -= (Math.PI * 2.0);
                    }

                    startTouchAngle = startAngle - (Math.PI * 2.0);
                    range = endAngle - startAngle;
                    posValue = (angle - startTouchAngle) / range;
                    setProgress(posValue);

                    if (params.onProgressUpdate !== undefined) {
                        /* use the progress value as this will have been clipped
                         * to the correct range [0..1] after the call to setProgress
                         */
                        params.onProgressUpdate.call(plugin, progress);
                    }
                };

                outerDiv.addEventListener('mousedown', function (e) {
                    var offset, x, y, distance;
                    offset = this.getBoundingClientRect();
                    x = e.pageX - offset.left;
                    y = e.pageY - offset.top;

                    distance = getDistance(x, y);

                    if (distance > innerRadius && distance < radius) {
                        mouseDown = true;
                        adjustProgressWithXY(x, y);
                    }
                });

                outerDiv.addEventListener('mouseup', function () {
                    mouseDown = false;
                });

                outerDiv.addEventListener('mousemove', function (e) {
                    var offset, x, y;
                    if (mouseDown) {
                        offset = this.getBoundingClientRect();
                        x = e.pageX - offset.left;
                        y = e.pageY - offset.top;
                        adjustProgressWithXY(x, y);
                    }
                });

                outerDiv.addEventListener('mouseleave', function (e) {
                    mouseDown = false;
                });
            }());
        }

        return this;
    }
})();

// If jQuery is available, define this as a jQuery plugin
if (typeof jQuery !== 'undefined') {
    /*global jQuery */
    (function ($) {
        /* Strict mode for this plugin */

        /** Percentage loader
         * @param    params    Specify options in {}. May be on of width, height, progress or value.
         *
         * @example $("#myloader-container).percentageLoader({
                width : 256,  // width in pixels
                height : 256, // height in pixels
                progress: 0,  // initialise progress bar position, within the range [0..1]
                value: '0kb'  // initialise text label to this value
            });
         */
        $.fn.percentageLoader = function (params) {
            return this.each(function () {
                if (!$.data(this, 'dj_percentageloader')) {
                    $.data(this, 'dj_percentageloader', new PercentageLoader(this, params));
                } else {
                    var plugin = $.data(this, 'dj_percentageloader');
                    if (params['value'] !== undefined) {
                        plugin.setValue(params['value']);
                    }

                    if (params['progress'] !== undefined) {
                        plugin.setProgress(params['progress']);
                    }

                    if (params['onready'] !== undefined) {
                        plugin.loaded(params['onready']);
                    }
                }
            });
        };
    }(jQuery));
}
