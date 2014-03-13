window.onLoad = function() {
	window.onResize = resize;
	resize();
};

function resize()
{
	var body = document.getElementsByTagName('body')[0];
	body.height = window.height;
}