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

if [[ $BUILD_STATUS == "READY" && ${GITHUB_REF_NAME} != "main" ]]
then
  echo "Running alias script"
  ALIAS_OUTCOME=$(node ./scripts/vercel.js "alias")
  echo $ALIAS_OUTCOME
fi

if [[ ${GITHUB_REF_NAME} == "main" ]]
then
  echo "Finding alias ID for staging URL"
  export STAGING_ALIAS_UID=$(node ./scripts/vercel.js "getAlias")
  echo $STAGING_ALIAS_UID

  echo "Removing alias for staging"
  REMOVE_STAGING_ALIAS=$(node ./scripts/vercel.js "removeStagingAlias")
  echo $REMOVE_STAGING_ALIAS
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