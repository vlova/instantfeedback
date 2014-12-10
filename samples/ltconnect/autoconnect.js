(function () {
    function connectLt() {
    script = document.createElement('script');
    script.type ='text/javascript';
    script.id = 'lt_ws';
    script.src = 'http://localhost:29036/socket.io/lighttable/ws.js';

    document.getElementsByTagName('head')[0].appendChild(script);
  }

  connectLt();
})();
