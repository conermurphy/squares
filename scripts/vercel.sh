#!/bin/bash

BUILD_STATUS=""

export BUILD_ID=$( node ./scripts/vercel.js trigger)

echo "Vercel Build ID is $BUILD_ID"

while [[ $BUILD_STATUS != "READY" && $BUILD_STATUS != "CANCELED" && $BUILD_STATUS != "ERROR" ]]
do

  BUILD_STATUS=$( node ./scripts/vercel.js check)

  echo "Build Status is: $BUILD_STATUS"

  if [[ $( echo $BUILD_STATUS | grep -q 'Request failed' ) ]]
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

if [[ $BUILD_STATUS == "READY" && ${GITHUB_BASE_REF} != "main" ]]
then
  ALIAS_OUTCOME=$(node ./scripts/vercel.js "alias")
  echo $ALIAS_OUTCOME
fi

if [[ $BUILD_STATUS == "READY" ]]
then
  exit 0
fi

if [[ $BUILD_STATUS == "CANCELED" ]]
then
  exit 0
fi

if [[ $BUILD_STATUS == "ERROR" ]]
then
  echo "Exiting with an error due to build status: $BUILD_STATUS"
  exit 1
fi