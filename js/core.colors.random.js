function randomGradientObj(max_stops) {
    var gradients   = [];
    var color_stops = 'bottom, ';
    var step        = '';
    // divide each color stop
    // by the max stops and add the color
    for (var i = max_stops; i > 0; i--) {
        if(i === max_stops) {
            // always start at 1%
            step = '1%, ';
        }
        else if(i === 1) {
            // remove trailing
            // comma on last color-step
            step = Math.round(100 / i) + '%';
        } else {
            step = Math.round(100 / i) + '%, ';
        }
        color_stops += randomColorHex() + ' ' + step;
    }
    color_stops += ')';
    gradients.push('-webkit-linear-gradient(' + color_stops);
    gradients.push('-ms-linear-gradient(' + color_stops);
    gradients.push('-o-linear-gradient(' + color_stops);
    gradients.push('-moz-linear-gradient(' + color_stops);
    gradients.push('linear-gradient(' + color_stops);
    return gradients;
}

function rando(max) {
    return Math.floor(Math.random() * max);
}

function randomColor(max, opacity) {
    // return a random color,
    // in rgba format
    if(isNaN(max)) {
        max = 255;
    }
    return rgbString(rando(max), rando(max), rando(max), opacity);
}

function randomRGBA(max) {
    return randomColor(max);
}

function randomColorArray(max) {
    // assumed to always be RGB, though since it's
    // random it doesn't matter
    return [rando(max), rando(max), rando(max)];
}

function randomColorHex(is_octal) {
    // Creds: http://www.paulirish.com/2009/random-hex-color-code-snippets/
    var color = Math.floor(Math.random()*16777215).toString(16);
    // added a custom is_octal flag to determine if using
    // octal or not (useful in libraries like THREE.js)
    return is_octal ? '0x'+color : '#'+color;
}

function randomColorObject(max) {
    // return an RGB object
    return {
        r: rando(max),
        g: rando(max),
        b: rando(max)
    };
}

function randomArrayValue(arr) {
    return arr[getKey(arr)];
}

function randomObjValue(obj) {
    if(!Object.keys) return;

    // get the random "key" as integer
    var counter = 0;
    var rand    = rando(Object.keys(obj).length);
    var el      = {};
    $.each(obj, function(k, v){
        // see if the current key
        // matches the random integer
        if(counter === rand) {
            el[k] = v;
        }
        counter += 1;
    });
    if(!el) return obj;
    return el;
}
