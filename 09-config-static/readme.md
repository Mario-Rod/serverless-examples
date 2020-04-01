# Configs - Static
This example covers three main aspects: 
1) Creation of a custom deployment package, optimized with compression and only required files.
2) A single configuration entrypoint for all kind of configurations: statics, secrets, infrastructure params and calculated values.
3) How to write your custom serverless plugin.

In this case I chose generate an static json file which contains all the configurations for an determinated environtment.

## Features
- Single entrypoint for all configs
- Infrastructue params by envs
- Secrets management with Parameter Store
- Secret creation with sls plugin
- Adds secrets name automatically in config
- Minimum and compressed package
- Local development with hot-reloaded allowed (but not the configs)
- Secrets protection with IAM users and policies only
- Integration with node-config standard library

## Commands
### Add or update secret
- export AWS_DEFAULT_REGION=us-east-1 && export AWS_PROFILE=myawsprofile
- sls putsecret --name "your-secret-name" --value "any value" -s local
### Lambda Invocation
- export AWS_DEFAULT_REGION=us-east-1 && export AWS_PROFILE=myawsprofile
- npm install
- npm run deploy-dev
- sls invoke -s dev -f helloWorld
### Function Local Invocation 
- npm start