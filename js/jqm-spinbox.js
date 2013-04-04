/*
 * jQuery Mobile Framework : plugin to provide number spinbox.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notification.
 * https://github.com/jtsage/jquery-mobile-spinbox
 */

(function($) {
	$.widget( "mobile.spinbox", $.mobile.widget, {
		options: {
			// All widget options, including some internal runtime details
			dmin: false,
			dmax: false,
			dstep: false,
			ddec: 0,
			theme: false,
			initSelector: "input[data-role='spinbox']",
			clickEvent: 'vclick',
			type: 'horizontal', // or vertical
		},
		_create: function() {
			var w = this, 
				tmp,
				o = $.extend(this.options, this.element.jqmData('options')),
				d = {
					input: this.element,
					wrap: this.element.parent()
				};
				
			w.d = d;
			
			if ( w.d.input.jqmData('mini') === true ) {
				w.d.input.addClass('ui-mini');
			}
			
			w.d.wrap
				.removeClass('ui-input-text ui-shadow-inset ui-btn-shadow')
				.addClass('ui-controlgroup ui-controlgroup-'+o.type);
				
			if ( o.type === "horizontal" ) { 
				w.d.wrap.css({'display':'inline', 'whiteSpace':'nowrap', 'border':'none'}); 
				if ( w.d.input.jqmData('mini') === true ) {
					w.d.input.css({'width':'30px'});
				} else {
					w.d.input.css({'width':'40px'});
				}
			} else {
				w.d.input.css({'width':'auto'});
				w.d.wrap.css({'width':'auto','display':'inline-block'});
			}
			w.d.input.css({'textAlign':'center'});
			
			if ( o.theme === false ) {
				o.theme = $(this).closest('[data-theme]').attr('data-theme');
				if ( typeof o.theme === 'undefined' ) { o.theme = 'c'; }
			}
			
			
			if ( o.dmin === false ) { o.dmin = ( typeof w.d.input.attr('min') !== 'undefined' ) ? parseFloat(w.d.input.attr('min'))  : Number.MAX_VALUE * -1; }
			if ( o.dmax === false ) { o.dmax = ( typeof w.d.input.attr('max') !== 'undefined' ) ? parseFloat(w.d.input.attr('max'))  : Number.MAX_VALUE; }
			if ( o.dstep=== false ) { o.dstep= ( typeof w.d.input.attr('step')!== 'undefined' ) ? parseFloat(w.d.input.attr('step')) : 1; }
			
			//determine the number of decimal places in dstep.
			var tmp = new String(o.dstep);
			if (tmp.indexOf('.')>-1) {
				o.ddec = tmp.length-tmp.indexOf('.')-1;
			} else {
				o.ddec = 0;
			}
			
			w.d.up = $('<div>')
				.buttonMarkup({icon: 'plus', theme: o.theme, iconpos: 'notext', corners:true, shadow:true, inline:o.type==="horizontal"})
				.css({'marginLeft':'0px', 'marginBottom':'0px', 'marginTop':'0px', 'paddingLeft':o.type==="horizontal"});
				
			w.d.down = $('<div>')
				.buttonMarkup({icon: 'minus', theme: o.theme, iconpos: 'notext', corners:true, shadow:true, inline:o.type==="horizontal"})
				.css({'marginRight':'0px', 'marginBottom':'0px', 'marginTop':'0px', 'paddingRight':o.type==="horizontal"?'.4em':'0px'});
				
			if ( o.type === 'horizontal' ) {
				w.d.down.prependTo(w.d.wrap); w.d.up.appendTo(w.d.wrap);
			} else {
				w.d.up.prependTo(w.d.wrap); w.d.down.appendTo(w.d.wrap);
			}
				
			$.mobile.behaviors.addFirstLastClasses._addFirstLastClasses(w.d.wrap.find('.ui-btn'), w.d.wrap.find('.ui-btn'), true);
			
			w.d.up.on(o.clickEvent, function(e) {
				e.preventDefault();
				if ( !w.disabled ) {
					tmp = parseFloat(w.d.input.val()) + o.dstep;
					
					if ( tmp <= o.dmax ) { 
						w.d.input.val(tmp.toFixed(o.ddec));
						w.d.input.trigger('change');
					}
				}
			});
			
			w.d.down.on(o.clickEvent, function(e) {
				e.preventDefault();
				if ( !w.disabled ) {
					tmp = parseFloat(w.d.input.val()) - o.dstep;
					if ( tmp >= o.dmin ) { 
						w.d.input.val(tmp.toFixed(o.ddec));
						w.d.input.trigger('change');
					}
				}
			});
			
			if ( typeof $.event.special.mousewheel !== 'undefined' ) { // Mousewheel operation, if plugin is loaded
				w.d.input.on('mousewheel', function(e,d) {
					e.preventDefault();
					if ( !w.disabled ) {
						tmp = parseFloat(w.d.input.val(),10) + ((d<0)?-o.dstep:o.dstep);
						if ( tmp >= o.dmin && tmp <= o.dmax ) { 
							w.d.input.val(tmp); 
							w.d.input.trigger('change');
						}
					}
				});
			}
		},
		_update: function() {
			//update when needed
			//remove the buttons and recreate
			this.d.up.remove();
			this.d.down.remove();
			this._create();
		},
		refresh: function() {
			//external function to allow javascript refresh
			return this._update();
		},
		disable: function(){
			// Disable the element
			this.d.input.attr("disabled",true);
			this.d.input.addClass("ui-disabled").blur();
			this.disabled = true;
		},
		enable: function(){
			// Enable the element
			this.d.input.attr("disabled", false);
			this.d.input.removeClass("ui-disabled");
			this.disabled = false;
		}
	});
	  
	$( document ).bind( "pagecreate create", function( e ){
		$.mobile.spinbox.prototype.enhanceWithin( e.target, true );
	});
})( jQuery );
