function connectLt(addr) {
	script = document.createElement('script');
	script.type ='text/javascript';
	script.id = 'lt_ws';
	script.src = (function(addr) {
		if (addr.match(/^((http|https)(:\/\/)){0,1}((\w|\d|\.)+)(:(\d+)){0,1}\/.*\.js$/)) {
			return addr;
		}

		var port = addr.match(/^\d+$/);
		if (port) {
			return 'http://localhost:' + port + '/socket.io/lighttable/ws.js'
		}

		var hostAddr = addr.match(/^((http|https)(:\/\/)){0,1}((\w|\d|\.)+)(:(\d+)){0,1}\/{0,1}$/),
			protocol = hostAddr[2],
			host = hostAddr[4],
			port = hostAddr[7];

		return protocol + '://' + host + ':' + port + 'socket.io/lighttable/ws.js';
	})(addr + '');

	document.getElementsByTagName('head')[0].appendChild(script);
}