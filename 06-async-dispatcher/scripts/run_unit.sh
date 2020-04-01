export PORT=3050
kill -9 $(ps aux | grep "node /usr/local/bin/sls offline -P $PORT" | grep -v 'grep' | cut -d' ' -f3)
cd scripts
sls offline -P $PORT &
cd ..
sleep 5
jest test/unit