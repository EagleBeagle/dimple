describe('Photo operations', () => {
  it('Photo appears on user page after successful upload', () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('confirmedUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('confirmedUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()
      
    cy.get('.v-toolbar__items').contains('You').click()
    cy.get('input[type="file"]')
    cy.fixture('test_image.jpg').then(() => {
      cy.get('input[type="file"]').attachFile('test_image.jpg')
      cy.get('.v-card').find('span').contains('UPLOAD').click().wait(5000)
      cy.get('.image-div')
    })
  })

  it("Navigate correctly to the newly upload photo's page after clicking on it", () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('confirmedUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('confirmedUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()
      
    cy.get('.v-toolbar__items').contains('You').click()
    cy.get('.image-div').click()
    cy.get('.v-image')
  })

  it('Photo gets moved to trash after succesful deletion', () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('confirmedUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('confirmedUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()
      
    cy.get('.v-toolbar__items').contains('You').click()
    cy.get('.image-div').trigger('mouseenter').find('.delete').click()
    cy.get('.image-div').should('not.exist')
    cy.contains('Trash').click()
    cy.get('.image-div')
  })
  
  it('Photo disappears from trash and user gets alerted in case of successful permanent deletion', () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('confirmedUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('confirmedUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()
      
    cy.get('.v-toolbar__items').contains('You').click()
    cy.contains('Trash').click()
    cy.get('.image-div').trigger('mouseenter').find('.delete').click()
    cy.contains('CONFIRM').click()
    cy.get('.image-div').should('not.exist')
  })
})