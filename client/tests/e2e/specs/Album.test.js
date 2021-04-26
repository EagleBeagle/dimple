describe('Album operations', () => {
  it("User gets alerted if album name is omitted during creation", () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('confirmedUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('confirmedUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()
      
    cy.contains('You').click()
    cy.contains('Albums').click()
    cy.contains('New').click()
    cy.contains('CREATE').click()
    cy.contains('An error has happened during album creation')
  })

  it("Successfully create an album in case of correct input", () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('confirmedUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('confirmedUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()
      
      cy.contains('You').click()
      cy.contains('Albums').click()
      cy.contains('New').click()
      cy.contains('Name').next().type('Test album')
      cy.contains('CREATE').click()
      cy.contains('Test album')
  })

  it("Get an error if trying to create an album with the same name", () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('confirmedUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('confirmedUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()
      
      cy.contains('You').click()
      cy.contains('Albums').click()
      cy.contains('New').click()
      cy.contains('Name').next().type('Test album')
      cy.contains('CREATE').click()
      cy.contains('An error has happened during album creation')
  })
  
  it("Navigate correctly to the newly created album's page after clicking on it", () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('confirmedUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('confirmedUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()
      
    cy.contains('You').click()
    cy.contains('Albums').click()
    cy.contains('Test album').click()
    cy.get('.font-weight-regular').contains('Test album')
  })

  it("Album gets removed from the page after successful deletion", () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('confirmedUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('confirmedUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()
      
      cy.contains('You').click()
      cy.contains('Albums').click()
      cy.get('.album').trigger('mouseenter').find('.mdi-delete-outline').click()
      cy.contains('CONFIRM').click()
      cy.get('.album').should('not.exist')
  })
})