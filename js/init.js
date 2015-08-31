var FONTS_KEY = 'AIzaSyAM4K04yxd6F2-M6w8rEm4p97PMN6y2r0w';

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

function autoplay() {
    setInterval(function(){
        generateColorScheme(randomColor(), getColorOpts());

        $('.section').find('h1').css('font-family', randomFont());
        $('.section').find('h2, h3, h4, h5, h6').css('font-family', randomFont());
        $('.section').css('font-family', randomFont());

    }, 3000);
}

function getColorOpts() {
    return {
        color_mode: $('#mode').val().trim(),
        use_gradient: $('#gradient').is(':checked')
    };
}

function initPage() {
    $('#socket').load('templates/blocks2.html', function(){

        generateColorScheme(randomColor(), getColorOpts());
        autoplay();

        $('#noise').on('click', function(e){
            $('.section').toggleClass('noisy');
        });
        $('#colorpicker').spectrum({
            move: function(color){
                generateColorScheme(color, getColorOpts());
            }
        });
        loadTestingElements();
    });
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

    console.log('Loading fonts...');
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

function loadTestingElements() {
    var total = $('.section').length;
    $('.section').each(function(k, el){
        k += 1;
        $('#controls').find('#templates').append('<li><a class="btn btn-xs btn-block btn-default" href="#loader_' + k + '">View section ' + k + '</a></li>');
        $(el).append('<div id="loader_' + k + '" class="bs3-loader collapse container"></div>');
        // if(k === total) loadFonts();
        var callback = k === total ? loadFonts : (function(){});
        $('#loader_' + k).load('templates/app-bootstrap-type1.html', callback);
    });
}

$(document).ready(initPage);
