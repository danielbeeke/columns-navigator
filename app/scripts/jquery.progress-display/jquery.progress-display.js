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
            '%</span><span class="progress-display-bar"></span>');

            // Set color class.
            if ($(plugin.element).attr('data-progress') <= 50) {
                $(plugin.element).addClass('red');
            } else if ($(plugin.element).attr('data-progress') > 50 && $(plugin.element).attr('data-progress') <= 75) {
                $(plugin.element).addClass('orange');
            } else {
                $(plugin.element).addClass('green');
            }

            $('.progress-display-label', plugin.element).css('left', $(plugin.element).attr('data-progress') + '%');
            $('.progress-display-bar', plugin.element).css('width', $(plugin.element).attr('data-progress') + '%');

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


