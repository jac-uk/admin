/**
 * Download base64 file
 *
 * @param {string} contentType
 * @param {string} base64Data
 * @param {string} fileName
 */
const downloadBase64File = (contentType, base64Data, fileName) => {
  const linkSource = `data:${contentType};base64,${base64Data}`;
  const downloadLink = document.createElement('a');
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
};

export {
  downloadBase64File
};
