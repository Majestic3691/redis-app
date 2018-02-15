# redis-app

### Node.js Application to use list, hash and geo spatial operations of redis

 The geo spatial operations are not supported on the version of redis created for Windows [here](https://redis.io/download). An alternative to Redis on Windows is to host on Docker.

## Redis on Docker in Windows


### Redis setup on Docker - container
Run the command to create the container for the Redis server
```
docker run -d --name redis-svr -p 6379:6379/tcp redis
```

### Obtain data
  Get sample data from airports by State and convert from CSV file to format for import via redis pipping.

### Load the Docker container with the data and script files
Run the powershell script - CopyDataToContainer.ps1
```
Set-PSDebug -Trace 1
docker cp .\GEOAirportDataReady.data redis-svr:/home/GEOAirportDataReady.data
docker cp .\StateAirportsSetReady.data redis-svr:/home/StateAirportsSetReady.data
docker cp .\StatesReady.data redis-svr:/home/StatesReady.data
docker cp .\TaskReady.data redis-svr:/home/TaskReady.data
docker cp .\LoadData.sh redis-svr:/home/LoadData.sh
```

### Load data using redis-cli via Docker

Copy the data files into the container's home directory
```
 docker cp C:\Projects\AWS\github\redis-tasks\data\GEOAirportDataReady.data b336bd587683:/home/GEOAirportDataReady.data
```
```
docker cp C:\Projects\AWS\github\redis-tasks\data\Task.data b336bd587683:/home/Task.data
```

```
cat /home/LoadAirportDataReady.data | /usr/local/bin/redis-cli --pipe
```
```
cat /home/Task.data | /usr/local/bin/redis-cli --pipe
All data transferred. Waiting for the last reply...
Last reply received from server.
errors: 0, replies: 4
```

### Verify data
Verify tasks were loaded
```
docker container exec -t -i redis-svr /usr/local/bin/redis-cli lrange tasks 0 -1

1) "Plan SpaceX vacation"
2) "Investor Meeting"
3) "Award Dinner"
4) "Grocery Shopping"
```
Verify geo spatial data is loaded
```
docker container exec -t -i redis-svr /usr/local/bin/redis-cli geopos Texas Amoco

1) 1) "-95.19020587205886841"
   2) "29.23135112784979839"
```

```
docker container exec -t -i redis-svr /usr/local/bin/redis-cli geodist Massachusetts Cranland Crowhurst mi

"38.4314"
```

```
docker container exec -t -i redis-svr /usr/local/bin/redis-cli smember States

1) "Wisconsin"
2) "North Carolina"
3) "New York"
4) "California"
5) "Wyoming"
6) "Louisiana"
7) "Ohio"
8) "Midway Atoll"
9) "Tennessee"
58 rows...
```

### Atom setup
1. change directory to the root folder and run ```npm install``` in a command window

### Run application
1. Start a command window
2. Create a directory C:\apps
```
mkdir c:\apps
cd c:\apps
```
2. Clone the repo
```
git clone https://github.com/Majestic3691/redis-tasks
```
3. Change the directory to where the repo was cloned - C:\apps\redis-tasks
```
cd c:\apps\redis-tasks
```
4. Modify the config.js to reflect the proper IP for the docker container and password if the redis installation is secured with a password.
5. Execute nodemon
```
C:\Projects\AWS\github\redis-tasks>nodemon
[nodemon] 1.14.12
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node app.js`
Server Started at Thu Feb 15 2018 14:34:07 GMT-0600 (Central Standard Time) on Port 3000...
Redis Server Connected at 192.168.1.187:6379...
Authentication was passed to the Redis Server, response was: OK
Redis Server was pinged, response was: PONG
```
6. Start your favorite browser and enter the URL - http://127.0.0.1:3000/
7. Try out all three sets of operations...enjoy.

#### Technology used
1. [Node.js](https://nodejs.org/)
2. [Pug](https://jade-lang.com/)
2. [ejs](http://ejs.co/)  
3. [nodemon](https://www.npmjs.com/package/nodemon)
3. [Docker](https://www.docker.com/)
4. [Redis](https://redis.io/)
5. [Twitter Bootstrap](https://getbootstrap.com/2.3.2/)
6. [Express](https://expressjs.com)
