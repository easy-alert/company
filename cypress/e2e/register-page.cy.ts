describe('Tests in Register Page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });
  it('must visit and show login registration', () => {
    cy.getByTestId('company-logo').should('be.visible');
  });

  it('must show the logo', () => {
    cy.getByTestId('image-input').selectFile('cypress/fixtures/image-test.png', { force: true });
  });

  it('should show an error when the image exceeds the size limit', () => {
    cy.getByTestId('image-input').selectFile('cypress/fixtures/image-test2.jpg', { force: true });
    cy.getByTestId('register-button').should('be.visible').click();
    cy.getByTestId('image-error').should('contain.text', 'O tamanho da imagem excedeu o limite.');
  });

  it('should show an error when uploading an invalid file format', () => {
    cy.getByTestId('image-input').selectFile('cypress/fixtures/video-test.mp4', { force: true });
    cy.getByTestId('register-button').should('be.visible').click();
    cy.getByTestId('image-error').should('contain.text', 'Formato inválido.');
  });

  describe('Submit the account registration form', () => {
    it('should submit the form with the correct data', () => {
      cy.getByTestId('name-input').should('be.visible').type('Mateus Fernandes');
      cy.getByTestId('email-input').should('be.visible').type('mateusfernandes@gmail.com');
      cy.getByTestId('companyName-input').should('be.visible').type('Easy Alert');
      cy.getByTestId('contactNumber-input').should('be.visible').type('(48) 99999-9999');
      cy.getByTestId('CNPJorCPF-input').should('be.visible').type('01234567891');
      cy.getByTestId('password-input').should('be.visible').type('12345678');
      cy.getByTestId('confirmPassword-input').should('be.visible').type('12345678');
      cy.getByTestId('register-button').should('be.visible').click();
      cy.location('pathname').should('eq', '/home');
      cy.getByTestId('page-home').should('be.visible');
    });

    it('should show error messages when the form is submitted empty', () => {
      cy.getByTestId('register-button').should('be.visible').click();
      cy.getByTestId('name-error').should('contain.text', 'O nome deve ser preenchido.');
      cy.getByTestId('email-error').should('contain.text', 'O e-mail deve ser preenchido.');
      cy.getByTestId('companyName-error').should(
        'contain.text',
        'O nome da empresa deve ser preenchido.',
      );
      cy.getByTestId('contactNumber-error').should(
        'contain.text',
        'O número de telefone deve ser preenchido.',
      );
      cy.getByTestId('CNPJorCPF-error').should(
        'contain.text',
        'Um CNPJ ou um CPF deve ser informado.',
      );
      cy.getByTestId('password-error').should('contain.text', 'Informe a senha.');
      cy.getByTestId('confirmPassword-error').should('contain.text', 'Informe a senha.');
    });

    it('should show an error when the name has less than 3 characters', () => {
      cy.getByTestId('name-input').should('be.visible').type('Jo');
      cy.getByTestId('register-button').should('be.visible').click();
      cy.getByTestId('name-error').should(
        'contain.text',
        'O nome deve conter 3 ou mais caracteres.',
      );
    });

    it('should show an error when the email is invalid', () => {
      cy.getByTestId('email-input').should('be.visible').type('test@gmail');
      cy.getByTestId('register-button').should('be.visible').click();
      cy.getByTestId('email-error').should('contain.text', 'Informe um e-mail válido.');
    });

    it('should show an error when company name is too short', () => {
      cy.getByTestId('companyName-input').should('be.visible').type('Mi');
      cy.getByTestId('register-button').should('be.visible').click();
      cy.getByTestId('companyName-error').should(
        'contain.text',
        'O nome da empresa deve conter 3 ou mais caracteres.',
      );
    });

    it('should show error when phone is incomplete', () => {
      cy.getByTestId('contactNumber-input').should('be.visible').type('(48) 99999-99');
      cy.getByTestId('register-button').should('be.visible').click();
      cy.getByTestId('contactNumber-error').should(
        'contain.text',
        'O número de telefone deve conter no mínimo 14 caracteres.',
      );
    });

    it('should show error when CNPJ or CPF is incomplete', () => {
      cy.getByTestId('CNPJorCPF-input').should('be.visible').type('123456');
      cy.getByTestId('register-button').should('be.visible').click();
      cy.getByTestId('CNPJorCPF-error').should('contain.text', 'Informe um CNPJ ou um CPF válido.');
    });

    it('You must check if the password view icon is working', () => {
      cy.getByTestId('password-input').should('be.visible').type('12345678');
      cy.getByTestId('confirmPassword-input').should('be.visible').type('12345678');
      cy.getByTestId('view-password').click({ multiple: true });
      cy.getByTestId('password-input')
        .should('have.attr', 'type', 'text')
        .and('have.value', '12345678');
      cy.getByTestId('view-password').click({ multiple: true });
      cy.getByTestId('password-input').should('have.attr', 'type', 'password');
    });

    it('password must be 8 characters or more', () => {
      cy.getByTestId('password-input').should('be.visible').type('12345678');
      cy.getByTestId('confirmPassword-input').should('be.visible').type('87654');
      cy.getByTestId('register-button').should('be.visible').click();
      cy.getByTestId('confirmPassword-error').should(
        'contain.text',
        'Sua senha deve possuir 8 ou mais caracteres.',
      );
    });

    it('check when passwords do not match', () => {
      cy.getByTestId('password-input').should('be.visible').type('12345678');
      cy.getByTestId('confirmPassword-input').should('be.visible').type('87654321');
      cy.getByTestId('register-button').should('be.visible').click();
      cy.getByTestId('confirmPassword-error').should('contain.text', 'As senhas não coincidem.');
    });
  });

  describe('redirect to other page', () => {
    it('should redirect to the terms of use. page', () => {
      cy.getByTestId('terms-of-use').should('be.visible').click();
      cy.visit('/terms');
      cy.location('pathname').should('eq', '/terms');
    });
  });

  describe('redirect to other page', () => {
    it('should redirect to the login page', () => {
      cy.getByTestId('login-link').should('be.visible').click();
      cy.url().should('include', '/login');
      cy.getByTestId('login-container').should('be.visible');
    });
  });
});
