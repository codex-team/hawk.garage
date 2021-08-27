describe('Sign Up', () => {
  const user = {
    email: 'user@test.com',
  };

  beforeEach(() => {
    cy.visitHawk('sign-up');
  });

  afterEach(() => {
    cy.deleteUser(user.email);
    cy.clearStorage();
  });

  it('should open login page on click on login', () => {
    cy.contains('Login')
      .click();

    cy.location('pathname')
      .should('eq', '/login');
  });

  it('should open login page after signup', () => {
    cy.register(user.email);

    cy.location('pathname')
      .should('eq', '/login');

    cy.contains('The password is sent to your email')
      .should('exist');
  });

  it('should fill email on login page after signup', () => {
    cy.register(user.email);

    cy.location('pathname')
      .should('eq', '/login');

    cy.get('input#email')
      .should('have.value', user.email);
  });

  it('should be able to login after signup', () => {
    cy.intercept('POST', '/graphql').as('signup');
    cy.register(user.email);

    cy.wait('@signup')
      .then(interception => {
        const password = interception.response!.body.data.signUp;

        cy.login(undefined, password);

        cy.location('pathname')
          .should('eq', '/');
      });
  });

  it('should show error if email is already registered', () => {
    cy.createUser(user.email, '123456');

    cy.register(user.email);

    cy.contains('User with this email already registered')
      .should('exist');
  });

  it('should validate email field to not to be empty', () => {
    cy.contains('Register')
      .click();

    cy.get('input:invalid')
      .should('have.attr', 'id', 'email');
  });

  it('should validate email field to be email', () => {
    cy.register('notanemailstring');

    cy.get('input:invalid')
      .should('have.attr', 'id', 'email');
  });
});
