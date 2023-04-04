# tn-back

### Tested on
* Ubuntu 20.04.5 LTS
* Node: v14.21.3

### Considerations.
If you are planning to deploy to AWS. You will be required to Install AWS CLI, Configure credentials and optionally set up profiles.
Please follow AWS guide to install and set up your AWS CLI
* [Getting started and Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
* [Configuring AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
    *  [Configuration and credential file settings](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
* [Authentication and access credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html)


For deployment you will see that an OPTONAL VAR (AWS_BACKEND_PROFILE) is referenced. This variable will add to all commands executed by the deployment script the option "--profile". You can avoid the use of the var AWS_BACKEND_PROFILE by settign up the environment variable AWS_PROFILE in your SO. However some times after set AWS_PROFILE in your SO you could face unexpected behaviour and enforce the profile using the option --profile is a good workaround.

To undestard what does --profile or AWS_PROFILE please read:
[Using named profiles](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-using-profiles)

### Project setup
Before running a local server or deploying to AWS please install dependecies by running
```
npm install
```
Create a .env file based on .env.sample file.
```
//.env file
#Mandatory for local environments and AWS deployment
DB_CONECTION="mongodb+srv://xx:xx@xx.xxx.mongodb.net/xx?retryWrites=true&w=majority" #MongoDb conenction string
RANDOM_API_KEY=xxx-xxx-xxx-xxx-xxx  #Random API KEY
JWT_SECERT=mysecret #String to generate JWT
API_MAPPING=v1/operations  #Base path of the API
#Mandatory JUST for local environment
EXPRESS_PORT=3000
#Mandatory JUST for AWS deployment
HTTP_API_DOMAIN_NAME=tn-apis.app.com #Domain name for the API
DEPLOYMENT_BUCKET=tn-back # AWS S3 bucket to deploy artifacts. You HAVE to create it manually
AWS_BACKEND_PROFILE=tnprofile #Optional. Configured AWS CLI Profile to deploy app. Leave it black if you dont want to specify a profile and use the default aws cli config.
CERTIFICATE_ARN=arn:aws:acm:us-east-1:999:certificate/xxxx #AWS Certificate Managers ARN for DNS described in DOMAIN_NAME
```
### Run a local server
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Load the test user to your database.
Remplace "mongo-connection-string" for your database connection string in the next command and run it to add the test user to the database. The username is "test@tn.com", the password is "tn123" and the starting balance is 1000. This script is for testig purposes. Please don't use it in production environments.
```
DB_CONECTION="mongo-connection-string" npx babel-node scripts/init-account-state.js
```

### Load the operation types to your database.
Remplace "mongo-connection-string" for your database connection string in the next command and run it to add the operation types to the database. All of the operation costs are 1 by default. You can change it before running the command.
```
DB_CONECTION="mongo-connection-string" npx babel-node scripts/init-operation-types.js
```



### Deploy on AWS
* Set the mongo connection string as DB_CONECTION in the .env file. [Create a free mongo instance](https://www.mongodb.com/es/atlas/database)
* Set the random api key as RANDOM_API_KEY in the .env file. [Random API](https://api.random.org/)
* Set you seed to generate JWT as JWT_SECERT. Please keep it in a safe place.
* Set the API's base path as API_MAPPING. We recomend to leave the default value "v1/operations". If you change it you must update your front end vars to match your changes. 
* Install and configure AWS cli to execute command on your AWS account. Optionally you can set up an AWS profile.
* If you have set up a profile in the previous step make sure you set the env var AWS_BACKEND_PROFILE in the .env file
* Create an S3 bucket in you account to store deployment artifacts [Create your first S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-bucket.html)
* Set the bucket name of the bucket created in the previous step as DEPLOYMENT_BUCKET in the .env file.
* Create a DNS with the DNS provider of your preference and set it in HTTP_API_DOMAIN_NAME in the .env file
* Add/Create to AWS Certificate manager (AWS Console -> AWS Certificate Manager -> Certificates) a certificate that contains the host declared in HTTP_API_DOMAIN_NAME and set its ARN as CERTIFICATE_ARN in the .env file
* Your .env file will looks like
```
//.env 
#Mandatory for local environments and AWS deployment
DB_CONECTION="mongodb+srv://xx:xx@xx.xxx.mongodb.net/xx?retryWrites=true&w=majority"
RANDOM_API_KEY=xxx-xxx-xxx-xxx-xxx
JWT_SECERT=mysecret
API_MAPPING=v1/operations
#Mandatory JUST for local environment
EXPRESS_PORT=3000
#Mandatory JUST for AWS deployment
DEPLOYMENT_BUCKET=tn-back
HTTP_API_DOMAIN_NAME=tn-apis.app.com
AWS_BACKEND_PROFILE=tnprofile
CERTIFICATE_ARN=arn:aws:acm:us-east-1:999:certificate/xxxx
```
* Add the front end Domain name and/or CloudFront distribution URL to CORS config in src/operations.openapi.yaml.
```
//src/operations.openapi.yaml
x-amazon-apigateway-cors:
  allowOrigins:
  - https://tn-front.app.com
  - https://xxxxx.cloudfront.net
```
* Update your server url in src/operations.openapi.yaml with the format https://${HTTP_API_DOMAIN_NAME}/${API_MAPPING} in src/operations.openapi.yaml.
```
//src/operations.openapi.yaml
servers:
  - url: https://tn-apis.app.com/v1/operations
```
* run deploy command
```
npm run deploy
```
### After Deployment
* You have to configure the DNS declared in HTTP_API_DOMAIN_NAME to point to the Domain name of the API Gateway created in the previous step. You could find it in AWS Console -> API Gateway -> Custom domain names -> Select the domain name you have declared in HTTP_API_DOMAIN_NAME. Under Configurations you will see the API Gateway domain name it looks like x-xxxxxxx.execute-api.us-east-1.amazonaws.com
* Important. If you delete the API gateway after configuring the DNS you will have to re configure your DNS after the next deployment because a new API gateway will be created and the domain name will change.
* Update the var VUE_APP_OPERATIONS_API_URL in your front end project. It should looks like https://${HTTP_API_DOMAIN_NAME}/${API_MAPPING}
```
//Front end folder -> .env
VUE_APP_OPERATIONS_API_URL=https://tn-apis.app.com/v1/operations
```
