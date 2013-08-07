
# background-zoom

  Zoom a background-image or empty element from an origin position/size, to a target position/size. I'm using it to create an iOS style launch animation.

## Installation

  Install with [component(1)](http://component.io):

    $ component install bmcmahen/background-zoom

## Example

```javascript
var BackgroundZoom = require('background-zoom');
var container = document.getElementById('container');
var zoom = new BackgroundZoom(null, container)
	.duration(400)
	.className('background')
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

## Todo

The constructor should accept an element (with content) that could be zoomed.


## License

  MIT
