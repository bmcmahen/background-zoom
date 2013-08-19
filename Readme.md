
# zoom

  Zoom a DOM element from an origin position/size, to a target position/size. It's useful for zooming thumbnails, creating iOS style launch animations, etc.

## Installation

  Install with [component(1)](http://component.io):

    $ component install bmcmahen/background-zoom

## Example

```javascript
var Zoom = require('zoom');
var container = document.getElementById('container');

// create our zoomed element
var el = document.createElement('div');
el.classList.add('bacon-zoom');
el.innerHTML = '<h1> bacon </h1>';

var zoom = new Zoom(el, container)
	.duration(400)
	.target(0, 0, 1200, 600)
	.origin(400, 500, 100, 50);

var bdy = document.getElementsByTagName('body')[0];
var showing = false;
bdy.addEventListener('click', function(){
	if (showing) {
		showing = false;
		zoom.hide();
	} else {
		zoom.show();
		showing = true;
	}
})
```

```css
body {
			position: relative;
		}

div.bacon-zoom {
	position: absolute;
	-webkit-transition: all 0.4s linear;
	-moz-transition: all 0.4s linear;
	background-image: url('image2.jpg');
	background-size: cover;
}

div.background.in {
	-webkit-animation: opacity-anim 0.4s ease-out;
}

div.background.out {
	-webkit-animation: opacity-anim-out 0.4s ease-out;
}

@-webkit-keyframes opacity-anim {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@-webkit-keyframes opacity-anim-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}
```

## Caveat

- Currently the origin and target point need to have the same width/height ratio, otherwise the origin point is messed up. This will be fixed eventually.
- Browser support is pretty limited.

## License

  MIT
