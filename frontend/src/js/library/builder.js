/*! 
    * jQuery Builder - v1.0.0 - 2018-06-15
    * http://www.3forcom.com
    * Copyright (c) 2018 3forcom - Truong Nguyen 
*/

;(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'builder';

	// Only allow for one instantiation of this script and make sure Google Maps API is included
	if (typeof $.fn[pluginName] !== 'undefined') {
		return;
	}

	// Variables used across multiple methods
	var $this;
	var dataArray = [], catArray = [];
	var dataObj = {};

	// Create the defaults once. DO NOT change these settings in this file - settings should be overridden in the plugin call
	var defaults = {
        // Data
        'dataHTML'                  : 'data/data.json',
        // Class
        'addButtonClass'            : 'builder__buttons__add',
        'addButtonDropdownClass'    : 'builder__buttons__dropdown',
        'addButtonDropdownTabClass' : 'builder__buttons__dropdown__tab',
        'addButtonContentClass'     : 'builder__buttons__content',
        'addButtonContentTabClass'  : 'builder__buttons__content__tab',
        'addButtonInsetClass'       : 'builder__buttons__content__tab__item__add',
        // Times
        'duration'                  : 200
	};

	// Plugin constructor
	function Plugin(element, options) {
		$this = $(element);
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {

		/**
		 * Init function
		 */
		init: function () {
			var _this = this;
            this.writeDebug('init');
            
            $(window).resize(function () { this.resize(); });
	        this.resize();
			
			// Load the templates and continue from there
            this.processData();
            this.dragDrop();
            this.download();
        },

        /**
		 * Render Category HTML
		 *
		 * @param data {array} data html
		*/
        renderCategory: function(data){
            var _this = this, tempType = [];
            $(data).each(function (x) {
                var type = data[x].type;
                if($.inArray(type, tempType) === -1) {
                    var tempDropdownHTML = '<div class="builder__buttons__dropdown__tab" data-type="' + type + '"><p>' + type + '</p><i class="fa fa-caret-right"></i></div>';
                    var tempContentHTML = '<div class="builder__buttons__content__tab" data-type="' + type + '"></div>';
                    $('.' + _this.settings.addButtonDropdownClass).append(tempDropdownHTML);
                    $('.' + _this.settings.addButtonContentClass).append(tempContentHTML);
                    tempType.push(type);
                    _this.renderTabItem(data, type);
                }
            });
        },

        /**
		 * Render Tab Items HTML
		 *
		 * @param data {array} data html
         * @param type {string} category
		*/
        renderTabItem: function(data, type){
            var _this = this;
            var _type = type;
            $(data).each(function (x) {
                var id      = data[x].id,
                    name    = data[x].name,
                    type    = data[x].type,
                    image   = data[x].image;                
                if(type === _type) {
                    var temItemHTML = '<div class="builder__buttons__content__tab__item" data-id="' + id + '"><img src="' + image + '" alt="' + name + '" /><div class="builder__buttons__content__tab__item__add btn btn-success btn-sm"><i class="fa fa-plus"></i>&nbsp;Insert</div></div>';
                    $('.' + _this.settings.addButtonContentTabClass + '[data-type="' + type + '"]').append(temItemHTML);
                }
            });
        },

        addSecction: function(){
            var _this       = this, 
                button      = $("." + _this.settings.addButtonClass),
                dropdown    = $("." + _this.settings.addButtonDropdownClass),
                dropdownTab = $("." + _this.settings.addButtonDropdownTabClass),
                content     = $("." + _this.settings.addButtonContentClass),
                contentTab  = $("." + _this.settings.addButtonContentTabClass),
                inset       = $("." + _this.settings.addButtonInsetClass),
                duration    = _this.settings.duration;

            button.hover(
                function () { 
                    dropdown.fadeIn(duration); 
                }, function () { 
                    dropdown.fadeOut(duration); 
                }
            );

            dropdown.hover(
                function () {
                    content.fadeIn(duration);
                }, function () {
                    content.fadeOut(duration);
                }
            );

            dropdownTab.hover(
                function () {
                    var el = $(this),
                        data = el.data('type');
                        contentTab.hide();
                        el.addClass('current');
                        $("." + _this.settings.addButtonContentTabClass + "[data-type='" + data + "']").show();
                }, function () {                    
                    $(this).removeClass('current');
                }
            );

            inset.click(function(){
                var el = $(this),
                    id = el.parent('div').data('id');
                    _this.addSecctionBlock(id);
            });
        },

        addSecctionBlock: function(id){
            var html;
            var _this = this;
            var _id = id;
            $(dataArray).each(function (x) {
                if(dataArray[x].id === _id) {
                    html = dataArray[x].html;
                }
            })
            $("#builder-content").prepend('<div class="section">' + html + '<div class="section__delete"><i class="fa fa-times" ></i></div><div>');
            _this.performDelete();
            _this.hoverEdit();
        },

        hoverEdit: function(){

            $("[data-edit]").hover(
                function () {
                    $(this).append('<div class="section__edit"><i class="fa fa-pencil" style="line-height:30px;"></i></div>');
                    $(".section__edit").click(function (e) { e.preventDefault() })
                }, function () {
                    $(this).children(".section__edit").remove();
                }
            );

            var elementTemp = '';

            // Save Image
            $("#editImage").on('click', '.btn-save', function(e){
                var modal = $("#editImage");
                    modal.modal('hide');
                    elementTemp.children('img').attr("src", modal.find(".image").val());    
            });

            // Save Link
            $("#editLink").on('click', '.btn-save', function(e){
                var modal = $("#editLink");
                    modal.modal('hide');
                    elementTemp
                        .text( modal.find(".title").val())
                        .attr("href", modal.find(".url").val());
            });

            // Save Title
            $("#editTitle").on('click', '.btn-save', function(e){
                var modal = $("#editTitle");
                    modal.modal('hide');
                    elementTemp
                        .text( modal.find(".title").val());
            });

            // Save Text
            $("#editText").on('click', '.btn-save', function(e){
                var modal = $("#editText");
                    modal.modal('hide');
                    elementTemp
                        .text( modal.find(".text").val());
            });

            // Selected Icon
            $("#editIcon").on('click', 'i.fa', function(e){
                var modal = $("#editIcon");
                    modal.modal('hide');
                    elementTemp.children('i').attr('class', $(this).attr('class'));
            });

            $this.on('click', '.section__edit i', function(e){
                e.preventDefault();
                var el = $(this);
                var big_parent = el.parents('[data-edit]');
                    elementTemp = big_parent;

                //edit image
                if (big_parent.attr("data-edit") == 'image') {
                    var modal = $("#editImage");
                    modal.find(".image").val(big_parent.children('img').attr("src"));                            
                    modal.modal('show'); 
                }

                //edit Link
                if (big_parent.attr("data-edit") == 'link') {
                    var modal = $("#editLink");
                    modal.find(".title").val(big_parent.text()); 
                    modal.find(".url").val(big_parent.attr("href"));                            
                    modal.modal('show'); 
                }

                //edit title
                if (big_parent.attr("data-edit") == 'title') {
                    var modal = $("#editTitle");
                    modal.find(".title").val(big_parent.text());                    
                    modal.modal('show'); 
                }

                //edit text
                if (big_parent.attr("data-edit") == 'text') {
                    var modal = $("#editText");
                    modal.find(".text").val(big_parent.text());                    
                    modal.modal('show'); 
                }

                //edit icon
                if (big_parent.attr("data-edit") == 'icon') {
                    var modal = $("#editIcon");
                    var clss = big_parent.find('i').attr('class');
                    modal.find('.builder__icons i').removeClass('selected');
                    modal.find('.builder__icons i').each(function(){
                        if($(this).hasClass(clss)) {
                            $(this).addClass('selected');
                        }    
                    });                  
                    modal.modal('show'); 
                }
            });
        },

        download: function(){
            function downloadInnerHtml(filename, elId, mimeType) {
                var domain = window.location.protocol + "//" + window.location.host + "/";
                var header = '<!DOCTYPE html><html lang="en"> <head> <title>3Forcom</title> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no"> <link rel="shortcut icon" href="'+domain+'/assets/images/icons/favicon.ico"> <meta name="theme-color" content="#f05b28"> <link href="'+domain+'/assets/css/styles.css" rel="stylesheet"> </head> <body>';
                var footer = '<script src="https://code.jquery.com/jquery-2.0.2.min.js"></script> <script src="'+domain+'/assets/js/library.js"></script> </body></html>';
                var elHtml = header;
                    elHtml = elHtml + document.getElementById(elId).innerHTML;
                    elHtml = elHtml + footer;
                var link = document.createElement('a');
                mimeType = mimeType || 'text/plain';
            
                link.setAttribute('download', filename);
                link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
                link.click(); 
            }
            
            //Download
            
            $("#builderDownload").click(function(){
                var modal = $("#preloaded-download");                        
                    modal.modal('show'); 
            });

            $("#builderDownloadBtn").click(function(){
                var fileName = $("#preloaded-download").find('.downloadfilename').val();
                    $("#preloaded-export").html($("#builder-content").html());
                    $("#preloaded-export .section__delete").remove();
                    $("#preloaded-export .section__row").removeClass("ui-draggable");
                    $("#preloaded-export [data-edit]").removeAttr("data-edit");

                    downloadInnerHtml(fileName, 'preloaded-export','text/html');
            });
        },

        performDelete: function(){
            $(".section__delete").click(function () {
                $(this).parent().remove();
            });
        },

        dragDrop: function(){
            $("#builder-content").sortable({
                revert: true
            });        
        
            $(".section").draggable({
                connectToSortable: "#builder-content",
                //helper: "clone",
                revert: "invalid",
                handle: ".section--move"
            });
        },
        
		/**
		 * Processes the element data
		 */
		processData: function () {
			this.writeDebug('processData',arguments);
            var _this = this;
            var data;

            $.getJSON( this.settings.dataHTML, function( data ) {
                dataArray = data;
            })
            .done(function() {
                var dfd = $.Deferred();
                _this.renderCategory(dataArray)
                dfd.done(_this.addSecction());
            })
            .fail(function() {
                console.log( "error" );
            });
        },
        
        resize: function(){
            $('.resize-height').height(window.innerHeight);
        },

		/**
		 * console.log helper function
		 *
		 * http://www.briangrinstead.com/blog/console-log-helper-function
		 */
		writeDebug: function () {
			if (window.console && this.settings.debug) {
				// Only run on the first time through - reset this function to the appropriate console.log helper
				if (Function.prototype.bind) {
					this.writeDebug = Function.prototype.bind.call(console.log, console, 'Builder :');
				} else {
					this.writeDebug = function () {
						arguments[0] = 'Builder : ' + arguments[0];
						Function.prototype.apply.call(console.log, console, arguments);
					};
				}
				this.writeDebug.apply(this, arguments);
			}
		}

	});

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations and allowing any
	// public function (ie. a function whose name doesn't start
	// with an underscore) to be called via the jQuery plugin,
	// e.g. $(element).defaultPluginName('functionName', arg1, arg2)
	$.fn[ pluginName ] = function (options) {
		var args = arguments;
		// Is the first parameter an object (options), or was omitted, instantiate a new instance of the plugin
		if (options === undefined || typeof options === 'object') {
			return this.each(function () {
				// Only allow the plugin to be instantiated once, so we check that the element has no plugin instantiation yet
				if (!$.data(this, 'plugin_' + pluginName)) {
					// If it has no instance, create a new one, pass options to our plugin constructor, and store the plugin instance in the elements jQuery data object.
					$.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
				}
			});
			// Treat this as a call to a public method
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
			// Cache the method call to make it possible to return a value
			var returns;

			this.each(function () {
				var instance = $.data(this, 'plugin_' + pluginName);

				// Tests that there's already a plugin-instance and checks that the requested public method exists
				if (instance instanceof Plugin && typeof instance[options] === 'function') {

					// Call the method of our plugin instance, and pass it the supplied arguments.
					returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
				}

				// Allow instances to be destroyed via the 'destroy' method
				if (options === 'destroy') {
					$.data(this, 'plugin_' + pluginName, null);
				}
			});

			// If the earlier cached method gives a value back return the value, otherwise return this to preserve chainability.
			return returns !== undefined ? returns : this;
		}
	};


})(jQuery, window, document);
