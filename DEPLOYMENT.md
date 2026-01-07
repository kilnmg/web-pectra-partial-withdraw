# Vercel Deployment Guide

This guide will help you deploy the Pectra Validator Withdrawal application to Vercel.

## Prerequisites

- [Vercel Account](https://vercel.com/signup) (free tier works)
- [GitHub](https://github.com) repository (recommended for automatic deployments)
- Kiln API keys from [kiln.fi](https://kiln.fi)

## Quick Deploy to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Vercel will auto-detect SvelteKit settings

3. **Configure Environment Variables** (see below)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables** (see below)

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variables Configuration

You **must** configure these environment variables in Vercel for the app to work:

### Required Variables

| Variable | Value | How to Get |
|----------|-------|------------|
| `KILN_API_KEY` | Your Kiln mainnet API key | Sign up at [kiln.fi](https://kiln.fi) |

### Optional Variables

| Variable | Value | How to Get |
|----------|-------|------------|
| `KILN_TESTNET_API_KEY` | Your Kiln testnet API key | Same as above (for Hoodi testnet support) |

### How to Add Environment Variables in Vercel

#### Via Vercel Dashboard

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: `KILN_API_KEY`
   - **Value**: Your API key from Kiln
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your application for changes to take effect

#### Via Vercel CLI

```bash
vercel env add KILN_API_KEY production
# Paste your API key when prompted

vercel env add KILN_TESTNET_API_KEY production
# Paste your testnet API key when prompted
```

Then redeploy:
```bash
vercel --prod
```

## Vercel Configuration

The application is already configured for Vercel deployment:

✅ **SvelteKit Adapter**: Using `@sveltejs/adapter-auto` (auto-detects Vercel)
✅ **Build Command**: `vite build` (defined in package.json)
✅ **Node.js Version**: 18+ (specified in package.json engines)
✅ **Output Directory**: Auto-detected by SvelteKit
✅ **Install Command**: `npm install` (default)

### Build Settings (Vercel Dashboard)

Vercel should auto-detect these, but verify:

- **Framework Preset**: SvelteKit
- **Build Command**: `npm run build` (or leave blank for auto-detect)
- **Output Directory**: `.svelte-kit` (auto-detected)
- **Install Command**: `npm install` (auto-detected)
- **Node.js Version**: 18.x (from package.json engines field)

## Post-Deployment Checklist

After deployment, verify the following:

### 1. Application Loads
- Visit your Vercel URL
- Check that the homepage loads correctly
- Verify styling appears correctly

### 2. Wallet Connection Works
- Click "Connect Wallet"
- Connect MetaMask or Coinbase Wallet
- Verify wallet address displays

### 3. Validator Data Loads
- Connect wallet with validators
- Check that validators appear in the list
- Verify balance information displays

### 4. API Routes Work
- Open browser DevTools → Network tab
- Look for `/api/validators` request
- Should return 200 status with validator data

### 5. Error Handling
- Try connecting wallet without validators
- Should show "No Validators Found" message
- Switch to unsupported network → should show network error

## Troubleshooting

### Build Failures

**Error: Missing environment variables**
- Solution: Add `KILN_API_KEY` in Vercel environment variables
- Make sure to redeploy after adding variables

**Error: Node.js version mismatch**
- Solution: Ensure Node.js 18+ is specified in Vercel settings
- Check package.json has `"engines": {"node": ">=18.0.0"}`

**Error: Module not found**
- Solution: Run `npm install` locally to ensure package-lock.json is correct
- Commit and push changes

### Runtime Errors

**Error: "KILN_API_KEY not configured"**
- Solution: Add environment variable in Vercel dashboard
- Redeploy after adding

**Error: CORS issues**
- Solution: This shouldn't happen as API routes are server-side
- If it does, check that you're using `/api/validators` route

**Error: Wallet won't connect**
- Solution: Check browser console for errors
- Ensure MetaMask or Coinbase Wallet extension is installed
- Try clearing cache and reloading

### No Validators Showing

**Possible causes:**
1. Wrong wallet connected (doesn't control validators)
2. API key is invalid or expired
3. Network issues with Kiln API

**Solutions:**
- Verify API key in Vercel environment variables
- Check Vercel function logs for API errors
- Test with example address: `0x02D50e49e11Fef1CA36660113b53fc5494DB7c2f`

## Monitoring & Logs

### View Deployment Logs
1. Go to Vercel dashboard → Your project
2. Click on latest deployment
3. View "Building" and "Functions" logs

### View Runtime Logs
1. Vercel dashboard → Your project
2. Click "Functions" tab
3. Select `/api/validators` function
4. View real-time logs

### Enable Analytics (Optional)
1. Vercel dashboard → Your project
2. Go to "Analytics" tab
3. Enable Web Analytics (free tier: 10k pageviews/month)

## Custom Domain (Optional)

### Add Custom Domain

1. **Purchase Domain** (from Namecheap, Google Domains, etc.)

2. **Add Domain in Vercel**
   - Vercel dashboard → Your project → Settings → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., `validator-withdrawal.com`)

3. **Configure DNS**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or update nameservers to Vercel's

4. **SSL Certificate**
   - Vercel automatically provisions SSL (Let's Encrypt)
   - No manual configuration needed

## Performance Optimization

The application is already optimized for production:

✅ **Server-Side Rendering (SSR)**: Fast initial page load
✅ **Code Splitting**: Automatic chunking by SvelteKit
✅ **Edge Functions**: API routes run on Vercel Edge Network
✅ **Caching**: Static assets cached automatically

### Optional Optimizations

**1. Enable Vercel Speed Insights**
```bash
npm install @vercel/speed-insights
```

**2. Image Optimization**
- Already minimal (only SVG icons used)
- No heavy images to optimize

**3. Function Region**
- By default, functions run globally
- Can specify region in `vercel.json` if needed:
```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

## Security Considerations

✅ **Environment Variables**: Securely stored in Vercel
✅ **API Keys**: Never exposed to client (server-side only)
✅ **HTTPS**: Enforced automatically by Vercel
✅ **CORS**: Not needed (same-origin API routes)

### Additional Security

**Content Security Policy (Optional)**

Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## Continuous Deployment

With GitHub integration, deployments are automatic:

- **Push to `main` branch** → Deploys to production
- **Push to other branch** → Creates preview deployment
- **Pull Request** → Generates preview URL for testing

### Branch Protection (Recommended)

1. Enable branch protection on `main` in GitHub
2. Require status checks before merging
3. Test on preview URL before merging to main

## Cost Estimates

**Vercel Free Tier includes:**
- Unlimited personal projects
- 100GB bandwidth per month
- Serverless Function execution
- Automatic SSL certificates
- Preview deployments

**Typical usage for this app:**
- ~1-5 GB bandwidth per month (low traffic)
- Minimal function execution time
- **Expected cost: $0/month** (stays within free tier)

For higher traffic, check [Vercel Pricing](https://vercel.com/pricing).

## Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review [SvelteKit Deployment Guide](https://kit.svelte.dev/docs/adapter-vercel)
3. Check function logs in Vercel dashboard
4. Open an issue on GitHub repository

## Next Steps After Deployment

1. ✅ Test all functionality on production URL
2. ✅ Share URL with team/users
3. ✅ Set up custom domain (optional)
4. ✅ Enable Vercel Analytics (optional)
5. ✅ Monitor function logs for errors
6. ✅ Update README with production URL

---

**Deployment Complete!** 🚀

Your Pectra Validator Withdrawal application is now live on Vercel.
