var autoplay_func = null;
var example_templates = {
    'default': 'blocks2.html',
    'bs3 example - blog': 'bs3-examples-blog.html'
};
var stopped = false;
var FONTS_KEY = 'AIzaSyAM4K04yxd6F2-M6w8rEm4p97PMN6y2r0w';
var active_template = example_templates['default'];

function checkReadable(bg, els) {
    if(!allReadable(bg, els)) {
        $('#messages').text('BG/FG are not readable!');
        $('#status').addClass('bad-scheme');
    } else {
        $('#messages').empty();
        $('#status').removeClass('bad-scheme');
    }
}

function exportCSS(styles) {
    $('#exported-output').html(extractCSS(styles));
    $('#temp-font-style-font').html(font_css);
}

function generate(color, opts) {
    var css_string = generateColorScheme(color, opts);
    $('#css-export').val(css_string);
    $('#newstyles').html(css_string);
}

function autoplay() {
    if(autoplay_func !== null) clearInterval(autoplay_func);
    autoplay_func = setInterval(function(){
        if(stopped) return;
        generate(randomColor(), getColorOpts());
        $('.section').find('h1').css('font-family', randomFont());
        $('.section').find('h2, h3, h4, h5, h6').css('font-family', randomFont());
        $('.section').css('font-family', randomFont());
    }, 3000);
}

function getColorOpts() {
    return {
        color_mode: $('#mode').val().trim(),
        use_gradient: $('#gradient').is(':checked'),
        dark_color: $('#hover-dark').is(':checked'),
        optimize_colors: $('#optimize-colors').is(':checked'),
        section_1_selector: $('#section-1-selector').val().trim(),
        section_2_selector: $('#section-2-selector').val().trim(),
        section_3_selector: $('#section-3-selector').val().trim(),
        section_4_selector: $('#section-4-selector').val().trim(),
        section_5_selector: $('#section-5-selector').val().trim()
    };
}

function loadPageCallback() {
    generate(randomColor(), getColorOpts());
    autoplay();

    if($('#noise').is(':checked')) $('.section').toggleClass('noisy');
    $('#noise').on('click', function(e){
        $('.section').toggleClass('noisy');
    });
    $('#colorpicker').spectrum({
        move: function(color){
            stopped = true;
            generate(color, getColorOpts());
        }
    });
    $('#toggle-sections').on('click', function(){
        // Empty out the values first, then just call relabel.
        $('.section-class').val('#socket');
        reLabelSelectors();
    });
    $('[data-toggle="swappable"]').on('click', supertoggle);
    $('.section-class').on('keyup keypress keydown', reLabelSelectors);
    loadTestingElements();
}

function loadTemplate(e) {
    $('#socket').load('templates/' + $(this).val().replace('#', '').trim(), loadPageCallback);
}

function initPage() {
    $.each(example_templates, function(nicename, filename){
        $('#files').append('<option value="' + filename + '">' + nicename + '</option>');
    });
    $('#files').on('change', loadTemplate);
    $('#socket').load('templates/' + active_template, loadPageCallback);
}

function randomFont() {
    var default_fonts = [
        'Lato',
        'Georgia',
        'Consolas',
        'Verdana',
        'Tahoma',
        'Arial',
        'Helvetica',
        'Lucida Sans',
        'Lucida Console',
        'Lucida',
        'Big Caslon',
        'Book Antiqua',
        'Palatino Linotype',
        'Bodoni MT',
        'Didot',
        'Didot LT STD',
        'Hoefler Text',
        'Garamond',
        'Calisto MT',
        'Bookman Old Style',
        'Bookman',
        'Goudy Old Style',
        'Bitstream Charter',
        'Optima',
        'Segoe',
        'Candara',
        'Geneva',
        'Futura',
        'Trebuchet MS',
        'Franklin Gothic Medium',
        'ITC Franklin Gothic',
        'Gill Sans',
        'Calibri',
        'Baskerville old face',
        'Courier New'
    ];
    var len = default_fonts.length;
    return default_fonts[Math.floor(Math.random() * len)];
}

function loadFonts() {
    return;
    var els = $('h1, h2, p');
    // var els = $('h1, h2, h3, h4, h5, h6, p, ul, ol, dl, small');
    els.each(function(k, el){
        $(el).attr('data-typey-editable', '').append('<ul class="fonts" data-typey-font-list></ul>');
    });
    var ft = fonTypey({
        api_key: FONTS_KEY,
        auto_add: true,
        auto_add_els: els
    });
    ft.initAllFeatures('#socket');
    loadFontUI();
}

function reLabelSelectors() {
    // Re-label sections using the given css,
    // for customizing css selectors and css output.
    $('#socket').find('.section').each(function(k, el){
        var curr_selector = $('.section-class').eq(k).val();
        // Footer shares an example class
        if(k === 5) curr_selector = $('.section-class').eq(2).val();
        if(curr_selector[0] == '#') {
            $(el).attr('id', curr_selector.replace('#', ''));
        } else {
            $(el).addClass(curr_selector.replace('.', ''));
        }
    });
}

function loadTestingElements() {
    var total = $('.section').length;
    $('#templates').empty();
    $('.section').each(function(k, el){
        k += 1;
        $('#controls').find('#templates').append('<li><a class="btn btn-xs btn-block btn-default" href="#section' + k + '">View section ' + k + '</a></li>');
        $(el).append('<div id="loader_' + k + '" class="bs3-loader collapse container"></div>');
        var callback = k === total ? loadFonts : (function(){});
        $('#loader_' + k).load('templates/app-bootstrap-type1.html', callback);
    });
    // Relabel them all
    reLabelSelectors();
}

$(document).ready(initPage);
