//Cypress API Testing Factorial

const moment = require('moment')

const currentMonth = Cypress.moment().format('M')
const currentYear = Cypress.moment().format('YYYY')
const todayDay = parseInt(moment().format('D'))

const email = Cypress.env('email')
const password = Cypress.env('password')
const employeeId = Cypress.env('employeeId')
const calendarId = employeeId

const observations = ''

function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min) + min)
}

const randomMin = randomNumber(10, 59)

xit('', () => {
	cy.visit('https://api.factorialhr.com/users/sign_in')
	cy.get('#user_email').type(email)
	cy.get('#user_password')
		.type(password)
		.type('{enter}')
		.then((response) => {
			cy.getCookie('_factorial_session').then((cookie) => {
				cy.getPeriods(currentYear, currentMonth, employeeId, cookie).then((currentMonthId) => {
					cy.getTodayLeaveStatus(calendarId, currentYear, currentMonth, todayDay, cookie).then((todayLeaveStatus) => {
						if (todayLeaveStatus.is_leave === true || todayLeaveStatus.is_laborable === false) {
							console.log('Today is Off-day')
						} else {
							cy.setTodayShift(currentMonthId, todayDay, `09:00`, '13:00', observations, cookie)
							cy.setTodayShift(currentMonthId, todayDay, '14:00', `18:00`, '', cookie)
						}
					})
				})
			})
		})
})
