# Sanity CMS Setup Guide

This guide will help you set up your Sanity project and configure the environment variables.

## Step 1: Create a Sanity Account and Project

1. Go to [https://www.sanity.io/](https://www.sanity.io/) and sign up for a free account
2. Once logged in, create a new project:
   - Click "Create new project"
   - Enter a project name (e.g., "Flowspace CMS")
   - Choose a dataset name (typically "production" for production, "development" for local dev)
   - Select the nearest region

## Step 2: Get Your Project Credentials

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** section in the project settings
4. You'll need:
   - **Project ID**: Found under "Project ID" (looks like: `abc12345`)
   - **Dataset**: Usually `production` or `development`
   - **API Token** (optional): For draft/preview mode
     - Go to **API** → **Tokens**
     - Create a new token with **"Editor"** permission (minimum required to read draft/unpublished content)
     - Copy the token (you won't see it again!)
     - **Note**: "Viewer" permission only reads published content; use "Editor" or higher for preview mode

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root of your project (or update your existing `.env` file) with the following:

```env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token_here  # Optional, only needed for preview mode
```

**Important Notes:**
- `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are required
- `SANITY_API_READ_TOKEN` is optional but recommended if you want to use preview/draft mode
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` to git (it's already in `.gitignore`)

## Step 4: Verify Setup

After setting up environment variables, restart your dev server:

```bash
npm run dev
```

The environment variables are validated at build time, so you'll see an error if any required variables are missing.

## Next Steps

1. Set up Sanity Studio (Task 1.7)
2. Create content schemas (Task 1.4)
3. Start creating content!

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js + Sanity Integration](https://www.sanity.io/docs/js-client)
- [Sanity Project Management](https://www.sanity.io/manage)

