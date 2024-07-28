import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { buildCognitoEnterpriseAuth } from './cognito-enterprise';
import { S3EnterpriseBucket } from './S3EnterpriseBucket';

export class MakerBotCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Enterprise = S3EnterpriseBucket(this)
    const cognitoEnterprise = buildCognitoEnterpriseAuth(this, s3Enterprise.bucketArn)

  }
}