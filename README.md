## Factorial/Holded automation tool

Is used to check hours in Factorial/Holded. Based on Cypress test automation. Basicaly the main funcionality is to clock in hours to Holded. It runs in CI github pipeline, which include cypress test. In test specified few steps to run (open holded page, do login, get coockies and later reuse this coockie to send POST call to Holded clockIn endpoint). 

#### To get started with Holded:

1. Copy this repo and upload to your PRIVATE repo on GitHub
2. Uncomment the Github Action file [here](./.github/workflows/main.yml)
3. Add three parameters as an ENV var to your repo. (email, password).

<del>
#### To get started with Factorial:

1. Copy this repo and upload to your PRIVATE repo on GitHub
2. Uncomment the Github Action file [here](./.github/workflows/main.yml)
3. Add three parameters as an ENV var to your repo. (email, pass, employeeId). **EmployeeId** can be found under your Factorial account.

</del>

#### Usage:

As it mentioned earlier, in the Github Actions CI file config are set by default that it will run every workday. Script are made by running simple Cypress test, and passing through login UI verification, to obtain cookie, that will be used in the next step to make POST calls to mark hours in Factorial/Holded.

#### Default var:

- hours are set between 09:00-13:00 and 14:00-18:00
- observation is empty (it is the comment that u see next to the hours marked in Factorial)
- cron is set to run once a day every workday at 14:00 `[0 14 \* \* 1-5]` .
