String.prototype.empty = function(thing){
    return this.length === 0;
}

String.prototype.startswith = function(thing){
    var range = thing.length;
    return this.substr(0, range) === thing;
}

String.prototype.endswith = function(thing){
    var end = this.length;
    var start = end - thing.length;
    return this.substr(start, end) === thing;
}

$.fn.fgColor = function(color) {
    if(!color) return this;
    styles.push(makeCSSRule(this.selector, {'color': color.toHexString()}));
    this.each(function(k, el){
        $(el).css({'color'  : color.toHexString()});
    });
    return this;
}

$.fn.bgColor = function(color) {
    styles.push(makeCSSRule(this.selector, {'background-color' : color.toHexString()}));
    this.each(function(k, el){
        $(el).css({'background-color': color.toHexString()});
    });
    return this;
}

$.fn.brdColor = function(color) {
    styles.push(makeCSSRule(this.selector, {'border-color': color.toHexString()}));
    this.each(function(k, el){
        $(el).css({'border-color': color.toHexString()});
    });
    return this;
}

function randomFonts(number, font_data) {
    var fonts = [];
    for(var i = 0; i < number; i++) {
        fonts.push(randomArrayValue(font_data));
    }
    return fonts;
}

function randomColorTest() {
    var bg = randomColorObject(255);
    var fg = randomColorObject(255);
    var diffs = checkVisibility(bg, fg);
    var text = ['[Visibility] ', 'Color: ', diffs[0], 'Brightness:', diffs[1]].join(' ');
    $('*').css({
        'color': rgbString(fg.r, fg.g, fg.b),
        'background-color': rgbString(bg.r, bg.g, bg.b)
    });
    return text;
}

function extractCSS(declarations) {
    var html = '';
    $.each(declarations, function(k, declaration){
        html += declaration + '\n';
    });
    return html;
}

function allReadable(base, colors) {
    var is_valid = true;
    $.each(colors, function(k, color){
        if(!tinycolor.isReadable(base, color)) is_valid = false;
    });
    return is_valid;
}

function updateStyleHref(link_el, url) {
    // Open+Sans:300italic,600italic,700italic,800italic,400,600,300,700
    $(link_el).attr({
        'href': url,
        'rel': 'stylesheet',
        'type': 'text/css'
    });
}

function buildUrlFragment(font_obj) {
    // Creates the appropriate Google
    // font link href for embedding stylesheets.
    var url = font_obj.family.replace(/\s/gi, '+') + ':' + font_obj.variants.join(',');
    return url;
}

function addSwatch(container, color) {
    var swatch = $('<div></div>');
    swatch.addClass('swatch');
    swatch.css({
        'background-color': color.toHexString(),
        'color': '#' + tinycolor(tinycolor(tinycolor(color).complement()).desaturate(100)).lighten(50).toHexString()
    });
    swatch.text('#' + tinycolor(color).toHexString());
    $(container).append(swatch);
}

function addSwatches(el, colors) {
    $(el).empty();
    $.each(colors, function(_, color){
        addSwatch(el, color);
    });
}

function addAllSwatches(dark_el, light_el, dark, light) {
    addSwatches(dark_el, dark);
    addSwatches(light_el, light);
}

function makeCSSRule(selectors, declarations, prefix) {
    selectors = selectors.split(',');
    $.each(selectors, function(k, sel){
        selectors[k] = (prefix ? prefix : '') + ' ' + sel;
    });
    var css = selectors.join(',\n') + ' {\n';
    $.each(declarations, function(prop, value){
        if(prop === 'font-family') value = '"' + value + '"';
        if(prop.length === 0) {
            css += value + '\n';
        } else {
            css += prop + ': ' + value + ';\n';
        }
    });
    css += '}';
    return css;
}

function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}

function rgbString(r, g, b, a) {
    r = r || 0;
    g = g || 0;
    b = b || 0;
    if(a) {
        return ['rgba(', r, ',', g, ',', b, ',', clamp(a, 0, 1), ')'].join('');
    } else {
        return ['rgb(', r, ',', g, ',', b, ')'].join('');
    }
}

function getKey(arr) {
    // get a random key by the length
    // of a given array
    return Math.floor(Math.random() * arr.length);
}

function dualGradient(top, bottom) {
    // add # if missing.
    top = top[0] === '#' ? top : '#' + top;
    bottom = bottom[0] === '#' ? bottom : '#' + bottom;
    var grad = [
    'background-image: -webkit-gradient(',
        'linear,',
        'left top,',
        'left bottom,',
        'color-stop(0, '+top+')',
        'color-stop(1, '+bottom+')',
        ');',
    'background-image: -o-linear-gradient(bottom, '+top+' 0%, '+bottom+' 100%);',
    'background-image: -moz-linear-gradient(bottom, '+top+' 0%, '+bottom+' 100%);',
    'background-image: -webkit-linear-gradient(bottom, '+top+' 0%, '+bottom+' 100%);',
    'background-image: -ms-linear-gradient(bottom, '+top+' 0%, '+bottom+' 100%);',
    'background-image: linear-gradient(to bottom, '+top+' 0%, '+bottom+' 100%);'].join('\n');
    return grad;
}
