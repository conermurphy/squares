#!/bin/bash

BUILD_STATUS=""

export BUILD_ID=$( node ./scripts/vercel.js trigger $1)

echo "Vercel Build ID is $BUILD_ID"

while [[ $BUILD_STATUS != "READY" && $BUILD_STATUS != "CANCELED" && $BUILD_STATUS != "ERROR" ]]
do

  BUILD_STATUS=$( node ./scripts/vercel.js check $1)

  echo "Build Status is: $BUILD_STATUS"

  if [[ $( echo $BUILD_STATUS | grep -q 'Error: Request failed with status code' ) ]]
  then
    echo "Exiting with error due to: $BUILD_STATUS"
    exit 1
  fi

  if [[ $BUILD_STATUS != "READY" && $BUILD_STATUS != "CANCELED" && $BUILD_STATUS != "ERROR" ]]
  then
    echo "Sleeping for 30 seconds..."
    sleep 30
  fi
done

if [[ $BUILD_STATUS == "READY" ]]
then
  ALIAS_OUTCOME=$(node ./scripts/vercel.js "alias" $1)
  echo $ALIAS_OUTCOME
  exit 0
fi

if [[ $BUILD_STATUS == "CANCELED" || $BUILD_STATUS != "ERROR"]]
then
  echo "Exiting with an error due to build status: $BUILD_STATUS"
  exit 1
fi