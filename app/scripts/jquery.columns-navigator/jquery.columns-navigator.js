/*!
 * jQuery Columns navigator
 */

;(function ( $, window, document, undefined ) {
    // Create the defaults once
    var pluginName = "columnsNavigator",
    defaults = {
        dataUrl: "value",
        dataUrlWithParents: "value",
        dataUrlSeperator: "-",
        columnClass: "column",
        itemClass: "item",
        columnWidth: "280px"
    };

    var timeout;

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

            // Prepare elements.
            $(plugin.element).addClass('columns-navigator').wrap('<div class="columns-navigator-outer-wrapper" />').wrap('<div class="columns-navigator-wrapper" />')
            .append('<div class="shadow-right"><div class="inner"></div></div><a href="#" class="go-left navigate-button"></a><a href="#" class="go-right navigate-button"></a>');

            // Initialy hide the navigation buttons.
            $(plugin.element).addClass('hide-left-navigation-button').addClass('hide-right-navigation-button');

            // Add the breadcrumb.
             $(plugin.element).parent().prepend('<div class="columns-breadcrumb"><ul class="columns-breadcrumb-ul"></ul></div>');

            // Add the custom scrollbars.
            // Somehow scrollbars inside other scrollbars don't work.
            // $(plugin.element).parent().once('mCustomScrollbar').mCustomScrollbar({
            //     scrollInertia: 0,
            //     horizontalScroll: true
            // });

            // Get the path if it is.
            var hashToSet = location.hash.substr(1);
            if (hashToSet) {
                plugin.loadColumn(plugin.element, plugin.options, hashToSet, 0, true);
            }
            else {
                this.loadColumn(this.element, this.options);
            }

            $('.go-right').once().click(function() {
                plugin.moveRight(plugin.element, plugin.options);
                return false;
            });

            $('.go-left').once().click(function() {
                plugin.moveLeft(plugin.element, plugin.options);
                return false;
            });

            plugin.hideNavigationCheck();

            // Create the toggling of the scroll class.
            $(plugin.element).parent().scroll(function(event) {
                var timeout = setTimeout(function() {
                    plugin.hideNavigationCheck();
                }, 100);
            });

            $(window).resize(function() {
                $(plugin.element).parent().scroll();
            });

        },

        // Load a new column.
        loadColumn: function(el, options, id, depth, withParents) {
            var plugin = this;

            // Set the url to get the html from.
            var url;
            if (!id) { id = 0 }
            if (withParents) {
                url = options.dataUrlWithParents + options.dataUrlSeperator + id + '.html'
            }
            else {
                url = options.dataUrl + options.dataUrlSeperator + id + '.html'
            }

            $(plugin.element).addClass('hide-right-navigation-button');

            $.ajax({
                url: url,
            }).success(function(html) {

                var column = $(html);

                 // Remove all the columns that aren't needed.
                $('.' + options.columnClass, el).each(function(index, currentColumn) {
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
                var activeParent = $('.' + options.itemClass + '[data-id="' + id + '"]').parents('.column');

                var offset = $('.active', activeParent).offset();

                if (offset) {
                    $(activeParent).stop().scrollTo({
                        top: offset.top + 'px',
                        left: 0 + 'px'
                    });
                }

                // Add our column.
                $(el).append(column);

                // Add depths.
                $('.' + options.columnClass, el).each(function(index, currentColumn) {
                    $(currentColumn).attr('data-depth', index);
                    $('.' + options.columnClass + ' a[data-id="' + $(currentColumn).attr('data-id') + '"]', el).parent().addClass('active');
                });


                plugin.setHashAndBreadcrumb(el, options);
                plugin.redraw(el, options);

            });
        },
        hideNavigationCheck: function(el, options) {
            var plugin = this;
            var wrapper = $(plugin.element).parent();

            if( $(wrapper).scrollLeft() > 10) { $(plugin.element).addClass('has-hidden-columns').removeClass('no-hidden-columns'); }
            else { $(plugin.element).removeClass('has-hidden-columns').addClass('no-hidden-columns'); }

            // Add hide button class.
            var totalWidth = parseInt(plugin.options.columnWidth) * parseInt($('.' + plugin.options.columnClass).length + 1);
            if( $(wrapper).scrollLeft() > 10) { $(plugin.element).removeClass('hide-left-navigation-button'); }
            else { $(plugin.element).addClass('hide-left-navigation-button'); }

            if( $(wrapper).scrollLeft() < totalWidth - parseInt($(window).width() + 300)) { $(plugin.element).removeClass('hide-right-navigation-button'); }
            else { $(plugin.element).addClass('hide-right-navigation-button'); }
        },
        getCurrentPosition: function(el, options) {
            var scrollLeft = $(el).parent().scrollLeft();

            var currentPosition = Math.floor(scrollLeft / parseInt(options.columnWidth));

            return currentPosition;
        },
        moveLeft: function(el, options) {
            var plugin = this;

            var currentPosition = this.getCurrentPosition(el, options);

            $(plugin.element).parent().stop().scrollTo({
                top: 0,
                left: (currentPosition - 1) * 280 + 'px'
            }, 200);
        },
        moveRight: function(el, options, direction) {
            var plugin = this;

            var maxScrollLeft = $(plugin.element).parent()[0].scrollWidth - $(plugin.element).parent()[0].clientWidth;
            var currentPosition = this.getCurrentPosition(el, options);
            var totalColumns = $('.' + options.columnClass).length;
            var columnsOnPage = Math.floor($(plugin.element).parent()[0].clientWidth / 280);

            var columnsFromTheRight = totalColumns - columnsOnPage - currentPosition - 2;

            $(plugin.element).parent().stop().scrollTo({
                top: 0,
                left: maxScrollLeft - (columnsFromTheRight * 280) + 'px'
            }, 200);
        },
        redraw: function(el, options) {
            var plugin = this;

            // Resize the wrapper.
            var totalWidth = (parseInt(options.columnWidth) -1 ) * parseInt($('.' + options.columnClass).length);
            $(el).css('width', totalWidth + 'px');

            if (totalWidth > $(window).width()) { $(el).addClass('wider-than-sceen'); }
            else { $(el).removeClass('wider-than-sceen'); }


            // Attach our click handlers.
            $('.progress-display').progressDisplay();

            // Add the custom scrollbars.
            $('.column').once('mCustomScrollbar').mCustomScrollbar({
                scrollInertia: 0
            });

            $('.' + options.itemClass, el).once().click(function() {
                // Load the new column.
                Plugin.prototype.loadColumn(el, options, $(this).attr('data-id'), parseInt($(this).parents('ul').attr('data-depth')) + 1);
                return false;
            });

            clearTimeout(timeout);

            timeout = setTimeout(function() {
                var maxScrollLeft = $(el).parent()[0].scrollWidth - $(el).parent()[0].clientWidth;

                $(el).parent().stop().scrollTo({
                    top: 0,
                    left: maxScrollLeft + 'px'
                }, 500);
            }, 200);
        },
        setHashAndBreadcrumb: function(el, options) {
            var plugin = this;

            // Set the hash.
            if ($('.' + options.columnClass, el).length > 1) {
                location.hash = $('.' + options.columnClass + ':last', el).attr('data-id');
            }
            else {
                location.hash = '';
            }

            // Set breadcrumb.
            var crumbs = [];
            $.each($('.' + options.columnClass + ' .active', el), function(index, item) {
                var clonedItem = $(item).clone();
                clonedItem.find('span').remove();
                crumbs.push($(clonedItem).text());
            });

            $('.columns-breadcrumb-ul', $(el).parent()).html('<li>' + crumbs.join('</li><li>') + '</li>').jBreadCrumb({
                easing:'swing'
            });
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


