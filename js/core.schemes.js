// BS3 state types
var _states_original = {
    'info': tinycolor('#5bc0de').toHsl(),
    'primary': tinycolor('#337ab7').toHsl(),
    'success': tinycolor('#5cb85c').toHsl(),
    'warning': tinycolor('#f0ad4e').toHsl(),
    'danger': tinycolor('#d9534f').toHsl()
};

function getSaturationDifference(color1, color2) {
    var s1 = color1.s;
    var s2 = color2.s;
    return s1 > s2 ? s1 - s2 : s2 - s1;
}

function generateColorScheme(color, opts) {
    var _colors       = null;
    var css_string    = '';
    var accent_offset = 30;

    if(opts.color_mode === 'triad') _colors           = tinycolor(color).triad();
    if(opts.color_mode === 'tetrad') _colors          = tinycolor(color).tetrad();
    if(opts.color_mode === 'splitcomplement') _colors = tinycolor(color).splitcomplement();
    if(opts.color_mode === 'complement') _colors      = tinycolor(color).complement();
    if(opts.color_mode === 'mono') _colors            = tinycolor(color).monochromatic();
    if(opts.color_mode === 'analogous') _colors       = tinycolor(color).analogous();

    // Section 1
    var base_bg       = _colors[0].toHexString();
    var alt_bg        = _colors[2].toHexString();
    var fg_plain      = tinycolor(color).isDark() ? '#fff': '#000';
    var heading_sec1  = tinycolor(color).isDark() ? _colors[1].lighten(30).toHexString() : _colors[1].darken(30).toHexString();
    var accent_sec1   = tinycolor(base_bg).isDark() ? tinycolor(base_bg).lighten(accent_offset).toHexString() : tinycolor(base_bg).darken(accent_offset).toHexString();
    var border_sec1   = tinycolor(heading_sec1).isDark() ? tinycolor(heading_sec1).lighten(10).toHexString() : tinycolor(heading_sec1).darken(10).toHexString();
    var btn_bg_sec1   = heading_sec1;

    // Section 2
    var accent_sec2   = tinycolor(heading_sec1).isDark() ? tinycolor(heading_sec1).lighten(accent_offset).toHexString() : tinycolor(heading_sec1).darken(accent_offset).toHexString();
    var border_sec2   = tinycolor(base_bg).isDark() ? tinycolor(base_bg).lighten(10).toHexString() : tinycolor(base_bg).darken(10).toHexString();
    var fg_plain_sec2 = tinycolor(heading_sec1).isDark() ? _colors[1].lighten(30).toHexString() : _colors[1].darken(30).toHexString();
    var base_bg_sec2  = heading_sec1;
    var heading_sec2  = tinycolor(heading_sec1);
        heading_sec2  = heading_sec2.isDark ? heading_sec2.lighten(30).toHexString() : heading_sec2.darken(30).toHexString();
    var btn_bg_sec2   = base_bg;

    // Section 3
    var accent_sec3   = tinycolor(alt_bg).isDark() ? tinycolor(alt_bg).lighten(accent_offset).toHexString() : tinycolor(alt_bg).darken(accent_offset).toHexString();
    var fg_plain_sec3 = tinycolor(_colors[1].toHexString());
        fg_plain_sec3 = tinycolor(alt_bg).isDark() ? fg_plain_sec3.lighten(30).toHexString() : fg_plain_sec3.darken(30).toHexString();
    var border_sec3   = tinycolor(heading_sec1).isDark() ? tinycolor(heading_sec1).lighten(10).toHexString() : tinycolor(heading_sec1).darken(10).toHexString();
    var btn_fg_sec3   = tinycolor(heading_sec1).isDark() ? '#fff' : '#000';
    var heading_sec3  = tinycolor(alt_bg).isDark() ? tinycolor(heading_sec1).lighten(30).toHexString() : tinycolor(heading_sec1).darken(30).toHexString();
    var btn_bg_sec3   = heading_sec1;

    // Section 4
    var btn_bg_sec4       = heading_sec1;

    css_string += generateSectionCSS(opts.section_1_selector, {
        'base_bg': base_bg,
        'heading': heading_sec1,
        'fg_plain': fg_plain,
        'accent': accent_sec1,
        'border': border_sec1,
        'btn_bg': btn_bg_sec1
    }, opts);

    css_string += generateSectionCSS(opts.section_2_selector, {
        'base_bg': base_bg_sec2,
        'heading': heading_sec2,
        'fg_plain': fg_plain_sec2,
        'accent': accent_sec2,
        'border': border_sec2,
        'btn_bg': btn_bg_sec2
    }, opts);

   css_string += generateSectionCSS(opts.section_3_selector, {
        'base_bg': alt_bg,
        'heading': heading_sec3,
        'fg_plain': fg_plain_sec3,
        'accent': accent_sec3,
        'border': border_sec3,
        'btn_bg': btn_bg_sec3
    }, opts);

   // Dark neutral
   css_string += generateSectionCSS(opts.section_4_selector, {
        'base_bg': '#000',
        'heading': heading_sec1,
        'fg_plain': '#fff',
        'accent': '#555',
        'border': '#555',
        'btn_bg': btn_bg_sec4
    }, 3);

   // Light neutral
   css_string += generateSectionCSS(opts.section_5_selector, {
        'base_bg': '#fff',
        'heading': heading_sec1,
        'fg_plain': '#000',
        'accent': '#ccc',
        'border': '#ccc',
        'btn_bg': '#000'
    }, opts);
   return css_string;
}

function cssIfy(prop, val) {
    val = val + (val.endswith(';') ? '' : ';\n');
    prop = prop + (prop.empty() ? '' : ': ');
    return '   ' + prop + val;
}

function cssIfyAll(selector, props) {
    var css = selector + '{\n';
    $.each(props, function(prop, val){
        css += cssIfy(prop, val);
    });
    css += '\n}\n';
    return css;
}

function allSubselectors(container, selectors) {
    var sel = '';
    var last = selectors.length - 1;
    $.each(selectors, function(k, selector){
        sel += container + ' ' + selector + (k === last ? '\n' : ',\n');
    });
    return sel;
}

function optimizeFg(bg, fg, dark_base) {
    var ADJUST_INCREMENT = 1;
    var MAX_ATTEMPTS = 10;
    var count = 0;
    bg = tinycolor(bg).toHexString();
    fg = tinycolor(fg).toHexString();
    // Rectify all fg/bg combos:
    while(!tinycolor.isReadable(bg, fg)) {
        if(count >= MAX_ATTEMPTS) break;
        fg = dark_base ? tinycolor(fg).lighten(ADJUST_INCREMENT).toHexString() : tinycolor(fg).darken(ADJUST_INCREMENT).toHexString();
        count += 1;
    }
    return fg;
}

function generateSectionCSS(container, opts, config_opts) {
    var css = '';
    var container_css = container;
    var el = $(container);
    var dark_base = tinycolor(opts.base_bg).isDark();

    /**
     * Color Vars --------------------------------------------------------------
     */

    // Default/base
    var base_bg = opts.base_bg;
    var base_bg_shifted = dark_base ? tinycolor(opts.base_bg).lighten(20).toHexString() : tinycolor(opts.base_bg).darken(20).toHexString();
    var base_fg = opts.fg_plain;

    // Buttons
    var btn_bg = opts.btn_bg;
    var btn_fg = tinycolor(btn_bg).isDark() ? tinycolor(btn_bg).lighten(40).toHexString() : tinycolor(btn_bg).darken(40).toHexString();
    var btn_hover_bg = config_opts.dark_color ? tinycolor(btn_bg).darken(10).toHexString() : tinycolor(btn_bg).lighten(10).toHexString();
    var btn_hover_border = config_opts.dark_color ? tinycolor(opts.border).darken(10).toHexString() : tinycolor(opts.border).lighten(10).toHexString();

    // Headings
    var heading1_fg = dark_base ? tinycolor(opts.base_bg).lighten(30).toHexString() : tinycolor(opts.base_bg).darken(30).toHexString();
    var heading1_textshadow = dark_base ? tinycolor(heading1_fg).darken(40).toHexString() : tinycolor(heading1_fg).lighten(40).toHexString();
    var heading2_plus_fg = dark_base ? tinycolor(btn_fg).lighten(10).desaturate(10).toHexString() : tinycolor(btn_fg).darken(10).desaturate(10).toHexString();
    // Alt h2 option
    // var heading2_plus_fg = dark_base ? tinycolor(opts.heading).lighten(10).toHexString() : tinycolor(opts.heading).darken(10).toHexString();

    // Links/link like things
    var link_fg = tinycolor(btn_bg).isDark() ? tinycolor(btn_bg).lighten(20).toHexString() : tinycolor(btn_bg).lighten(20).toHexString();
    var link_fg_hover = config_opts.dark_color ? tinycolor(link_fg).darken(10).toHexString() : tinycolor(link_fg).lighten(10).toHexString();

    // Accents etc
    var base_accent = opts.accent;

    /**
     * Optimize all combos -----------------------------------------------------
     */
    if(config_opts.optimize_colors) {
        base_fg = optimizeFg(base_bg, base_fg, dark_base);
        heading1_fg = optimizeFg(base_bg, heading1_fg, dark_base);
        heading2_plus_fg = optimizeFg(base_bg, heading2_plus_fg, dark_base);
        link_fg = optimizeFg(base_bg, link_fg, dark_base);
        base_accent = optimizeFg(base_bg, base_accent, dark_base);
    }

    /**
     * Add all CSS props -------------------------------------------------------
     */

    // Container
    var props1 = {
        'background-color': base_bg,
        'color': base_fg,
        'border-color': base_accent
    };
    css += cssIfyAll(container_css, props1);

    // Plain foreground colors
    var props2 = {'color': base_fg};
    css += cssIfyAll(allSubselectors(container_css, [
        'p', 'ul', 'ol', 'dl', '.help-block',
        '.breadcrumb>.active'
    ]), props2);

    if(config_opts.use_gradient) {
        css += container_css + ' {\n' + cssIfy('', dualGradient(base_bg, base_bg_shifted)) + '\n}';
    }

    // Headings
    var props3 = {
        'color': heading1_fg
    };
    css += cssIfyAll(allSubselectors(container_css, ['h1']), props3);

    props3['text-shadow'] = '0 1px 3px ' + heading1_textshadow;
    css += cssIfyAll(allSubselectors(container_css, ['h1']), props3);

    var props4 = {
        'color': heading2_plus_fg
    };
    css += cssIfyAll(allSubselectors(container_css, ['h2', 'h3', 'h4', 'h5', 'h6']), props4);

    // Border/accent
    var props5 = {'border-color': base_accent};
    css += cssIfyAll(allSubselectors(container_css, ['hr']), props3);

    var props6 = {'color': base_accent};
    css += cssIfyAll(allSubselectors(container_css, ['.lead', 'h1 > small', 'blockquote footer', 'blockquote small', 'blockquote .small', 'legend']), props6);

    // Buttons
    var props7 = {'color': link_fg};
    css += cssIfyAll(allSubselectors(container_css, ['a:not(.btn)']), props7);

    var props7_hover = {'color': link_fg_hover};
    css += cssIfyAll(allSubselectors(container_css, ['a:not(.btn):hover']), props7_hover);

    var props8 = {
        'background-color': opts.btn_bg,
        'border-color': opts.border,
        'color': btn_fg
    };
    css += cssIfyAll(allSubselectors(container_css, [
        '.btn',
        '.nav-pills>li.active>a',
        '.nav-pills>li.active>a:hover',
        '.nav-pills>li.active>a:focus',

        '.modal-content',

        '.navbar-inverse .navbar-nav>.active>a',
        '.navbar-inverse .navbar-nav>.active>a:hover',
        '.navbar-inverse .navbar-nav>.active>a:focus'
    ]), props8);

    var props8_hover = {
        'background-color': btn_hover_bg,
        'border-color': btn_hover_border
    };
    props8_hover['color'] = tinycolor(props8_hover['background-color']).isDark() ? 'white' : 'black';
    css += cssIfyAll(allSubselectors(container_css, [
        '.btn:hover',
        '.nav>li>a:hover',
        '.nav>li>a:focus'
    ]), props8_hover);

    // BOOTSTRAP SPECIFIC
    var bs3_accent_offset = 10;

    // Light on dark
    var bs3_opts = dark_base ? tinycolor(opts.base_bg).lighten(bs3_accent_offset).toHexString() : tinycolor(opts.base_bg).darken(bs3_accent_offset).toHexString();
    var props9 = {'background-color': bs3_opts};
    css += cssIfyAll(allSubselectors(container_css, [
        '.panel-body',
        '.well',
        '.badge',
        '.table-striped>tbody>tr:nth-child(odd)',
        '.jumbotron',
        '.navbar-inverse',
    ]), props9);

    // Dark on light
    var bs3_opts_alt = dark_base ? tinycolor(opts.base_bg).darken(bs3_accent_offset).toHexString() : tinycolor(opts.base_bg).lighten(bs3_accent_offset).toHexString();
    var props9_alt = {'background-color': bs3_opts_alt};
    css += cssIfyAll(allSubselectors(container_css, [
        '.navbar-inverse',
        '.table-striped>tbody>tr:nth-child(even)',
        '.list-group-item',

        '.pagination>.active>a',
        '.pagination>.active>span',
        '.pagination>.active>a:hover',
        '.pagination>.active>span:hover',
        '.pagination>.active>a:focus',
        '.pagination>.active>span:focus',

        '.pager li>a',
        '.pager li>span'
    ]), props9_alt);

    var props10 = {'border-color': bs3_opts};
    css += cssIfyAll(allSubselectors(container_css, [
        '.navbar-inverse',
        '.table-bordered',
        '.table-striped',
        '.table',
        '.table>thead>tr>th',
        '.table>tbody>tr>th',
        '.table>tfoot>tr>th',
        '.table>thead>tr>td',
        '.table>tbody>tr>td',
        '.table>tfoot>tr>td',
        'blockquote',
        '.well',
        '.list-group-item',

        '.pagination>.active>a',
        '.pagination>.active>span',
        '.pagination>.active>a:hover',
        '.pagination>.active>span:hover',
        '.pagination>.active>a:focus',
        '.pagination>.active>span:focus',

        '.pager li>a, .pager li>span'
    ]), props10);

    // BS3 white bg widgets
    var props11 = {
        'background-color': dark_base ? tinycolor(opts.base_bg).lighten(20).toHexString() : tinycolor(opts.base_bg).lighten(20).toHexString(),
        'border-color': dark_base ? tinycolor(opts.base_bg).lighten(10).toHexString() : tinycolor(opts.base_bg).lighten(10).toHexString(),
    };
    // TODO: cleanup - lot of code generated here.
    css += cssIfyAll(allSubselectors(container_css, [
        '.pager .disabled>a',
        '.pager .disabled>span',
        '.breadcrumb',

        '.nav-tabs>li.active>a',

        '.pagination>li>a',
        '.pagination>li>span',
        '.pagination>.disabled>span',
        '.pagination>.disabled>a'
    ]), props11);

    var props12 = {
        'background-color': dark_base ? tinycolor(opts.base_bg).lighten(10).toHexString() : tinycolor(opts.base_bg).lighten(10).toHexString(),
        'color': dark_base ? tinycolor(opts.base_fg).lighten(30).toHexString() : tinycolor(opts.base_fg).lighten(30).toHexString()
    };
    css += cssIfyAll(allSubselectors(container_css, [
        '.pagination>li>a:hover',
        '.pagination>li>span:hover',
        '.pagination>li>a:focus',
        '.pagination>li>span:focus',

        '.pager .disabled>a:hover',
        '.pager .disabled>a:focus',

        '.nav-tabs>li.active>a:hover',
        '.nav-tabs>li.active>a:focus',

        '.pagination>.disabled>span:hover',
        '.pagination>.disabled>span:focus',
        '.pagination>.disabled>a:hover',
        '.pagination>.disabled>a:focus'
    ]), props12);

    // TODO:
    // var saturation_difference = getSaturationDifference(tinycolor(btn_bg).toHsl(), _states_original['success']);
    // var success_bg = {'background-color': tinycolor(_states_original['success']).saturate(Math.round(saturation_difference)).toHexString()};
    // css += cssIfyAll(allSubselectors(container_css, [
    //     '.progress-bar-success',
    //     '.label-success',
    //     '.btn-success'
    // ]), success_bg);

    // var saturation_difference = getSaturationDifference(tinycolor(btn_bg).toHsl(), _states_original['info']);
    // var info_bg = {'background-color': tinycolor(_states_original['info']).saturate(Math.round(saturation_difference)).toHexString()};
    // css += cssIfyAll(allSubselectors(container_css, [
    //     '.progress-bar',
    //     '.label-info',
    //     '.btn-info'
    // ]), info_bg);

    // var saturation_difference = getSaturationDifference(tinycolor(btn_bg).toHsl(), _states_original['warning']);
    // var warning_bg = {'background-color': tinycolor(_states_original['warning']).saturate(Math.round(saturation_difference)).toHexString()};
    // css += cssIfyAll(allSubselectors(container_css, [
    //     '.progress-bar-warning',
    //     '.label-warning',
    //     '.btn-warning'
    // ]), warning_bg);

    // var saturation_difference = getSaturationDifference(tinycolor(btn_bg).toHsl(), _states_original['danger']);
    // var danger_bg = {'background-color': tinycolor(_states_original['danger']).saturate(Math.round(saturation_difference)).toHexString()};
    // css += cssIfyAll(allSubselectors(container_css, [
    //     '.progress-bar-danger',
    //     '.label-danger',
    //     '.btn-danger'
    // ]), danger_bg);

    // var saturation_difference = getSaturationDifference(tinycolor(btn_bg).toHsl(), _states_original['primary']);
    // var primary_bg = {'background-color': tinycolor(_states_original['primary']).saturate(Math.round(saturation_difference)).toHexString()};
    // css += cssIfyAll(allSubselectors(container_css, [
    //     '.progress-bar-primary',
    //     '.panel-primary>.panel-heading',
    //     '.label-primary',
    //     // '.btn-primary'
    // ]), primary_bg);

    // TODO: bs3 state text
    // TODO: striped progress bars bg
    return css;
}
