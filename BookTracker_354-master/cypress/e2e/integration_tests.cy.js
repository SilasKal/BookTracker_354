const shelves = ['to_read', 'reading', 'read', 'favorites']
const url = 'https://zafirmk.github.io/BookTracker_354/'
const timeoutOnQuery = 2000

before(() => {
  cy.visit(url)
})

function getShelfName(shelf) {
  var name = '';
  shelf.split('_').forEach((word) => {
    if (name.length != 0)
      name += ' '
    name += word[0].toUpperCase()
    name += word.substring(1)
  })
  return name
}

shelves.forEach((shelf) => {
  var shelfName = getShelfName(shelf);
  describe(shelfName + ' Shelf', () => {
    it('Add Book', () => {
      cy.get('input#search_box_' + shelf).type('To Kill a Mockingbird')
      cy.get('button#search_' + shelf).click()
      cy.wait(timeoutOnQuery)
      cy.get('div#list-output-' + shelf + ' div.card').should('have.length', 1)
      cy.get('div#list-output-' + shelf).contains('To Kill a Mockingbird')
    })

    shelves.forEach((subShelf) => {
      var subShelfName = getShelfName(subShelf);
      it('Move Book to ' + subShelfName + ' Shelf', () => {
        cy.get('div#list-output-' + shelf + ' div.card').should('have.length', 1)
        cy.get('div#list-output-' + shelf + ' button').contains('Move To').click()
        cy.get('div#list-output-' + shelf + ' a').contains(new RegExp("^" + subShelfName + "$", "g")).click()
        cy.wait(100)
        if (subShelf != shelf)
          cy.get('div#list-output-' + shelf + ' div.card').should('have.length', 0)
        cy.get('div#list-output-' + subShelf + ' div.card').should('have.length', 1)
        cy.get('div#list-output-' + subShelf).contains('To Kill a Mockingbird')

      })

      it('Move Book from ' + subShelfName + ' Shelf', () => {
        cy.get('div#list-output-' + subShelf + ' div.card').should('have.length', 1)
        cy.get('div#list-output-' + subShelf + ' button').contains('Move To').click()
        cy.get('div#list-output-' + subShelf + ' a').contains(new RegExp("^" + shelfName + "$", "g")).click()
        cy.wait(100)
        if (subShelf != shelf)
          cy.get('div#list-output-' + subShelf + ' div.card').should('have.length', 0)
        cy.get('div#list-output-' + shelf + ' div.card').should('have.length', 1)
        cy.get('div#list-output-' + shelf).contains('To Kill a Mockingbird')
      })
    })

    it('I Read This Book', () => {
      cy.get('button#' + shelf + '_0_done_reading').click()
      if (shelf != 'read')
        cy.get('div#list-output-' + shelf + ' div.card').should('have.length', 0)
      cy.get('div#list-output-read div.card').should('have.length', 1)
      cy.get('div#list-output-read').contains('To Kill a Mockingbird')
    })

    it('Return After Marking Read', () => {
        cy.get('div#list-output-read button').contains('Move To').click()
        cy.get('div#list-output-read a').contains(new RegExp("^" + shelfName + "$", "g")).click()
        cy.wait(100)
        if (shelf != 'read')
          cy.get('div#list-output-shelf div.card').should('have.length', 0)
        cy.get('div#list-output-' + shelf + ' div.card').should('have.length', 1)
        cy.get('div#list-output-' + shelf).contains('To Kill a Mockingbird')
    })

    it('Delete Book', () => {
      cy.get('button#' + shelf + '_0').click()
      cy.get('div#list-output-' + shelf + ' div.card').should('have.length', 0)
    })

    it('Group Shelf Reorders By Genre', () => {
      cy.get('input#search_box_' + shelf).type('To Kill a Mockingbird')
      cy.get('button#search_' + shelf).click()
      cy.wait(timeoutOnQuery)

      cy.get('input#search_box_' + shelf).type('The Autobiography of Benjamin Franklin')
      cy.get('button#search_' + shelf).click()
      cy.wait(timeoutOnQuery)
      cy.get('div#list-output-' + shelf + ' div.card').should('have.length', 2)
      cy.get('div#list-output-' + shelf + ' div.card').first().contains('To Kill a Mockingbird')

      cy.get('button#group_shelf_' + shelf).click()
      cy.get('div#list-output-' + shelf + ' div.card').first().contains('The Autobiography of Benjamin Franklin')
      cy.get('button#' + shelf + '_0').click()
      cy.get('button#' + shelf + '_0').click()
      cy.get('div#list-output-' + shelf + ' div.card').should('have.length', 0)
    })
  })
})
describe('Recommendations', () => {
  it('Generate Recommendations', () => {
    cy.get('input#search_box_to_read').type('To Kill a Mockingbird')
    cy.get('button#search_to_read').click()
    cy.wait(timeoutOnQuery)

    cy.get('input#search_box_read').type('The Autobiography of Benjamin Franklin')
    cy.get('button#search_read').click()
    cy.wait(timeoutOnQuery)

    cy.get('button#generate_recommendations').click()
    cy.wait(timeoutOnQuery*2)
    cy.get('div#list-output-recommendations div.card').should('have.length.greaterThan', 0)

    cy.get('button#to_read_0').click()
    cy.get('button#read_0').click()
  })
})
describe('General', () => {
  it('Add Duplicate Books', () => {
    cy.get('input#search_box_to_read').type('To Kill a Mockingbird')
    cy.get('button#search_to_read').click()
    cy.wait(timeoutOnQuery)
    cy.get('input#search_box_to_read').type('To Kill a Mockingbird')
    cy.get('button#search_to_read').click()
    cy.wait(timeoutOnQuery)
    cy.get('div#list-output-to_read div.card').should('have.length', 1)
    cy.get('div#list-output-read div.card').should('have.length', 0)
    cy.get('div#list-output-to_read').contains('To Kill a Mockingbird')
  })
})