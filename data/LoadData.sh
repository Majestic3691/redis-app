cat /data/redis/StateAirportsSetReady.data | /usr/local/bin/redis-cli --pipe
cat /data/redis/StatesReady.data | /usr/local/bin/redis-cli --pipe
cat /data/redis/TaskReady.data | /usr/local/bin/redis-cli --pipe
cat /data/redis/GEOAirportDataReady.data | /usr/local/bin/redis-cli --pipe
cat /data/redis/CallReady.data | /usr/local/bin/redis-cli --pipe
