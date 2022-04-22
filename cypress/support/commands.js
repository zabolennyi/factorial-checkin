// const apiOrigin = 'https://api.factorialhr.com'

// Cypress.Commands.add('login', (email, password) => {
// 	cy.request({
// 		method: 'post',
// 		url: apiOrigin + '/sessions',
// 		headers: {
// 			'Content-Type': 'application/x-www-form-urlencoded',
// 			Referer: 'https://factorialhr.com/users/sign_in',
// 		},
// 		body: {
// 			'user[email]': email,
// 			'user[password]': password,
// 			'user[remember_me]': 0,
// 		},
// 	}).then((response) => {
// 		const cookie = response.headers['set-cookie'][0]
// 		console.log(typeof cookie)
// 		expect(response.headers).to.have.property('set-cookie')
// 		expect(response.status).to.eq(201)
// 		return cookie
// 	})
// })

// Cypress.Commands.add('getPeriods', (currentYear, currentMonth, employee_id, cookie) => {
// 	cy.request({
// 		method: 'get',
// 		url: apiOrigin + '/attendance/periods',
// 		headers: {
// 			cookie: cookie,
// 		},
// 		qs: {
// 			year: currentYear,
// 			month: currentMonth,
// 			employee_id: employee_id,
// 		},
// 	}).then((response) => {
// 		const currentMonthId = response.body[0].id
// 		expect(response.status).to.eq(200)
// 		expect(currentMonthId).to.exist
// 		expect(response.body).to.not.be.null
// 		return currentMonthId
// 	})
// })

// Cypress.Commands.add('setTodayShift', (currentMonthId, todayDay, clockIn, clockOut, observations, cookie) => {
// 	cy.request({
// 		method: 'post',
// 		url: apiOrigin + '/attendance/shifts',
// 		headers: {
// 			cookie: cookie,
// 		},
// 		qs: {
// 			period_id: currentMonthId,
// 		},
// 		body: {
// 			period_id: currentMonthId,
// 			clock_in: clockIn,
// 			clock_out: clockOut,
// 			minutes: 0,
// 			day: todayDay,
// 			observations: observations,
// 			history: [],
// 		},
// 	}).then((response) => {
// 		expect(response.status).to.eq(201)
// 		expect(response.body).to.exist
// 		expect(response.body).to.not.be.null
// 		return response.body
// 	})
// })

// Cypress.Commands.add('getTodayLeaveStatus', (calendarId, currentYear, currentMonth, todayDay, cookie) => {
// 	cy.request({
// 		method: 'get',
// 		url: apiOrigin + '/attendance/calendar',
// 		headers: {
// 			cookie: cookie,
// 		},
// 		qs: {
// 			id: calendarId,
// 			year: currentYear,
// 			month: currentMonth,
// 		},
// 	}).then((response) => {
// 		expect(response.status).to.eq(200)
// 		const currentLeaveDayInfo = response.body.filter((day) => day.day === todayDay)[0]
// 		expect(currentLeaveDayInfo).to.not.be.null
// 		return currentLeaveDayInfo
// 	})
// })
