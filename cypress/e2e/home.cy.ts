import {CreateSnippet} from "../../src/utils/snippet";

describe('Home', () => {
  before(() => {
    // Ensure Cypress environment variables are set
    process.env.FRONTEND_URL = Cypress.env('FRONTEND_URL');
    process.env.BACKEND_URL = Cypress.env('BACKEND_URL');
  });

  beforeEach(() => {
    cy.loginToAuth0(
        Cypress.env('AUTH0_USERNAME'),
        Cypress.env('AUTH0_PASSWORD'),
    );
  });

  it('Renders home', () => {
    cy.visit(Cypress.env('FRONTEND_URL'));
    cy.get('.MuiTypography-h6').should('have.text', 'Printscript');
    cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').should('be.visible');
    cy.get('.css-9jay18 > .MuiButton-root').should('be.visible');
    cy.get('.css-jie5ja').click();
  });

  // You need to have at least 1 snippet in your DB for this test to pass
  it('Renders the first snippets', () => {
    cy.visit(Cypress.env('FRONTEND_URL'));
    const first10Snippets = cy.get('[data-testid="snippet-row"]');

    first10Snippets.should('have.length.greaterThan', 0);
    first10Snippets.should('have.length.lessThan', 10);
  });

  it('Can create snippet and find snippets by name', () => {
    cy.visit(Cypress.env('FRONTEND_URL'));
    const snippetData: CreateSnippet = {
      name: "Test name",
      content: "print(1)",
      language: "printscript",
      extension: ".ps"
    };

    cy.intercept(
        'GET',
        Cypress.env('BACKEND_URL') + '/snippet/byWriter?page=0',
        (req) => {
          req.reply((res) => {
            expect(res.statusCode).to.eq(200);
          });
        }
    ).as('getSnippets');

    cy.window().then((win) => {
        const token = win.localStorage.getItem('accessToken');
    cy.request({
      method: 'POST',
      url: `${Cypress.env('BACKEND_URL')}/snippet`, // Adjust if you have a different base URL configured in Cypress
      body: snippetData,
      failOnStatusCode: false, // Optional: set to true if you want the test to fail on non-2xx status codes
      headers: {
        'Authorization': 'Bearer ' + token
      },
    }).then((response) => {
      expect(response.status).to.eq(201 );

      expect(response.body.name).to.eq(snippetData.name)
      expect(response.body.language).to.eq(snippetData.language)
      expect(response.body).to.haveOwnProperty("id")

      cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').clear();
      cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').type(snippetData.name + "{enter}");

      cy.wait("@getSnippets")
      cy.contains(snippetData.name).should('exist');
    })
  })
})
})