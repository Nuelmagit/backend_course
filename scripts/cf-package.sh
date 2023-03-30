#! /bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

if [ -f "$DIR/../.env" ]
then
    source $DIR/../.env
fi

if [ -z "$DEPLOYMENT_BUCKET" ]
then
    echo "No \$DEPLOYMENT_BUCKET env value found";
    exit 1
else
    COMMAND="aws cloudformation package --template-file build/cloud-app-stack.cf.json --output-template build/cloud-app-stack.yaml --region us-east-1 --s3-bucket $DEPLOYMENT_BUCKET --profile=${AWS_BACKEND_PROFILE}"
    
    $COMMAND
fi
