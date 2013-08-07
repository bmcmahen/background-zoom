var Emitter = require('emitter');
var classes = require('classes');
var transform = require('transform-property');

/**
 * Background Zoom Constructor
 * @param  {String} src       url of image, or null for no image
 * @param  {Element} container element
 * @return {BackgroundZoom}
 */

var BackgroundZoom = function(src, container){
	this.src = src;
	this.el = document.createElement('div');
	this.container = container;
	this._duration = 800;
}

module.exports = BackgroundZoom;

Emitter(BackgroundZoom.prototype);

BackgroundZoom.prototype.createElement = function(fn){
	var src = this.src;
	if (src) {
		this.image = document.createElement('img');
		var self = this;
		// todo: unbind.
		this.image.onload = function(){
			self.el.style['background-image'] = 'url("'+ src +'")';
			if (fn) fn();
		}
		this.image.src = src;
	}
};

BackgroundZoom.prototype.className = function(name){
	classes(this.el).add(name);
	return this;
};

/**
 * Zoom our image
 * @param  {Function} fn
 * @return {BackgroundZoom}
 */

BackgroundZoom.prototype.show = function(fn){
	var self = this;
	var zoom = function(){
		// this is silly, but safari seems to need it. safari is very needy.
		setTimeout(function(){
			self.setOriginalPosition();
			self.container.innerHTML = '';
			self.container.appendChild(self.el);
		}, 0);
		setTimeout(function(){
			self.setTargetPosition();
			self.emit('showing');
			classes(self.el).add('in');
		}, 0);
		if (fn) fn();
	};

	// Support zooming without a background image, perhaps using
	// just a colour.
	if (!this.src) {
		classes(self.el).add('no-image');
		zoom();
		return this;
	}

	// Preload the background image by creating an
	// image element, and setting our el background to
	// that image.
	if (!this.image) {
		this.createElement(function(){
			zoom();
		});
	} else {
		zoom();
	}

	return this;
};

BackgroundZoom.prototype.hide = function(){
	this.setOriginalPosition();
	var self = this;
	classes(self.el).remove('in').add('out');
	setTimeout(function(){
		self.el.parentNode.removeChild(self.el);
		classes(self.el).remove('out');
		self.emit('hidden');
	}, this._duration);
};

/**
 * Set our target position for animating.
 * @return {BackgroundZoom}
 */

BackgroundZoom.prototype.setTargetPosition = function(){
	var o = this._target;
	var s = this.el.style;
	// for safari. boo.
	setTimeout(function(){
		s[transform] = 'translate3d('+ o.x +'px, '+ o.y +'px, 0) scale(1)';
	}, 0);
	return this;
};

/**
 * Create a scaled down version of the target element in the
 * location of our origin element.
 * @return {BackgroundZoom}
 */

BackgroundZoom.prototype.setOriginalPosition = function(){
	var o = this._origin;
	var t = this._target;
	var s = this.el.style;

	s.width = t.w + 'px';
	s.height = t.h + 'px';

	var scale = o.w / t.w;
	var translateX = (o.x + (o.w / 2)) - (t.x + (t.w / 2));
	var translateY = (o.y + (o.h / 2)) - (t.y + (t.h / 2));
	var translate3d = 'translate3d('+ translateX +'px, '+ translateY +'px, 0)';
	var scale = ' scale('+ scale +')';

 	s[transform] = translate3d + scale;
 	return this;
}

/**
 * Set animation duration in ms
 * @param  {Number} duration ms
 * @return {BackgroundZoom}
 */

BackgroundZoom.prototype.duration = function(duration){
	this._duration = duration;
	return this;
}

/**
 * Set origin position
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} w
 * @param  {Number} h
 * @return {BackgroundZoom}
 */

BackgroundZoom.prototype.origin = function(x, y, w, h){
	this._origin = { x: x, y: y, w: w, h: h };
	return this;
}

/**
 * Set target position
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} w
 * @param  {Number} h
 * @return {BackgroundZoom}
 * Note -- You will get strange results if you don't use the same
 * ratio for origin and target positions, simply because we rely
 * exclusively on scale to emulate our smaller image.
 */

BackgroundZoom.prototype.target = function(x, y, w, h){
	this._target = { x: x, y: y, w: w, h: h};
	return this;
}