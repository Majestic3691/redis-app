cat /home/StateAirportsSetReady.data | /usr/local/bin/redis-cli --pipe
cat /home/StatesReady.data | /usr/local/bin/redis-cli --pipe
cat /home/TaskReady.data | /usr/local/bin/redis-cli --pipe
cat /home/GEOAirportDataReady.data | /usr/local/bin/redis-cli --pipe
