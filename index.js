var Emitter = require('emitter');
var classes = require('classes');
var transform = require('transform-property');

/**
 * Background Zoom Constructor
 * @param  {String} src       url of image, or null for no image
 * @param  {Element} container element
 * @return {BackgroundZoom}
 */

var BackgroundZoom = function(el, container){
  this.el = el;
  this.container = container;
  this._duration = 800;
}

module.exports = BackgroundZoom;

Emitter(BackgroundZoom.prototype);


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

  zoom();
  return this;
};

BackgroundZoom.prototype.hide = function(){
  this.setOriginalPosition();
  var self = this;
  classes(self.el).remove('in').add('out');
  setTimeout(function(){
    classes(self.el).remove('out');
    self.el.parentNode.removeChild(self.el);
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
  s.width = this._width || t.w + 'px';
  s.height = this._height || t.h + 'px';

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
 * Set end dimensions. Will default to target width and height
 * but you may want to use percentages instead.
 * @param  {String} w width e.g. 100%
 * @param  {String} h height
 * @return {BackgroundZoom}
 */

BackgroundZoom.prototype.setDimensions = function(w, h){
  this._width = w;
  this._height = h;
  return this;
};

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