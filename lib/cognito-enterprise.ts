import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from 'constructs';
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { UserPool, AccountRecovery, VerificationEmailStyle, UserPoolClient, OAuthScope, CfnIdentityPool } from 'aws-cdk-lib/aws-cognito';
import { CognitoAuthRole } from './CognitoAuthRole';

export function buildCognitoEnterpriseAuth(scope: Construct, bucketArn: string) {

  const cognito = new UserPool(scope, "liberta-track-enterprise-pool", {
    userPoolName: 'liberta-track-enterprise-pool',
    signInAliases: {
      email: true,
      username: false
    },
    selfSignUpEnabled: true,
    standardAttributes: {
      email: {
        required: true
      },
      givenName: {
        required: true,
        mutable: true
      },
      familyName: {
        required: true,
        mutable: true
      }
    },
    autoVerify: { email: true },
    userVerification: {
      emailSubject: 'You need to verify your email to access LibertaTrack.',
      emailBody: 'Thanks for signing up Your verification code is {####}',
      emailStyle: VerificationEmailStyle.CODE,
    },
    passwordPolicy: {
      minLength: 8,
      requireLowercase: true,
      requireUppercase: true,
      requireDigits: true
    },
    accountRecovery: AccountRecovery.EMAIL_ONLY,
    removalPolicy: RemovalPolicy.DESTROY,
  })

  const userPoolClient = new UserPoolClient(scope, "liberta-track-enterprise-client", {
    userPool: cognito,
    authFlows: {
      userPassword: true,
      userSrp: true
    },
    generateSecret: false,
    oAuth: {
      flows: {
        authorizationCodeGrant: true,
      },
      scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
      callbackUrls: ["http://localhost:3000"]
    },
  });

  const identityPool = new CfnIdentityPool(scope, "liberta-track-enterprise-identity-pool", {
    allowUnauthenticatedIdentities: false,
    cognitoIdentityProviders: [
      {
        clientId: userPoolClient.userPoolClientId,
        providerName: cognito.userPoolProviderName,
      },
    ],
  });

  const authenticatedRole = CognitoAuthRole(scope, identityPool)

  authenticatedRole.addToPolicy(
    // IAM policy granting users permission to a specific folder in the S3 bucket
    new PolicyStatement({
      actions: ["s3:*"],
      effect: Effect.ALLOW,
      resources: [
        bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    })
  );

  new CfnOutput(scope, 'enterprise-pool-id', {
    value: cognito.userPoolId || "",
  });

  new CfnOutput(scope, 'enterprise-client-id', {
    value: userPoolClient.userPoolClientId || "",
  })

  new CfnOutput(scope, "enterprise-identity-pool", {
    value: identityPool.ref,
  });

  new CfnOutput(scope, "AuthenticatedRoleName", {
    value: authenticatedRole.roleName,
  });

  return cognito
}