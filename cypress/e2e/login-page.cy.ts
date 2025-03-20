describe('Tests in Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should visit and show the login page', () => {
    cy.getByTestId('login-title').should('be.visible').and('have.text', 'Login/Company');
  });

  it('should fill the login form', () => {
    const email = 'company@gmail.com';
    const senha = '123123123';

    cy.getByTestId('login-input').should('be.visible').type(email).should('have.value', email);
    cy.getByTestId('password-input').should('be.visible').type(senha).should('have.value', senha);
  });

  describe('Submit the Login Form', () => {
    it('should submit the form with the correct data', () => {
      cy.getByTestId('login-input').should('be.visible').type('company@gmail.com');
      cy.getByTestId('password-input').should('be.visible').type('123123123');
      cy.getByTestId('login-button').should('be.visible').click();
      cy.location('pathname').should('eq', '/home');
      cy.findByText(/Bem vindo\(a\), .+!/).should('be.visible');
    });

    it('should show an error message when the login is invalid', () => {
      cy.getByTestId('password-input').should('be.visible').type('123123123');
      cy.getByTestId('login-button').click();
      cy.findByText('E-mail ou telefone obrigatório.').should('be.visible');
    });

    it('should show an error message when the password is invalid', () => {
      cy.getByTestId('login-input').should('be.visible').type('company@gmail.com');
      cy.get('button').contains('Login').click();
      cy.findByText('Informe a senha.').should('be.visible');
    });

    it.only('should show an error message when the login is invalid', () => {
      cy.getByTestId('login-input').should('be.visible').type('backofice@gmail.com');
      cy.getByTestId('password-input').should('be.visible').type('54321');
      cy.getByTestId('login-button').click();
      cy.checkToastMessage('error-toast', 'E-mail ou senha incorretos.');
    });
  });

  describe('Redirect to other page', () => {
    it('should redirect to the register page', () => {
      cy.getByTestId('register-link').should('be.visible').click();
      cy.url().should('include', '/register');
      cy.findByPlaceholderText('Ex: João Silva').should('be.visible');
    });

    it('should redirect to the forgot password page', () => {
      cy.getByTestId('recover-password').should('be.visible').click();
      cy.url().should('include', '/passwordrecover/sendemail');
      cy.findByRole('heading', { name: /Recuperar senha/i }).should('be.visible');
    });
  });
});
