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

### Load data using redis-cli via Docker
Copy the data files into the container's home directory
``` docker cp C:\Projects\AWS\github\redis-tasks\data\LoadAirportDataReady.cmd b336bd587683:/home/LoadAirportData.cmd
PS C:\projects\aws\github\redis-tasks\data> docker cp C:\Projects\AWS\github\redis-tasks\data\Task.data b336bd587683:/home/Task.data```

```cat /home/LoadAirportDataReady.data | /usr/local/bin/redis-cli --pipe
```
```cat /home/Task.data | /usr/local/bin/redis-cli --pipe
All data transferred. Waiting for the last reply...
Last reply received from server.
errors: 0, replies: 4```

### Verify data

### Run application




#### Technology used
1. [Node.js](https://nodejs.org/)  
2. [ejs](http://ejs.co/)  
3. [nodemon]()
3. [Docker](https://www.docker.com/)
4. [Redis](https://redis.io/)
