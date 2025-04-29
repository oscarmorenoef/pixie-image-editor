import { envApiUrl } from './utils/envApiUrl';
import { showMessage } from './utils/showMessage';
import { requestComments } from './utils/requestComments';
import { showToast } from './utils/showToast';

async function loadImage() {
  const removeLoadingMessage = showMessage({ message: 'Loading image...', loading: true });
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const imageId = params.get('id');

  try {
    if(!imageId) throw new Error('Image ID not found in URL');
    
    const image = await fetch(`${envApiUrl()}/${imageId}`);
    const blob = await image.blob();
    const imageUrl = URL.createObjectURL(blob);

    new Pixie({
      selector: "#editor-container",
      baseUrl: 'assets',
      image: imageUrl,
      onSave: saveImage,
      onLoad: removeLoadingMessage,
    });
  }catch(e){
    console.log(e)
    removeLoadingMessage()
    showMessage({ message: 'Image not found' });
  }
}

async function saveImage(imageInBase64) {
  const comments = await requestComments();
  if(!comments) return;

  const removeLoadingMessage = showMessage({ message: 'Saving image...', loading: true });
  
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const imageId = params.get('id');

  await wait(1000)

  try {
    await fetch(`${envApiUrl()}/${imageId}`, {
      method: 'PUT',
      body: JSON.stringify({
        imageInBase64,
        comments: comments.comments
      }),
    });

    removeLoadingMessage();
    showToast('Image saved successfully');
  } catch (e) {
    removeLoadingMessage();
    showToast('Failed to save image');
  }
}

loadImage()

function wait(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  })
}