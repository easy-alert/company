
describe.only('Tests in Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  })
  it('should visit and show the login page', () => {
    cy.contains('Login/Company').should('be.visible');
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
      cy.url().should('not.include', '/login');
    });

    it('should show an error message when the login is invalid', () => {
      cy.findByPlaceholderText('Insira seu e-mail ou telefone').should('be.visible').type('company@gmail.com')
      cy.get('button').contains('Login').click();
      cy.contains('Login inválido').should('be.visible');
    });

    it('should show an error message when the password is invalid', () => {
      cy.findByPlaceholderText('Insira sua senha').should('be.visible').type('123123123');
      cy.get('button').contains('Login').click();
      cy.contains('Senha incorreta').should('be.visible');
    });

    it('should show an error message when the login and password are invalid', () => {
      cy.findByPlaceholderText('Insira seu e-mail ou telefone').should('be.visible').type('company@gmail.com')
      cy.findByPlaceholderText('Insira sua senha').should('be.visible').type('123123123');
      cy.get('button').contains('Login').click();
      cy.contains('Credenciais inválidas').should('be.visible');
    });
  });

  describe('Redirect to other page', () => {
    it('should redirect to the register page', () => {
      cy.get('button').contains('Cadastrar').click();
      cy.url().should('include', '/register');
    });

    it('should redirect to the forgot password page', () => {
      cy.contains('Recuperar senha').click();
      cy.url().should('include', '/passwordrecover/sendemail');
    });
  });
});
