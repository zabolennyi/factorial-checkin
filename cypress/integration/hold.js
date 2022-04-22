//Cypress API time tracking Test Holded

const moment = require('moment')

const email = Cypress.env('email')
const pass = Cypress.env('password')

const epoch = (hour) => moment(moment().format(`MM/DD/YYYY ${hour}`), "MM/DD/YYYY HH:mm").unix()

const today = epoch("00:00")-3600
const entry1 = epoch("08:00")-3600
const leave1 = epoch("12:00")-3600
const entry2 = epoch("13:00")-3600
const leave2 = epoch("17:00")-3600

let details = {
  "day": today,
  "trackerList[0][start]":entry1,
  "trackerList[0][end]": leave1,
  "trackerList[1][start]":entry2,
  "trackerList[1][end]": leave2,
  "timezone":"Europe/Madrid",
  "location": ""
}

const formBody = Object.entries(details).map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value)).join('&')

it('', () => {
	cy.visit('https://app.holded.com/login')
	cy.get('#login-email').type(email)
	cy.get('#login-password')
		.type(pass)
		.type('{enter}')
		.then((response) => {
      cy.wait(3000)
			cy.getCookies().then((cookies) => {
        cy.request({
          method: 'post',
          url: 'https://app.holded.com/teamzone/trackers/updateday',
          headers: {
            cookie: cookies,
            'Content-Type': "application/x-www-form-urlencoded" 
          },
          body: formBody,
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.exist
          expect(response.body).to.not.be.null
        })
			})
		})
})