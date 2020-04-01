export AWS_DEFAULT_REGION=us-east-1 && export AWS_PROFILE=myawsprofile
sls deploy -s integtest
QUEUE_ENDPOINT=$(sls info -s integtest -v | grep 'CallbacksDispatcherQueueOutput' | cut -d' ' -f2) && export QUEUE_ENDPOINT
cd scripts
sls deploy -s integtest
sleep 10
TEST_ENDPOINT=$(sls info -s integtest | grep '^  GET' | head -1 | cut -d' ' -f5) && export TEST_ENDPOINT
cd ..
npm run test-integration