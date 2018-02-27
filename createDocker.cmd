REM * Cleanup
REM * Stop Container
docker stop redis-svr
REM * Remove Container
docker rm -f redis-svr
REM * Remove Image
docker image rm -f redisbase
REM * Create the image and container - deploy
docker build -t redisbase --iidfile imageID -f docker/Dockerfile .
docker volume create --name redis-data
docker run -d --name redis-svr -p6379:6379 -v redis-data:/usr/share/redis/data redisbase
