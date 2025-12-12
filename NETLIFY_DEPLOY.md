# Deploying to Netlify

## How It Works

Netlify uses **serverless functions** instead of a traditional always-running server. This means:

1. **No persistent server**: Each request may start a new function instance (cold start)
2. **Auto-scaling**: Functions scale automatically based on traffic
3. **Pay-per-use**: You only pay for actual function invocations

## How It Starts

When a request comes to your Netlify site:

1. Netlify routes the request to the serverless function (`/.netlify/functions/server`)
2. The function handler wraps your Express app using `serverless-http`
3. The Express app processes the request and returns a response
4. The function instance may be kept warm for a few minutes (warm start) or shut down (cold start)

**Note**: The request counter and logs are stored in memory, so they reset on cold starts. This is normal for serverless functions.

## Deployment Steps

### Option 1: Deploy via Netlify UI

1. **Connect Repository**:

   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository: `waseemdilsherim/next-cache-server`

2. **Configure Build Settings**:

   - **Base directory**: Leave empty (or `/` if needed)
   - **Build command**: `npm run build:netlify` or `npm run build`
   - **Publish directory**: Leave empty (not needed for functions-only)
   - **Functions directory**: `netlify/functions`

3. **Environment Variables** (if needed):

   - Go to Site settings → Environment variables
   - Add any required variables (e.g., `PORT` is not needed for Netlify)

4. **Deploy**:
   - Click "Deploy site"
   - Netlify will build and deploy your function

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
cd server
netlify init
netlify deploy --prod
```

## Build Configuration

The `netlify.toml` file configures:

- **Build command**: Compiles TypeScript to JavaScript
- **Functions directory**: Where Netlify looks for serverless functions
- **Redirects**: Routes all requests (`/*`) to the serverless function

## Testing Locally

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run Netlify Dev (simulates Netlify environment)
cd server
netlify dev
```

This will:

- Start the function locally
- Make it available at `http://localhost:8888`
- Simulate the Netlify environment

## Function Endpoints

Once deployed, your endpoints will be available at:

- `https://your-site.netlify.app/` - Health check
- `https://your-site.netlify.app/api/data` - No cache endpoint
- `https://your-site.netlify.app/api/cached` - Cached endpoint
- `https://your-site.netlify.app/api/revalidate` - Revalidation endpoint
- `https://your-site.netlify.app/api/isr` - ISR endpoint
- `https://your-site.netlify.app/api/stats` - Statistics
- `https://your-site.netlify.app/api/reset` - Reset counter

## Important Notes

1. **Cold Starts**: First request after inactivity may take 1-2 seconds (cold start)
2. **Memory State**: Request counters reset on cold starts (this is expected)
3. **Timeout**: Netlify functions have a 10-second timeout on free tier, 26 seconds on paid
4. **Concurrent Requests**: Free tier allows 125 concurrent function executions

## Troubleshooting

- **Build fails**: Check that all dependencies are in `package.json`
- **Function not found**: Verify `netlify/functions/server.js` exists after build
- **TypeScript errors**: Ensure `tsconfig.json` is configured correctly
- **CORS issues**: CORS is already configured in the Express app
