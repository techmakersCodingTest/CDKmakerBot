import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { buildCognitoEnterpriseAuth } from './cognito-enterprise';
import { buildCognitoConsumerAuth } from './cognito-consumer';
import { S3EnterpriseBucket } from './S3EnterpriseBucket';

export class LibertaTrackCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Enterprise = S3EnterpriseBucket(this)
    const cognitoEnterprise = buildCognitoEnterpriseAuth(this, s3Enterprise.bucketArn)
    const cognitoConsumer = buildCognitoConsumerAuth(this)

  }
}