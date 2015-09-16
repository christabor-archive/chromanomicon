/*!
 * jquery supertoggle - A jQuery plugin to allow complex toggling of any styles, classes, etc... easily
 * (c) 2015 Chris Tabor <dxdstudio@gmail.com>
 * See license for information
 * <3
 * https://christabor.github.io/supertoggle/
 * https://github.com/christabor/supertoggle/
 */
function supertoggle(e) {
    var data = $(this).data();
    if(!data['swap']) return;
    $.each(data['swap'], function(id, swap_data){
        if(swap_data.length === 0) return false;
        $.each(swap_data, function(key, to_swap){
            $.each(to_swap, function(el_from, el_to){
                // From -> to classes
                if(el_from[0] === '.') $(id).removeClass(el_from.replace(/\./g, ' '));
                // To <- from classes
                if(el_to[0] === '.' || el_from === '') $(id).addClass(el_to.replace(/\./g, ' '));
                // To <- from IDs
                if(el_from[0] === '#') $(id).attr('id', '');
                // From -> to IDs
                if(el_from[1] === '#') $(id).attr('id', el_to.replace('#', ''));
                // Swap the raw data element for next time.
                var el = {};
                el[el_to] = el_from;
                // Overwrite the property.
                data['swap'][id][key] = el
            });
        });
    });
    // Reset the data on the DOM element as well, so toggling works again.
    $(this).data('swap', data['swap']);
}
