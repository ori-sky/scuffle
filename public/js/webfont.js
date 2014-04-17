WebFontConfig = {
	google: {
		families: [
			'Iceland::latin',
			'VT323::latin'
		]
	}
};

(function() {
	var wf = document.createElement('script')
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http')
		+ '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js'
	wf.type = 'application/javascript'
	wf.async = false
	var s = document.getElementsByTagName('script')[0]
	s.parentNode.insertBefore(wf, s)
})()
