describe('Login', () => {
  const user = {
    email: 'user@test.com',
    password: '123456',
  };

  beforeEach(() => {
    cy.createUser(user.email, user.password);
    cy.visitHawk();
  });

  afterEach(() => {
    cy.deleteUser(user.email);
    cy.clearStorage();
  });

  it('should open signup page on signup click', () => {
    cy.contains('Sign up')
      .click();

    cy.location('pathname')
      .should('eq', '/sign-up');
  });

  it('should open recover password page on recover password click', () => {
    cy.contains('Recover password')
      .click();

    cy.location('pathname')
      .should('eq', '/recover');
  });

  it('should login successfully with correct credentials', () => {
    cy.login(user.email, user.password);

    cy.location('pathname')
      .should('eq', '/');
  });

  it('should show an error if email is invalid', () => {
    cy.login('some@email.com', user.password);

    cy.contains('Wrong email or password')
      .should('exist');
  });

  it('should show an error if password is invalid', () => {
    cy.login(user.email, 'somepassword');

    cy.contains('Wrong email or password')
      .should('exist');
  });

  it('should validate email is not empty', () => {
    cy.get('input#password')
      .type('somepass');

    cy.contains('Log in')
      .click();

    cy.get('input:invalid')
      .should('have.attr', 'id', 'email');
  });

  it('should validate email is actually email', () => {
    cy.login('notemail', 'somepass');

    cy.get('input:invalid')
      .should('have.attr', 'id', 'email');
  });

  it('should validate password is not empty', () => {
    cy.get('input#email')
      .type('some@email.com');

    cy.contains('Log in')
      .click();

    cy.get('input:invalid')
      .should('have.attr', 'id', 'password');
  });
});
