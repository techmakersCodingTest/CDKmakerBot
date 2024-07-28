import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket, } from "aws-cdk-lib/aws-s3";
import { aws_s3 as s3 } from 'aws-cdk-lib';

export function S3EnterpriseBucket(scope: Construct) {
    const bucket = new s3.Bucket(scope, "enterprises-info-bucket", {
        bucketName: "enterprises-info-bucket",
        cors: [
            {
                allowedHeaders: ["*"],
                allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST, s3.HttpMethods.DELETE, s3.HttpMethods.HEAD],
                allowedOrigins: ["*"],
                maxAge: 3000,
            },
        ],
    });

    // Export values
    new cdk.CfnOutput(scope, "AttachmentsBucketName", {
        value: bucket.bucketName,
    });

    return bucket
}