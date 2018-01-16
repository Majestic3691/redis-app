Set-PSDebug -Trace 1
docker cp .\GEOAirportDataReady.data redis-svr:/home/GEOAirportDataReady.data
docker cp .\StateAirportsSetReady.data redis-svr:/home/StateAirportsSetReady.data
docker cp .\StatesReady.data redis-svr:/home/StatesReady.data
docker cp .\TaskReady.data redis-svr:/home/TaskReady.data
docker cp .\LoadData.sh redis-svr:/home/LoadData.sh
docker cp .\CallReady.data redis-svr:/home/CallReady.data
