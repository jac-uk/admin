// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('login', () => {
  const url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + Cypress.env('apiKey');
  cy.request('POST', url, { 
    "email": Cypress.env('authEmail'), 
    "password": Cypress.env('authPassword'),
    "returnSecureToken": true
  }).then(({ body }) => {
    const claims = jwt.decode(body.id_token);
    const { kind, localId, email, displayName, idToken, registered, profilePicture, refreshToken, expiresIn } = claims;
    const item = {
      body: {
        ...body,
        decodedToken: {
          claims,
          user: { nickname,
            name,
            picture,
            updated_at,
            email,
            email_verified,
            sub,
          },
          audience,
          client_id,
        },
      },
      expiresAt: exp,
    }

    window.localStorage.setItem('auth0Cypress', JSON.stringify(item))
})

Cypress.Commands.add('logout', () => {
  const url = '';
  cy.request('POST', url);
})