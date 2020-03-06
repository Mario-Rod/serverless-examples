# 01-Helloworld
This is the simplest deploy posible.
We are creating a lambda function that return "HelloWorld!"

By default ServerlessFramework are using the following values:
- runtime: "nodejs12.x"
- region: "us-east-1"
- stage: "dev"

## Commands

### Deploy
- export AWS_DEFAULT_REGION=us-east-1 && export AWS_PROFILE=myawsprofile
- sls deploy
### Lambda Invocation
- aws lambda invoke --function-name helloworld01-dev-helloWorld response && cat response && rm response