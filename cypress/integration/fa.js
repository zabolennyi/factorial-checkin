//Cypress API Testing Factorial

const moment = require('moment')

const currentMonth = Cypress.moment().format('M')
const currentYear = Cypress.moment().format('YYYY')
const todayDay = parseInt(moment().format('D'))

const email = Cypress.env('email')
const password = Cypress.env('password')
const employee_id = Cypress.env('employee_id')
const calendarId = employee_id

const observations = ''

function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min) + min)
}

const randomMin = randomNumber(10, 59)

it('', () => {
	cy.visit('https://api.factorialhr.com/users/sign_in')
	cy.get('#user_email').type(email)
	cy.get('#user_password')
		.type(password)
		.type('{enter}')
		.then((response) => {
			cy.getCookie('_factorial_session').then((cookie) => {
				cy.getPeriods(currentYear, currentMonth, employee_id, cookie).then((current_month_id) => {
					cy.getTodayLeaveStatus(calendarId, currentYear, currentMonth, todayDay, cookie).then((todayLeaveStatus) => {
						if (todayLeaveStatus.is_leave === true || todayLeaveStatus.is_laborable === false) {
							console.log('Today is Off-day')
						} else {
							cy.setTodayShift(current_month_id, randomMin, todayDay, `09:${randomMin}`, '13:00', observations, cookie)
							cy.setTodayShift(current_month_id, randomMin, todayDay, '14:00', `18:${randomMin}`, '', cookie)
						}
					})
				})
			})
		})
})
