# Rest API Vanilla
In this example I'll show how to create a REST API with a lambda per endpoint based architecture, just using vanilla JS, without any framework. 

## Features
- Basic Logging
- Unit and Functional Test
- Read path variables and body directly from ApiGateway
- Commands through npm scripts
- Serverless stages, envs and custom
- Serverless Resources (DynamoDB table)
- Connection with DynamoDB
- iamRoleStatement

## Commands
### Deploy
- export AWS_DEFAULT_REGION=us-east-1 && export AWS_PROFILE=myawsprofile
- npm install
- npm run deploy
### API Invocation
- We have to trigger the lambda throught the API Gateway, so, after the firts deploy you will recive an URL like this https://XXXXX.execute-api.us-east-1.amazonaws.com/dev/{proxy+}. Try your first request with https://XXXXX.execute-api.us-east-1.amazonaws.com/dev/api/status
### API Local Invocation 
- npm start
- The approach is the same, you will get an local url http://localhost:3000, by default, where you can shoot any request with your favorite http cliente (curl, postman, etc...)
### Test
- npm run unit-test
- npm run test-integration-local
- npm run test-integration-clean

Notes: 
1) First at all, we'll add some unit test to ensure the migration
2) As each endpoint is a separated lambda, we can not use the array food to store, just because each lambda has its own version of the constant.
3) Enpoint limits per stack
4) DynamoDB connection
5) Volatile test env
6) Multiple envs

Error handling, Error Catalog, Input Validation, Unit Test, Functional Test, Logging.