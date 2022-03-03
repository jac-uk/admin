export {
  read,
  write,
  empty,
  hasContent,
  data,
};

const data = {};

async function read() {
  if (navigator && navigator.clipboard && navigator.clipboard.readText && document.hasFocus()) {
    const clipboardText = await navigator.clipboard.readText();
    if (clipboardText) {
      if (clipboardText.indexOf('JAC_CONTENT') === 0) {
        console.log('JAC content found', clipboardText);
        data.type = 'exercise';
        data.title = 'JAC0007 James Bond Replacement';
        data.content = clipboardText;
      } else {
        data.type = '';
        data.title = '';
        data.content = ''
      }
    } else {
      this.clipboardText = '';
    }
  }
}

function write() {

}

function empty() {

}

function hasContent() {

}
