export function loginViaAuth0Ui(username: string, password: string) {
    cy.visit('/');

    cy.wait(1000);
    cy.get('#login-button').should('be.visible').click();

    // Login on Auth0.
    cy.origin(`https://${Cypress.env('AUTH0_DOMAIN')}`, { args: { username, password } }, ({ username, password }) => {
        cy.get('input#username').type(username);
        cy.get('input#password').type(password, { log: false });
        cy.contains('button[value=default]', 'Continue').click();
    });

    cy.wait(1000);

    // Ensure Auth0 has redirected us back to the app.
    cy.url().should('equal', `${Cypress.config().baseUrl}/`);

}
