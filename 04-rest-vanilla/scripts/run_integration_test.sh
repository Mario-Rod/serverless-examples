export AWS_DEFAULT_REGION=us-east-1 && export AWS_PROFILE=myawsprofile
npm install
sls remove -s integtest || true
sls deploy -s integtest 
sleep 10
TEST_ENDPOINT=$(sls info -s integtest | grep '^  GET' | head -1 | cut -d' ' -f5) && export TEST_ENDPOINT
npm run test-integration