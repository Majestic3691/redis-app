REM * Cleanup
docker images prune -q
docker volume prune -f
docker container prune -f
REM * Stop Container
docker stop redis-svr
REM * Remove Container
docker rm -f redis-svr
REM * Remove Image
docker image rm -f redisbase
REM * Create the image and container - deploy
docker volume create --name redis-data
COPY ./data/*.data redis-data
docker build -t redisbase --iidfile imageID -f docker/Dockerfile .
docker run -d --name redis-svr -p6379:6379 -v redis-data:/usr/share/redis/data redisbase
