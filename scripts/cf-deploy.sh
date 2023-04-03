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
    COMMAND="aws cloudformation deploy --template-file build/cloud-app-stack.yaml \
    --stack ${STACK_NAME:=tn-operations-app} --region us-east-1 \
    --capabilities CAPABILITY_IAM --s3-bucket $DEPLOYMENT_BUCKET \
    --parameter-overrides HttpApiDomainName=${HTTP_API_DOMAIN_NAME} CertificateArn=${CERTIFICATE_ARN} \
    DbConnection=${DB_CONECTION} RandomApiKey=${RANDOM_API_KEY} JwtSecret=${JWT_SECERT} ApiMapping=${API_MAPPING}  \
    --profile=${AWS_BACKEND_PROFILE}"
    echo $COMMAND;
    $COMMAND
fi
