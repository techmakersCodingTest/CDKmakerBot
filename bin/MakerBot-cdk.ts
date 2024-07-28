#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MakerBotCdkStack } from '../lib/makerbot-cdk-stack';

const app = new cdk.App();
new MakerBotCdkStack(app, 'MakerBotCdkStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});