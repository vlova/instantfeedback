(function () {
  var state = {
    counter: 1,
    anotherData: 23
  };

  /**
   * appends formatted message to the log
   * @param {string} message a
   */
  function appendMessage(message) {
    var logElement = document.getElementById("log");

    var idEl = document.createElement("span");
    idEl.innerHTML = state.counter;
    idEl.classList.add('message-id');

    var sepEl = document.createElement("span");
    sepEl.innerHTML = ":- ";
    sepEl.classList.add('message-sep');

    var messageEl = document.createElement('span');
    messageEl.innerHTML = message;
    messageEl.classList.add('message-text');

    var paragraph = document.createElement('p');
    paragraph.appendChild(idEl);
    paragraph.appendChild(sepEl);
    paragraph.appendChild(messageEl);

    logElement.appendChild(paragraph);

    console.log(message);
    state.counter++;
  }

  // handles submit button click
  function handleSubmit() {
    message = document.getElementById("user-message").value;
    appendMessage(message);
  }

  // resets list of messages and resets message counter to zero
  function clearMessages() {
    state.counter = 0;
    document.getElementById("log").innerHTML = "";
  }

  document
    .getElementById('submit-message')
    .bind('click', handleSubmit);

  document
    .getElementById('clear-log')
    .bind('click', clearMessages);

  appendMessage("привет всем");
})();
