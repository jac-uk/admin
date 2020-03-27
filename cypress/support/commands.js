Cypress.Commands.add('uploadFile', { prevSubject: true }, (subject, fileName, fileType = '') => {
  cy.fixture(fileName,'binary').then(content => {
    return Cypress.Blob.binaryStringToBlob(content, fileType).then(blob => {
      const el = subject[0];
      const testFile = new File([blob], fileName, {type: fileType});
      const dataTransfer = new DataTransfer();

      dataTransfer.items.add(testFile);
      el.files = dataTransfer.files;
      cy.wrap(subject).trigger('change', { force: true });
    });
  });
});
