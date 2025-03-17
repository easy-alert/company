describe('Tests in Login Page', () => {
  it('should visit and show the login page', () => {
    // visit the page, and check if the page is showing the correct content
    cy.visit('/login');
  });

  it('should fill the login form', () => {
    // fill the login form and check filled values
  });

  describe('Submit the Login Form', () => {
    it('should submit the form with the correct data', () => {
      // submit the form and check if the user was redirected to the correct page
    });

    it('should show an error message when the login is invalid', () => {
      // submit the form with an invalid login and check if the error message is showing
    });

    it('should show an error message when the password is invalid', () => {
      // submit the form with an invalid password and check if the error message is showing
    });

    it('should show an error message when the login and password are invalid', () => {
      // submit the form with an invalid login and password and check if the error message is showing
    });
  });

  describe('Redirect to other page', () => {
    it('should redirect to the register page', () => {
      // click on the register button and check if the user was redirected to the correct page
    });

    it('should redirect to the forgot password page', () => {
      // click on the forgot password button and check if the user was redirected to the correct page
    });
  });
});
