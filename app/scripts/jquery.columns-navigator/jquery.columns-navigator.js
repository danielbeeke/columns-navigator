/*!
 * jQuery Columns navigator
 */

;(function ( $, window, document, undefined ) {
    // Create the defaults once
    var pluginName = "columnsNavigator",
        defaults = {
            dataUrl: "value",
            columnClass: "column",
            itemClass: "item",
            columnWidth: "280px"
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

            $(plugin.element).addClass('columns-navigator');

            var hashToSet = location.hash.substr(1);

            if (hashToSet) {
                hashToSet = '0/' +  hashToSet;

                var parts = hashToSet.split('/');

                // We can improve this serverside,
                // by loading all ul's next to each other.
                $.each(parts, function(index, part) {
                    plugin.loadColumn(plugin.element, plugin.options, part, index + 1, false);
                });
            }
            else {
                this.loadColumn(this.element, this.options);
            }
        },

        // Load a new column.
        loadColumn: function(el, options, id, depth, async) {
            var plugin = this;

            // Set the url to get the html from.
            var url;
            if (!id) { id = 0 }
            url = options.dataUrl + '-' + id + '.html'

            // Set the default for async.
            if (async === 'undefined') {
                async = true;
            }

            $.ajax({
                url: url,
                async: async
            }).success(function(html) {

                var column = $(html);

                // Set the column depth.
                if (!depth) { $(column).attr('data-depth', 0); }
                else { $(column).attr('data-depth', depth); }

                // Set the column id.
                if (!id) { $(column).attr('data-id', 0); }
                else { $(column).attr('data-id', id); }

                // Remove all the columns that aren't needed.
                $('.' + options.columnClass).each(function(index, currentColumn) {
                    if ($(currentColumn).attr('data-depth') >= depth) {
                        $(currentColumn).remove();
                    }
                });

                // Remove all not valid active classes.
                $.each($('.' + options.columnClass, el), function(index, currentColumn) {
                    if ($(currentColumn).attr('data-depth') >= depth - 1) {
                        $('*', currentColumn).removeClass('active');
                    }
                });

                // Add our active class.
                $('.' + options.itemClass + '[data-id="' + id + '"]').parent('li').addClass('active');

                plugin.setHash(el, options);

                // Resize the wrapper.
                $(el).css('width', parseInt(options.columnWidth) * ($('.' + options.columnClass).length + 1) + 'px');

                // Add our column.
                $(el).append(column);

                // Attach our click handlers.
                $('.' + options.itemClass, el).once().click(function() {
                    // Load the new column.
                    Plugin.prototype.loadColumn(el, options, $(this).attr('data-id'), parseInt($(this).parents('ul').attr('data-depth')) + 1);
                    return false;
                });

            });
        },
        setHash: function(el, options) {
            var plugin = this;

            // Set the hash.
            var parts = [];
            $.each($('.' + options.columnClass, el), function(index, currentColumn) {
                if ($('.active .' + options.itemClass, currentColumn).attr('data-id')) {
                    parts.push($('.active .' + options.itemClass, currentColumn).attr('data-id'));
                }
            });

            location.hash = parts.join('/');
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


