#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LibertaTrackCdkStack } from '../lib/liberta-track-cdk-stack';

const app = new cdk.App();
new LibertaTrackCdkStack(app, 'LibertaTrackCdkStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

});