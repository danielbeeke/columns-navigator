/*!
 * jQuery Progress Display.
 */

;(function ( $, window, document, undefined ) {
    // Create the defaults once
    var pluginName = "progressDisplay",
        defaults = {
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        // Init the plugin.
        init: function() {
            var plugin = this;
            $(plugin.element).once().addClass('progress-display').append('<span class="progress-display-label">' +
            $(plugin.element).attr('data-progress') +
            '%</span><span class="progress-display-bar"><span class="progress-display-bar-inner"></span></span>');

            // Set color class.
            if ($(plugin.element).attr('data-color')) {
                var color = $(plugin.element).attr('data-color');
                var shadeColor = this.shadeColor($(plugin.element).attr('data-color'), -0.25);

                $('.progress-display-bar-inner', plugin.element).css('background', '-webkit-gradient(linear, 50% 100%, 50% 0%, color-stop(0%, ' + shadeColor + '), color-stop(100%, ' + color + '))');
                $('.progress-display-bar-inner', plugin.element).css('background', '-webkit-linear-gradient(bottom, ' + shadeColor + ', ' + color + ')');
                $('.progress-display-bar-inner', plugin.element).css('background', '-moz-linear-gradient(bottom, ' + shadeColor + ', ' + color + ')');
                $('.progress-display-bar-inner', plugin.element).css('background', '-o-linear-gradient(bottom, ' + shadeColor + ', ' + color + ')');
                $('.progress-display-bar-inner', plugin.element).css('background', 'linear-gradient(bottom, ' + shadeColor + ', ' + color + ')');

            }
            else {
                if ($(plugin.element).attr('data-progress') <= 50) {
                    $(plugin.element).addClass('red').parent().addClass('red');
                } else if ($(plugin.element).attr('data-progress') > 50 && $(plugin.element).attr('data-progress') <= 75) {
                    $(plugin.element).addClass('orange').parent().addClass('orange');;
                } else {
                    $(plugin.element).addClass('green').parent().addClass('green');
                }
            }


            $('.progress-display-label', plugin.element).css('left', $(plugin.element).attr('data-progress') + '%');
            $('.progress-display-bar', plugin.element).css('width', $(plugin.element).attr('data-progress') + '%');

        },
        shadeColor: function(hex, lum) {
            // validate hex string
            hex = String(hex).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
            }
            lum = lum || 0;

            // convert to decimal and change luminosity
            var rgb = "#", c, i;
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i*2,2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00"+c).substr(c.length);
            }

            return rgb;
        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );


