# Async Workflows - Dispatcher
First part for an async worklow. In this case we will working in a dispatcher system, using Lambda and SQS.

## Features
- SQS event to trigger lambdas
- Lambda timeouts / SQS visibilityTimeout
- SQS Integration Test
- SQS-SDK to send messages (for testing)

## Commands
### Deploy
- export AWS_DEFAULT_REGION=us-east-1 && export AWS_PROFILE=myawsprofile
- npm install
- npm run deploy-dev
### Lambda Invocation
- We have to trigger the lambda throught the SQS, so, you need to send a message to the queue (see SQS commands)
### Function Local Invocation 
- Only running unit-test, for now.
### Test
- npm run unit-test
- npm run test-integration
### SQS
- Get QUEUE_URL: sls info -s dev -v => Stack Outputs => CallbacksDispatcherQueueOutput
- Queue stats: aws sqs get-queue-attributes --attribute-names All --queue-url {{YOU_QUEUE_URL}} 
- Clean Queue: aws sqs purge-queue --queue-url {{YOU_QUEUE_URL}}
- Send Message: aws sqs --message-body '{"url": "https://google.com"}' --queue-url {{YOU_QUEUE_URL}}