const apiOrigin = 'https://api.factorialhr.com'

Cypress.Commands.add('login', (email, password) => {
	return cy
		.request({
			method: 'post',
			url: apiOrigin + '/sessions',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Referer: 'https://factorialhr.com/users/sign_in',
			},
			body: {
				'user[email]': email,
				'user[password]': password,
				'user[remember_me]': 0,
			},
		})
		.then((response) => {
			const cookie = response.headers['set-cookie'][0]
			console.log(typeof cookie)
			expect(response.headers).to.have.property('set-cookie')
			expect(response.status).to.eq(201)
			return cookie
		})
})

Cypress.Commands.add('getPeriods', (currentYear, currentMonth, employeeId, cookie) => {
	cy.request({
		method: 'get',
		url: apiOrigin + '/attendance/periods',
		headers: {
			cookie: cookie,
		},
		qs: {
			year: currentYear,
			month: currentMonth,
			employee_id: employeeId,
		},
	}).then((response) => {
		const current_month_id = response.body[0].id
		expect(response.status).to.eq(200)
		expect(current_month_id).to.exist
		expect(response.body).to.not.be.null
		return current_month_id
	})
})

Cypress.Commands.add('setTodayShift', (current_month_id, randomMin, todayDay, clockIn, clockOut, observations, cookie) => {
	cy.request({
		method: 'post',
		url: apiOrigin + '/attendance/shifts',
		headers: {
			cookie: cookie,
		},
		qs: {
			period_id: current_month_id,
		},
		body: {
			period_id: current_month_id,
			clock_in: clockIn,
			clock_out: clockOut,
			minutes: 0,
			day: todayDay,
			observations: observations,
			history: [],
		},
	}).then((response) => {
		expect(response.status).to.eq(201)
		expect(response.body).to.exist
		expect(response.body).to.not.be.null
		return response.body
	})
})

Cypress.Commands.add('getTodayLeaveStatus', (calendarId, currentYear, currentMonth, todayDay, cookie) => {
	cy.request({
		method: 'get',
		url: apiOrigin + '/attendance/calendar',
		headers: {
			cookie: cookie,
		},
		qs: {
			id: calendarId,
			year: currentYear,
			month: currentMonth,
		},
	}).then((response) => {
		expect(response.status).to.eq(200)
		const currentLeaveDayInfo = response.body.filter((day) => day.day === todayDay)[0]
		expect(currentLeaveDayInfo).to.not.be.null
		return currentLeaveDayInfo
	})
})
