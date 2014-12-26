(function () {
  function connectLt() {
    script = document.createElement('script');
    script.type ='text/javascript';
    script.id = 'lt_ws';
    script.src = 'http://192.168.33.22:4355/socket.io/lighttable/ws.js';

    document.getElementsByTagName('head')[0].appendChild(script);
  }

  connectLt();
})();
