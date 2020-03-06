# API Rest Express
In this example I'll show how to create a REST API with a Web Framework (express.js) based architecture. 

## Features
- Lambda triggered by a API GATEWAY
- Error handling using express middlewares
- Lambda local with serverless offline
- Function events and Plugins in serverless.yml

## Commands
### Deploy
- export AWS_DEFAULT_REGION=us-east-1 && export AWS_PROFILE=myawsprofile
- npm install (since we have external dependencies, we must install them before upload the package)
- sls deploy
### API Invocation
- We have to trigger the lambda throught the API Gateway, so, after the firts deploy you will recive an URL like this https://XXXXX.execute-api.us-east-1.amazonaws.com/dev/{proxy+}. Try your first request with https://XXXXX.execute-api.us-east-1.amazonaws.com/dev/api/status
### API Local Invocation 
- sls offline
- The approach is the same, you will get an local url http://localhost:3000, by default, where you can shoot any request with your favorite http cliente (curl, postman, etc...)