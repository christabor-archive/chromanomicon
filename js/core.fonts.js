function generateFonts(e) {
    var fonts     = randomFonts(3, font_data);
    var url0      = buildUrlFragment(fonts[0]);
    var url1      = buildUrlFragment(fonts[1]);
    var url2      = buildUrlFragment(fonts[2]);
    var full_url  = 'http://fonts.googleapis.com/css?family=' + [url0, url1, url2].join('|');
    font_link     = updateStyleHref('#goog-font', full_url);
    updateFontCSS({
        'h1'    : fonts[0].family,
        'h2, h3, h4, legend'                           : fonts[1].family,
        'body, p, ol, ul, small, input, label'         : fonts[2].family,
        '.btn'  : fonts[1].family
    });
}

function generateFontSizing() {
    var root = $('#socket');
    alert('Random fonts!');
    root.find('h1').css('font-size', rando(80) + 'px');
    root.find('h2').css('font-size', rando(32) + 'px');
    root.find('h3').css('font-size', rando(24) + 'px');
    root.find('h4').css('font-size', rando(18) + 'px');
    root.find('h5').css('font-size', rando(16) + 'px');
    root.find('p, ul, ol, .btn').css('font-size', rando(14));
}

function buildFontCSS(fonts) {
    return [
    makeCSSRule('h1', {'font-family' : fonts[0].family}),
    makeCSSRule('h2, h3, h4, .btn', {'font-family' : fonts[1].family}),
    makeCSSRule('body, p, ol, ul, small', {'font-family' : fonts[2].family}),
    ].join('\n');
}

function updateFontCSS(font_data) {
    var style_str = '';
    var export_str = '';
    $.each(font_data, function(selector, font){
        export_str += (selector + '{ font-family:"' + font + '"; }\n');
        style_str += ('#layout-gen ' + selector + '{ font-family:"' + font + '"; }\n');
    });
    export_str += '\n\n<link rel="stylesheet" href="' + $('#goog-font').attr('href') + '">';
    $('#temp-font-style-color').html(style_str);
    $('#exported-output-fonts').text(export_str);
}

function loadFontUI() {
    $('[data-typey-editable]').each(function(k, el){
        var elname = $(el).context.nodeName.toLowerCase();
        $(el).attr('data-typey-target', elname);
        $(el).append('<span class="el">' + elname + '</span>');
    });
}
