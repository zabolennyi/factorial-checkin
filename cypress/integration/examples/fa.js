//Cypress API Testing Factorial

//set email as CI env variable
//set  password as CI env variable
//set employee_id as CI env variable 

const currentDay = Cypress.moment().format('DD')
const currentMonth = Cypress.moment().format('M')
const currentYear = Cypress.moment().format('YYYY')

const appOrigin = 'https://app.factorialhr.com'
const apiOrigin = 'https://api.factorialhr.com'

const observation = ''
const shiftToCopy = ''
const shiftToDelete = ''

const email = Cypress.env('email')
const password = Cypress.env('password')
const employee_id = Cypress.env('employee_id')

function randomNumber(min, max) {  
  return Math.floor(Math.random() * (max - min) + min); 
}

let randomMin = randomNumber(10, 59)

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
        'user[email]':email,
        'user[password]':password,
        'user[remember_me]': 0
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
          employee_id:employee_id
        }
      })
      .then((response) => {
        const current_month_id = response.body[0].id
        expect(response.status).to.eq(200)
        expect(current_month_id).to.exist
        expect(response.body).to.not.be.null
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
        const date = new Date();
        const today = date.getDate();
        const currentDayInfo = daysInfoInCurrentMonth.find(x => x.day === today);
        const todayShiftId = currentDayInfo.id
        expect(response.status).to.eq(200)
        expect(daysInfoInCurrentMonth).to.exist
        expect(response.body[0].id).to.exist
        expect(response.body).to.not.be.null
        return daysInfoInCurrentMonth, currentDayInfo, todayShiftId
      })
    })
  })
})

describe('set observation for today', () => {
  it('should successfully set observation for current day', () => {
    cy.getDaysInfoInCurrentMonth().then(todayShiftId => {
      cy.getPeriods().then(current_month_id => {
        cy.request({
          method: 'patch',
          url: apiOrigin + '/attendance/shifts/' + todayShiftId,
          headers: {
            'Referer': appOrigin + '/attendance/clock-in/' + currentYear + '/' + currentMonth,
            'Origin':appOrigin,
            'Content-type':'application/json' 
          },
          body: {
            "observations": observation
          }
        })
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.not.be.null
          expect(response.body.observations).to.eq(observation)
          console.log(response)
        })
      })
    })
  })
})

describe('check-in', () => {
  it('should successfully check-in', () => {
    cy.getPeriods().then(current_month_id => {
    //set morning time
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
        "clock_in":"08:" + randomMin,
        "clock_out":"13:00"
      }
    })
    .then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.exist
      expect(response.body).to.not.be.null
      expect(response.body.id).to.exist
      })
      //set evening time
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
          "clock_out":"17:" + randomMin
        }
      })
      .then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.exist
        expect(response.body).to.not.be.null
        expect(response.body.id).to.exist
     })
    })
  })
})
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
//       url: apiOrigin + '/attendance/shifts/' + shiftToDelete, //set shift to delete
//       headers: {
//         'Referer': appOrigin + '/attendance/shifts/clock-in/' + currentYear + '/' + currentMonth,
//         'Origin':appOrigin,
//         'Content-type':'application/json' 
//       }
//     })
//     .then((response) => {
//       expect(response.status).to.eq(204)
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
//           'employee_id': employee_id, //put employer_id
//           'finish_on':'2019-08-01', //put end date
//           'start_on':'2019-08-01', //put start date
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


