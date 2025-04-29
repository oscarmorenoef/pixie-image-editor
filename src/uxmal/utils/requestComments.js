

/**
 * Request comments from the user
 * @returns {Promise<string|undefined>} - The comments entered by the user
 */
export function requestComments() {
  
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('dialog-container');
  messageContainer.innerHTML = `
  <div role="dialog" >
    <label for="comments">Comments</label>
    <textarea id="comments" name="comments"></textarea>
    <div class="dialog-buttons">
      <button id="cancel-button" class="bg-primary">Cancel</button>
      <button id="save-button">Save</button>
    </div>
  </div>
  `

  document.body.appendChild(messageContainer);
  const saveButton = messageContainer.querySelector('#save-button');
  const cancelButton = messageContainer.querySelector('#cancel-button');

  return new Promise(resolve => {
    saveButton.addEventListener('click', () => {
      const comments = messageContainer.querySelector('#comments').value;
      resolve({ comments });
      messageContainer.remove();
    })

    cancelButton.addEventListener('click', () => {
      resolve(null);
      messageContainer.remove();
    })
  })
}