describe('Sign up', () => {
  it('Successful user sign up authenticates the user and redirects to Explore page', () => {
    cy.visit('/')
    cy.get('button').contains('Sign Up').click()
    cy.get('.v-input').contains('Username').siblings().type('e2eTestUser')
      .parentsUntil('.v-form').next().contains('Email').siblings().type('e2eTestUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('e2eTestUserPassword')
      .parentsUntil('.row').find('button').contains('Sign Up').click()
    
    cy.contains('.text-h2', 'Explore')
  })

  it("Alert the user if trying to sign up with credentials already in use", () => {
    cy.visit('/')
    cy.get('button').contains('Sign Up').click()
    cy.get('.v-input').contains('Username').siblings().type('e2eTestUser')
      .parentsUntil('.v-form').next().contains('Email').siblings().type('e2eTestUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('e2eTestUserPassword')
      .parentsUntil('.row').find('button').contains('Sign Up').click()

    cy.contains('.v-snack__wrapper', 'Username already in use.')
  })

  it("Alert the user in case of missing username", () => {
    cy.visit('/')
    cy.get('button').contains('Sign Up').click()
    cy.get('.v-input').contains('Username').siblings()
      .parentsUntil('.v-form').next().contains('Email').siblings().type('e2eTestUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('e2eTestUserPassword')
      .parentsUntil('.row').find('button').contains('Sign Up').click()
    
    cy.contains('.v-text-field__details', "Username can't stay empty.")
  })

  it("Alert the user in case of missing email", () => {
    cy.visit('/')
    cy.get('button').contains('Sign Up').click()
    cy.get('.v-input').contains('Username').siblings().type('e2eTestUser')
      .parentsUntil('.v-form').next().next().contains('Password').siblings().type('e2eTestUserPassword')
      .parentsUntil('.row').find('button').contains('Sign Up').click()
    
    cy.contains('.v-text-field__details', "Email can't stay empty.")
  })

  it("Alert the user in case of missing password", () => {
    cy.visit('/')
    cy.get('button').contains('Sign Up').click()
    cy.get('.v-input').contains('Username').siblings().type('e2eTestUser')
      .parentsUntil('.v-form').next().contains('Email').siblings().type('e2eTestUser@gmail.com')
      .parentsUntil('.row').find('button').contains('Sign Up').click()
    
    cy.contains('.v-text-field__details', "Password can't stay empty.")
  })
})

describe('Sign in', () => {
  it('Successfully signing in authenticates the user and redirects to Explore page', () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('e2eTestUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('e2eTestUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()
    
    cy.contains('.text-h2', 'Explore')
  })
  
  it('Alert user in case of invalid input', () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('e2eTestUser@gmail')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('e2eTestUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()
      
    cy.contains('.v-snack__wrapper', 'An error has happened signing in')
  })

  it('Alert user in case of no user exists with the given credentials', () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('anotherUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('e2eTestUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()
      
    cy.contains('.v-snack__wrapper', 'No account exists with the given credentials')
  })
})