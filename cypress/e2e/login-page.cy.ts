
describe('Tests in Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  })
  it('should visit and show the login page', () => {
    cy.contains('Login/Company').should('be.visible');
    cy.findByText('Login/Company').should('be.visible')
  });

  it('should fill the login form', () => {
    cy.findByPlaceholderText('Insira seu e-mail ou telefone').should('be.visible').type('company@gmail.com')
    cy.findByPlaceholderText('Insira sua senha').should('be.visible').type('123123123');
  });

  describe('Submit the Login Form', () => {
    it('should submit the form with the correct data', () => {
      cy.findByPlaceholderText('Insira seu e-mail ou telefone').should('be.visible').type('company@gmail.com')
      cy.findByPlaceholderText('Insira sua senha').should('be.visible').type('123123123');
      cy.findByRole('button').should('be.visible').click()
      // cy.url().should('not.include', '/login');
      cy.location("pathname").should('eq', '/home')
    });

    it('should show an error message when the login is invalid', () => {
      cy.findByPlaceholderText('Insira seu e-mail ou telefone').should('be.visible').type('backofice@gmail.com')
      cy.findByPlaceholderText('Insira sua senha').should('be.visible').type('123123123');
      cy.get('button').contains('Login').click();
      cy.findByText('E-mail ou senha incorretos.').should('be.visible')
    });

    it('should show an error message when the password is invalid', () => {
      cy.findByPlaceholderText('Insira seu e-mail ou telefone').should('be.visible').type('company@gmail.com')
      cy.findByPlaceholderText('Insira sua senha').should('be.visible').type('54321');
      cy.get('button').contains('Login').click();
      cy.findByText('E-mail ou senha incorretos.').should('be.visible')
    });

    it('should show an error message when the login and password are invalid', () => {
      cy.findByPlaceholderText('Insira seu e-mail ou telefone').should('be.visible').type('backofice@gmail.com')
      cy.findByPlaceholderText('Insira sua senha').should('be.visible').type('54321');
      cy.get('button').contains('Login').click();
      cy.findByText('E-mail ou senha incorretos.').should('be.visible')
    });
  });

  describe('Redirect to other page', () => {
    it('should redirect to the register page', () => {
      cy.findByRole('link', {name:/Cadastrar/i} ).should('be.visible').click();
      cy.url().should('include', '/register');
    });

    it('should redirect to the forgot password page', () => {
      cy.findByRole('link', {name:/Recuperar senha/i} ).should('be.visible').click();
      cy.url().should('include', '/passwordrecover/sendemail');
    });
  });
});
