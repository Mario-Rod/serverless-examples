npm install
kill -9 $(ps aux | grep 'node /usr/local/bin/sls offline -P 4000' | grep -v 'grep' | cut -d' ' -f3)
sls offline -P 4000 &
sleep 10
export TEST_ENDPOINT=http://localhost:4000/api 
npm run test-integration