// import defineConfig from '../../cypress.config';

// const baseUrl = defineConfig?.e2e?.baseUrl || 'http://localhost:4200';
const baseUrl = 'http://localhost:4200';

describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit(baseUrl)
    // cy.get('a').contains('Add New Tool Rental').click()
  })

  it('navigate to add new tool rental page ', () => {
    cy.visit(baseUrl)
    cy.get('a').contains('Add New Tool Rental').click()
  })

  /*
  it('navigate to add new tool rental page ', () => {
    cy.visit(baseUrl)
    cy.get('a[[routerLink]="\'/new\'"]').click()  // syntax error
  })
  */

  /*
  it('navigate to add new tool rental page ', () => {
    cy.visit(baseUrl)
    cy.visit(`${baseUrl}/new`)
  })
  */
})

describe('Add new tool rental page', () => {
  beforeEach(() => {
    cy.intercept('assets/charges.json').as('Charges');
    cy.intercept('assets/tools.json').as('Tools');
    cy.visit(`${baseUrl}/new`);
    cy.wait(['@Charges', '@Tools']);
  });

  //=========== Test #1 ===========
  // {"type":"jackhammer", "dailyCharge":2.99, "weekdayCharge": true, "weekendCharge": false, "holidayCharge": false}
  // 9/3/15 9/4 week day   2
  // 9/5 9/6 weekend
  // 9/7 Labor day
  // 9/8 weekday  1
  // 3 days 
  it('form test 1: validate discountPercent', () => {
    cy.get('#tool').click();
    cy.contains('JAKR').click();
    cy.get('#checkoutDate').type('9/3/15', {force: true});
    cy.get('#returnDate').type('9/8/15', {force: true});
    cy.get('#discountPercent').type('101', {force: true});
    cy.get('form').submit();
    cy.contains('Must be a integer in range of 0-99').should('exist');
  })

  //=========== Test #2 ===========
  // {"type":"ladder", "dailyCharge":1.99, "weekdayCharge": true, "weekendCharge": true, "holidayCharge": false},
  // 7/2/20 Th  1
  // 7/3/20 Fr  0
  // 7/4/20 Sat 1
  // 2 days = 3.98 - 0.398 = 3.58
  it('form test 2: validate july 4th holiday', () => {
    cy.get('#tool').click();
    cy.contains('LADW').click();
    cy.get('#checkoutDate').type('7/2/20', {force: true});
    cy.get('#returnDate').type('7/4/20', {force: true});
    cy.get('#discountPercent').type('10', {force: true});
    cy.get('form').submit();
    cy.contains('p', 'Final Amount:').contains('$3.58').should('exist');
  })

  //=========== Test #3 ===========
  //{"type":"chainsaw", "dailyCharge":1.49, "weekdayCharge": true, "weekendCharge": false, "holidayCharge": false},
  // 7/2/15 Th  1
  // 7/3/15 Fr  0
  // 7/4/15 Sat 0
  // 7/5 Sun    0
  // 7/6, 7 Mon-Tue    2
  // 3 days = 4.47 with 25% discount = 3.35
  it('form test 3: Validate July 4th holiday', () => {
    cy.get('#tool').click();
    cy.contains('CHNS').click();
    cy.get('#checkoutDate').type('7/2/15', {force: true});
    cy.get('#returnDate').type('7/7/15', {force: true});
    cy.get('#discountPercent').type('25', {force: true});
    cy.get('form').submit();
    cy.contains('p', 'Final Amount:').contains('$3.35').should('exist');
  })

  //=========== Test #4 ===========
  // {"type":"jackhammer", "dailyCharge":2.99, "weekdayCharge": true, "weekendCharge": false, "holidayCharge": false}
  // 9/3/15 Thu 9/4 Fri week day   2
  // 9/5 9/6 weekend 0
  // 9/7 Labor day 0
  // 9/8 9/9 weekday  2
  // 4 charge days with no discount = 4 x 2.99 = 11.96
  // FAILED - 3 chargeable days?
  it('form test 4: Validate labor day', () => {
    cy.get('#tool').click();
    cy.contains('JAKD').click();
    cy.get('#checkoutDate').type('9/3/15', {force: true});
    cy.get('#returnDate').type('9/9/15', {force: true});
    cy.get('#discountPercent').type('0', {force: true});
    cy.get('form').submit();
    cy.contains('p', 'Final Amount:').contains('$11.96').should('exist');
  })

  //=========== Test #5 ===========
  // {"type":"jackhammer", "dailyCharge":2.99, "weekdayCharge": true, "weekendCharge": false, "holidayCharge": false}
  // 7/2/15 Th  1
  // 7/3/15 Fr  0
  // 7/4/15 Sat 0
  // 7/5 Sun    0
  // 7/6, 7, 8, 9, 10  Mon-Fri    5
  // 7/11 Sat
  // 6 days total charge days without  discount = 17.94
  // FAILED got 5 chargeable days $14.95 
  it('form test 5: Validay July 4th holiday', () => {
    cy.get('#tool').click();
    cy.contains('JAKR').click();
    cy.get('#checkoutDate').type('7/2/15', {force: true});
    cy.get('#returnDate').type('7/11/15', {force: true});
    cy.get('#discountPercent').type('0', {force: true});
    cy.get('form').submit();
    cy.contains('p', 'Final Amount:').contains('$17.94').should('exist');
  })

  //=========== Test #6 ===========
  // {"type":"jackhammer", "dailyCharge":2.99, "weekdayCharge": true, "weekendCharge": false, "holidayCharge": false}
  // 7/2/20 Th  1
  // 7/3/20 Fr  0
  // 7/4/20 Sat 0
  // 7/5 Sun    0
  // 7/6 Mon    1
  // total of 2 days charge 2X2.99 50% discount => 2.99
  //
  // PASSED
  it('form test 6: Validay July 4th holiday', () => {
    cy.get('#tool').click();
    cy.contains('JAKR').click();
    cy.get('#checkoutDate').type('7/2/20', {force: true});
    cy.get('#returnDate').type('7/6/20', {force: true});
    cy.get('#discountPercent').type('50', {force: true});
    cy.get('form').submit();

    // both work
    // cy.get('p').contains('p', 'Final Amount:').contains('$2.99').should('exist');
    cy.contains('p', 'Final Amount:').contains('$2.99').should('exist');
  })
})