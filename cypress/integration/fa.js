//Cypress API Testing Factorial

const moment = require('moment')
import promisify from 'cypress-promise'
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

it('', async () => {
	let cookie = await promisify(cy.login(email, password))
	const current_month_id = await promisify(cy.getPeriods(currentYear, currentMonth, employeeId, cookie))
	const todayLeaveStatus = await promisify(cy.getTodayLeaveStatus(calendarId, currentYear, currentMonth, todayDay, cookie))
	if (todayLeaveStatus.is_leave === true || todayLeaveStatus.is_working === false) {
		console.log('Today is Off-day')
	} else {
		await promisify(cy.setTodayShift(current_month_id, randomMin, todayDay, `09:${randomMin}`, '13:00', observations, cookie))
		await promisify(cy.setTodayShift(current_month_id, randomMin, todayDay, '14:00', `18:${randomMin}`, observations, cookie))
	}
})
