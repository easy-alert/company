describe('Tests in Recover password', () => {
  beforeEach(() => {
    cy.visit('/passwordrecover/sendemail');
  });

  it('should display the company logo on the password recovery page', () => {
    cy.getByTestId('company-logo').should('be.visible');
  });

  describe('Send password recovery email', () => {
    it('should send recovery email successfully', () => {
      cy.getByTestId('email-input').should('be.visible').type('company@gmail.com');
      cy.getByTestId('toSend-button').should('be.visible').click();

      cy.url().should('include', '/login');
      cy.getByTestId('login-container').should('be.visible');
      cy.checkToastMessage('success-toast', 'E-mail de recuperação de senha enviado com sucesso.');
    });

    it('should show an error when the email does not exist in the database', () => {
      cy.getByTestId('email-input').should('be.visible').type('marcelli@easyalrt.com.br');
      cy.getByTestId('toSend-button').click();
      cy.checkToastMessage('error-toast', 'A informação: usuário não existe na base de dados.');
    });

    it('should show an error when submitting without filling the email field', () => {
      cy.getByTestId('toSend-button').should('be.visible').click();
      cy.getByTestId('email-error').should('contain.text', 'E-mail obrigatório.');
    });
  });

  it('should show an error message when the email is invalid', () => {
    cy.getByTestId('email-input').should('be.visible').type('marcelli@easyalert');
    cy.getByTestId('toSend-button').click();
    cy.getByTestId('email-error').should('contain.text', 'Informe um e-mail válido.');
  });

  describe('Redirect to other page', () => {
    it('should redirect to the login page', () => {
      cy.getByTestId('login-link').should('be.visible').click();
      cy.url().should('include', '/login');
      cy.getByTestId('login-container').should('be.visible');
    });
  });
});
