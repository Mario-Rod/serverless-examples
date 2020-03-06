# 02-SayHello
This is the continuation of the previus example.
The goal of this example is show how to add a new funciton in the same stack, how to use inputs in a function
and enrich the serveless.yml for better management.

## Features
- Multiple functions in the same stack
- Event input for lambda
- Simple error handling
- Lambda local invoke

## Enhancements
- Basic folder structure
- Adding package.json for the project metadata
- Properties declarations in serverless.yml (region, runtime, defaultStage)
- Package exclutions
- Functions descriptions 
- AWS Tags for resource trace
- ServerlessFramework version

## Commands

### Deploy
- export AWS_DEFAULT_REGION=us-east-1 && export AWS_PROFILE=myawsprofile
- sls deploy
### Lambda Invocation
- aws lambda invoke --function-name helloworld02-dev-helloWorld response && cat response && rm response
- aws lambda invoke --function-name helloworld02-dev-sayHello --payload '{"name": "Andrelo"}' response && cat response && rm response
- aws lambda invoke --function-name helloworld02-dev-sayHello response && cat response && rm response
### Function Local Invocation 
- sls invoke local -f helloWorld
- sls invoke local -f sayHello -d '{"name": "Andrelo"}'
- sls invoke local -f sayHello (Error)