import * as cdk from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';

export interface AwsServerlessWorkshopStackProps extends cdk.StackProps {
  domainName: string;
  subdomain: string;
}

export class RushAwsServerelessWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: AwsServerlessWorkshopStackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: props.domainName });

    const siteDomain = props.subdomain + '.' + props.domainName;
    const apiDomain = 'api.' + props.subdomain + '.' + props.domainName;

    const siteHttpsUrl = 'https://' + siteDomain;
    const apiHttpsUrl = 'https://' + apiDomain;

    new cdk.CfnOutput(this, 'SiteUrl', { value: siteHttpsUrl });
    new cdk.CfnOutput(this, 'ApiUrl', { value: apiHttpsUrl });

  }
}
