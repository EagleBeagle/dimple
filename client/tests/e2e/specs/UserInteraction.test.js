describe('User interaction', () => {
  it('Successful search for a user and navigate to his/her page', () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('confirmedUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('confirmedUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()

    cy.get('.v-app-bar').find('.v-text-field').find('input').type('ano').wait(200).type('{enter}')
    cy.contains("anotherUser's Photos")
  })

  it("Successfully write a comment to another user's photo", () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('confirmedUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('confirmedUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()

    cy.get('.v-app-bar').find('.v-text-field').find('input').type('ano').wait(200).type('{enter}')
    cy.contains("anotherUser's Photos")
    cy.get('.image-div').click()
    cy.get('textarea').type('Nice pic').get('.mdi-send').click()
    cy.contains('Comment created successfully.')
    cy.contains('Nice pic')
  })

  it("Successfully delete comment", () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('confirmedUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('confirmedUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()

    cy.get('.v-app-bar').find('.v-text-field').find('input').type('ano').wait(200).type('{enter}')
    cy.contains("anotherUser's Photos")
    cy.get('.image-div').click()
    cy.contains('confirmedUser').trigger('mouseenter')
    cy.get('.mdi-delete').click()
    cy.contains('Comment deleted successfully.')
    cy.contains('Nice pic').should('not.exist')
  })

  it("Successfully favourite someone's photo", () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('confirmedUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('confirmedUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()

    cy.get('.v-app-bar').find('.v-text-field').find('input').type('ano').wait(200).type('{enter}')
    cy.contains("anotherUser's Photos")
    cy.get('.image-div').click()
    cy.get('.mdi-star-outline').click()
    cy.get('.mdi-star')
  })

  it("Successfully unfavourite someone's photo", () => {
    cy.visit('/')
    cy.get('.v-input').contains('Email').siblings().type('confirmedUser@gmail.com')
      .parentsUntil('.v-form').next().contains('Password').siblings().type('confirmedUserPassword')
      .parentsUntil('.row').find('button').contains('Sign In').click()

    cy.get('.v-app-bar').find('.v-text-field').find('input').type('ano').wait(200).type('{enter}')
    cy.contains("anotherUser's Photos")
    cy.get('.image-div').click()
    cy.get('.mdi-star').click()
    cy.get('.mdi-star-outline')
  })
})
