#!/bin/bash
# Why? Education & zero redis-cli dependecy
# (it is a shame, however, this functionality isn't part of redis-cli... PR on the way)
if [ -z "${REDIS_PORT_6379_TCP_ADDR}" ]; then
  HOST=127.0.0.1
else
  HOST="${REDIS_PORT_6379_TCP_ADDR}"
fi
echo "REDIS Server at: $HOST"
if [ -z "${REDIS_PORT_6379_TCP_PORT}" ]; then
  PORT=6379
else
  PORT="$REDIS_PORT_6379_TCP_PORT"
fi
echo "REDIS Port: $PORT"


if [ $# -lt "2" ]
then
    echo "Call a Redis command with its last argument being file contents"
    echo "Usage: $0 <Redis command> <keys and arguments for command> <payload>"
    echo
    echo "Example: calling '$0 SET foo bar.txt' will set the key 'foo'  with the contents of the file 'bar.txt'"
    exit 1
fi

POS=0
RESP=
for ARG
do
    POS=$(($POS + 1))
    if [ $POS != "$#" ]
    then
        RESP="$RESP\$${#ARG}\r\n$ARG\r\n"
    else
#        if [ -a $ARG ]
        if [ -f $ARG ]
        then
			echo "File exists: $ARG"
            SIZE=`cat $ARG | wc -c`
            RESP="*$POS\r\n$RESP\$$SIZE\r\n"
			echo "RESP contains: $RESP"
        else
            echo "File not found: $ARG"
            exit 1
        fi
    fi
done

TEMP="/tmp/$BASHPID.tmp"
echo -n -e $RESP > $TEMP
cat $ARG >> $TEMP
echo -n -e "\r\n" >> $TEMP
echo "Transmitting to RESIS Server..."
netcat $HOST $PORT < $TEMP
rm $TEMP