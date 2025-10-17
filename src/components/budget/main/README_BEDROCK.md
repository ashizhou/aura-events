# AWS Bedrock Setup Guide

This project has been configured to use AWS Bedrock with Claude 3.5 Sonnet instead of Google Gemini.

## Prerequisites

1. **AWS Account** with access to Amazon Bedrock
2. **Model Access**: Request access to Claude models in AWS Bedrock console
3. **IAM User/Role** with appropriate permissions

## Step 1: Enable Bedrock Model Access

1. Go to AWS Console → Amazon Bedrock → Model access
2. Request access to **Anthropic Claude 3.5 Sonnet v2**
3. Wait for approval (usually instant for most regions)

## Step 2: Create IAM Credentials

Create an IAM user or role with the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "arn:aws:bedrock:*::foundation-model/*"
    }
  ]
}
```

Generate access keys for the IAM user.

## Step 3: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your AWS credentials:
   ```env
   DATABASE_URL="file:./dev.db"

   # AWS Bedrock
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here

   # Vapi AI
   NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_token
   NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_workflow_id

   # Next.js
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

## Step 4: Run the Application

```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000

## Supported AWS Regions for Claude

Bedrock with Claude is available in these regions:
- `us-east-1` (US East - N. Virginia)
- `us-west-2` (US West - Oregon)
- `eu-central-1` (Europe - Frankfurt)
- `ap-northeast-1` (Asia Pacific - Tokyo)
- `ap-southeast-1` (Asia Pacific - Singapore)

## Changing the Model

To use a different Claude model, edit `lib/bedrock.ts`:

```typescript
const DEFAULT_MODEL = "anthropic.claude-3-5-sonnet-20241022-v2:0";
```

Available models:
- `anthropic.claude-3-5-sonnet-20241022-v2:0` (Recommended)
- `anthropic.claude-3-5-sonnet-20240620-v1:0`
- `anthropic.claude-3-haiku-20240307-v1:0`
- `anthropic.claude-3-opus-20240229-v1:0`

## Troubleshooting

### Error: "Access denied to model"
- Ensure you've requested model access in the Bedrock console
- Verify your IAM permissions include `bedrock:InvokeModel`

### Error: "Could not resolve credentials"
- Check that AWS credentials are correctly set in `.env`
- Verify the IAM access key is active

### Error: "Region not supported"
- Change `AWS_REGION` to a supported region (see list above)

## Cost Considerations

Claude 3.5 Sonnet pricing (as of 2025):
- Input: ~$3 per 1M tokens
- Output: ~$15 per 1M tokens

For a typical mock interview:
- Question generation: ~500 input tokens, ~300 output tokens = $0.0060
- Feedback generation: ~2000 input tokens, ~1000 output tokens = $0.0210
- **Total per interview: ~$0.027**

## Migration Notes

This project was migrated from:
- **Database**: Firebase Firestore → SQLite with Prisma
- **Authentication**: Firebase Auth → Session-based auth
- **AI Provider**: Google Gemini → AWS Bedrock (Claude)

All local data is stored in `prisma/dev.db`.
