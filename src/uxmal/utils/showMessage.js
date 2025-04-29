

/**
 * Displays a message in the page
 * @param {Message} message 
 * @returns 
 */
export function showMessage(message) {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');
  messageContainer.innerHTML = `
  <div class="message">
    ${message.loading ? '<span class="loader"></span>' : ''}
    ${message.message}
  </div>
  `

  document.body.appendChild(messageContainer);

  return () => {
    document.body.removeChild(messageContainer);
  }
}

/**
 * @typedef {Object} Message
 * @property {string} message - The message to be displayed 
 * @property {boolean} loading - If the message is loading
 */