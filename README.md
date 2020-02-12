# AWS Serverless Workshop

## Docs

1. Install the AWS CLI https://aws.amazon.com/cli/

2. Getting started with AWS CDK https://docs.aws.amazon.com/cdk/latest/guide/work-with.html

## Setup

🔥 Install the AWS CDK cli

```
yarn global add aws-cdk
```

🧶 Create a basic AWS CDK project

```
mkdir rush-aws-serverless-workshop
cd rush-aws-serverless-workshop
yarn install
yarn build
```

💥 Delete the test folder and add a license to the package.json file

We won't be doing any tests, so lets just delete the test folder.

🏃‍♀️ Boostrap CDK

```
cdk bootstrap
 ⏳  Bootstrapping environment aws://817613107166/ap-southeast-2...
CDKToolkit: creating CloudFormation changeset...
 0/2 | 8:59:07 AM | UPDATE_IN_PROGRESS   | AWS::CloudFormation::Stack | CDKToolkit User Initiated
 0/2 | 8:59:11 AM | UPDATE_IN_PROGRESS   | AWS::S3::Bucket | StagingBucket
 1/2 | 8:59:32 AM | UPDATE_COMPLETE      | AWS::S3::Bucket | StagingBucket
 1/2 | 8:59:34 AM | UPDATE_COMPLETE_CLEA | AWS::CloudFormation::Stack | CDKToolkit
 2/2 | 8:59:34 AM | UPDATE_COMPLETE      | AWS::CloudFormation::Stack | CDKToolkit
 ✅  Environment aws://817613107166/ap-southeast-2 bootstrapped.
```

💣 Setup Github repository

```
git remote add origin git@github.com:jakejscott/rush-aws-serverelss-workshop.git
```

## Let's start building our Stack!

🧶 We need to import the aws route53 cdk module.

```
yarn add @aws-cdk/aws-route53
```

🖊️ Lookup our hosted Zone and output the site and api urls for our stack.

```ts
// File: lib/aws-serverless-workshop-stack.ts

import * as cdk from "@aws-cdk/core";
import * as route53 from "@aws-cdk/aws-route53";

export interface AwsServerlessWorkshopStackProps extends cdk.StackProps {
  domainName: string;
  subdomain: string;
}

export class RushAwsServerelessWorkshopStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: AwsServerlessWorkshopStackProps
  ) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const zone = route53.HostedZone.fromLookup(this, "Zone", {
      domainName: props.domainName
    });

    const siteDomain = props.subdomain + "." + props.domainName;
    const apiDomain = "api." + props.subdomain + "." + props.domainName;

    const siteHttpsUrl = "https://" + siteDomain;
    const apiHttpsUrl = "https://" + apiDomain;

    new cdk.CfnOutput(this, "SiteUrl", { value: siteHttpsUrl });
    new cdk.CfnOutput(this, "ApiUrl", { value: apiHttpsUrl });
  }
}
```

🖊️ Edit the entrypoint for our cdk application

```ts
// File: bin/aws-serverless-workshop.ts

#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RushAwsServerelessWorkshopStack } from '../lib/rush-aws-servereless-workshop-stack';

const app = new cdk.App();

new RushAwsServerelessWorkshopStack(app, 'RushAwsServerelessWorkshopStack-cool-dev1', {
                                              // PUT YOUR TEAM NAME HERE! ^^^^^^^^^
    env: {
        account: process.env.AWS_ACCOUNT_ID || '817613107166',
        region: process.env.AWS_DEFAULT_REGION || 'ap-southeast-2'
    },
    domainName: process.env.DOMAIN_NAME || 'jakejscott.com',
    subdomain: process.env.SUB_DOMAIN || 'cool-dev1' // <-- PUT YOUR TEAM NAME HERE!
});

```

🏃‍♀️ Synthesize and print out the Cloudformation stack

```sh
cdk synthesize RushAwsServerelessWorkshopStack-cool-dev1 # <-- PUT YOUR TEAM NAME HERE!

Outputs:
  SiteUrl:
    Value: https://cool-dev1.jakejscott.com
  ApiUrl:
    Value: https://api.cool-dev1.jakejscott.com
Resources:
  CDKMetadata:
    Type: AWS::CDK::Metadata
    Properties:
      Modules: aws-cdk=1.23.0,@aws-cdk/aws-route53=1.23.0,@aws-cdk/core=1.23.0,@aws-cdk/cx-api=1.23.0,jsii-runtime=node.js/v12.16.0
```

🏃‍♀️ Deploy the stack to dev environment

```sh
cdk deploy RushAwsServerelessWorkshopStack-cool-dev1 # <-- PUT YOUR TEAM NAME HERE!

RushAwsServerelessWorkshopStack-cool-dev1: deploying...
RushAwsServerelessWorkshopStack-cool-dev1: creating CloudFormation changeset...
 0/2 | 10:21:23 AM | CREATE_IN_PROGRESS   | AWS::CloudFormation::Stack | RushAwsServerelessWorkshopStack-cool-dev1 User Initiated
 0/2 | 10:21:27 AM | CREATE_IN_PROGRESS   | AWS::CDK::Metadata | CDKMetadata
 0/2 | 10:21:28 AM | CREATE_IN_PROGRESS   | AWS::CDK::Metadata | CDKMetadata Resource creation Initiated
 1/2 | 10:21:29 AM | CREATE_COMPLETE      | AWS::CDK::Metadata | CDKMetadata
 2/2 | 10:21:30 AM | CREATE_COMPLETE      | AWS::CloudFormation::Stack | RushAwsServerelessWorkshopStack-cool-dev1

 ✅  RushAwsServerelessWorkshopStack-cool-dev1

Outputs:
RushAwsServerelessWorkshopStack-cool-dev1.ApiUrl = https://api.cool-dev1.jakejscott.com
RushAwsServerelessWorkshopStack-cool-dev1.SiteUrl = https://cool-dev1.jakejscott.com

Stack ARN:
arn:aws:cloudformation:ap-southeast-2:817613107166:stack/RushAwsServerelessWorkshopStack-cool-dev1/9ae21380-4ddd-11ea-aae5-066f346b367c
```

