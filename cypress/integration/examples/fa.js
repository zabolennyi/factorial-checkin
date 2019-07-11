//Cypress API Testing Factorial

//set email as CI env variable
//set  password as CI env variable
//set employee_id as CI env variable 

const currentDay = Cypress.moment().format('DD')
const currentMonth = Cypress.moment().format('M')
const currentYear = Cypress.moment().format('YYYY')
const appOrigin = 'https://app.factorialhr.com'
const apiOrigin = 'https://api.factorialhr.com'
const shiftToCopy = ''

function randomNumber(min, max) {  
  return Math.floor(Math.random() * (max - min) + min); 
}

var randomMin = randomNumber(10, 59)

describe('login', () => {
  Cypress.Commands.add("login", () => {
    return cy.request({
      method: 'post',
      url: apiOrigin + '/sessions',
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Referer' : 'https://factorialhr.com/users/sign_in'
      },
      body: {
        'user[email]':Cypress.env('email'),
        'user[password]':Cypress.env('password'),
        '[remember_me]': 0
      }
    }).then((response) => {
      const cookie = response.headers['set-cookie'][0]
      expect(response.headers).to.have.property('set-cookie')
      expect(response.status).to.eq(201)
      return cookie
    })
})


describe('Get Periods', () => {
  Cypress.Commands.add("getPeriods", () =>  {
    cy.login().then(cookie => {
      return cy.request({
        method: 'get',
        url: apiOrigin + '/attendance/periods',
        qs: {
          year: currentYear,
          month: currentMonth,
          employee_id:Cypress.env('employee_id')
        }
      })
      .then((response) => {
        const current_month_id = response.body[0].id
        expect(response.status).to.eq(200)
        return current_month_id
      })
    })
  })
})

describe('Get days in current month', () => {
  Cypress.Commands.add("getDaysInfoInCurrentMonth", () => {
    cy.getPeriods().then(current_month_id => {
      return cy.request({
        method: 'get',
        url: apiOrigin + '/attendance/shifts',
        qs: {
          period_id: current_month_id
        }
      })
      .then((response) => {
        const daysInfoInCurrentMonth = response.body
        expect(response.status).to.eq(200)
        return daysInfoInCurrentMonth
      })
    })
  })
})

describe('check-in', () => {
  it('should successfully check-in', () => {
    cy.getPeriods().then(current_month_id => {
    cy.request({
      method: 'post',
      url: apiOrigin + '/attendance/shifts',
      headers: {
        'Referer': appOrigin + '/attendance/shifts/clock-in/' + currentYear + '/' + currentMonth,
        'Origin':appOrigin,
        'Content-type':'application/json' 
      },
      body: {
        "period_id":current_month_id,
        "minutes":0,
        "day":currentDay,
        "observations":null,
        "clock_in":"09:" + randomMin,
        "clock_out":"13:00"
      }
    })
    .then((response) => {expect(response.status).to.eq(201)
      })
      cy.request({
        method: 'post',
        url: apiOrigin + '/attendance/shifts',
        headers: {
          'Referer': appOrigin + '/attendance/shifts/clock-in/' + currentYear + '/' + currentMonth,
          'Origin':appOrigin,
          'Content-type':'application/json' 
        },
        body: {
          "period_id":current_month_id,
          "minutes":0,
          "day":currentDay,
          "observations":null,
          "clock_in":"14:00",
          "clock_out":"18:" + randomMin
        }
      })
      .then((response) => {expect(response.status).to.eq(201)
        })
    })
  })
})
// 
// 
// 
// describe('fill all shifts from selected one', () => {
//   it('should successfully copy time from selected to all shifts', () => {
//     cy.login().then(cookie => {
//        cy.request({
//         method: 'post',
//         url: apiOrigin + '/attendance/shifts/' + shiftToCopy + '/copy',
//       })
//       .then((response) => {
//         expect(response.status).to.eq(200)
//       })
//     })
//   })
// })
// 
// describe('delete shift', () => {
//   it('should successfully delete shift', () => {
//     cy.getPeriods().then(current_month_id => {
//     cy.request({
//       method: 'delete',
//       url: apiOrigin + '/attendance/shifts/' + shiftNumber, //set shift to delete
//       headers: {
//         'Referer': appOrigin + '/attendance/shifts/clock-in/' + currentYear + '/' + currentMonth,
//         'Origin':appOrigin,
//         'Content-type':'application/json' 
//       }
//     })
//     .then((response) => {expect(response.status).to.eq(204)
//       })
//     })
//   })
// })



// describe('request a vacations', () => {
//   it('should successfully send request for vacations', () => {
//     cy.login().then(cookie => {
//        cy.request({
//         method: 'post',
//         url: apiOrigin + '/leaves',
//         headers: {
//           'Content-Type' : 'application/x-www-form-urlencoded',
//           'Referer' : appOrigin + '/time-off/' + currentYear + '/leaves/new',
//           'Origin' : apiOrigin
//         },
//         body: {  
//           'description':null,
//           'employee_id': 0000, //put employer_id
//           'finish_on':'2019-08-01', //put date
//           'start_on':'2019-08-01', //put date
//           'half_day':null,
//           'leave_type_id':0000, //put leave type id
//           'medical_leave_type':null,
//           'medical_leave_document':null,
//           'effective_on':null,
//           'paternity_birth_on':null,
//           'accident_on':null,
//           'medical_discharge_reason':null,
//           'colegiate_number':null,
//           'has_previous_relapse':false,
//           'relapse_leave_id':null,
//           'relapse_on':null
//        }
//       })
//       .then((response) => {
//         expect(response.status).to.eq(201)
//       })
//     })
//   })
// })

})


