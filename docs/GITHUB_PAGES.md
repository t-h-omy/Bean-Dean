# GitHub Pages Setup Guide

## Quick Start

The Garden Bean PWA is ready to be deployed on GitHub Pages!

### Option 1: Using /public Directory

1. Go to your repository Settings
2. Navigate to Pages section
3. Under "Source", select your branch (e.g., `main`)
4. Keep the directory as `/root`
5. Click Save
6. The game will be available at: `https://[username].github.io/[repo-name]/public/`

### Option 2: Using Root Directory (Recommended)

For a cleaner URL, you can move the contents of `/public` to the root and adjust import paths:

1. Move all files from `/public` to root
2. Update import paths in `main.js` to point to `./src/core/`
3. Configure GitHub Pages to serve from root
4. Game will be available at: `https://[username].github.io/[repo-name]/`

### Option 3: Using docs/ Directory

1. Copy all files from `/public` to `/docs`
2. Copy `/src` folder to `/docs/src`
3. Configure GitHub Pages to serve from `/docs`
4. Game will be available at: `https://[username].github.io/[repo-name]/`

## Verification

After deployment, verify:
- ✅ Page loads without errors
- ✅ All modules load correctly (check browser console)
- ✅ Service worker registers successfully
- ✅ Game is playable
- ✅ PWA can be installed

## Troubleshooting

### MIME Type Errors
If you see errors about JavaScript MIME types, ensure:
- Files have `.js` extension
- Server is configured to serve `.js` files with `application/javascript` MIME type
- GitHub Pages should handle this automatically

### Module Loading Errors
If modules fail to load:
- Check that import paths are correct (relative to HTML file location)
- Ensure all files are in the correct directories
- Verify that the browser supports ES6 modules

### Service Worker Issues
If the service worker doesn't register:
- Make sure you're accessing via HTTPS (GitHub Pages uses HTTPS automatically)
- Check the browser console for specific errors
- Verify `sw.js` is in the same directory as `index.html`

## Current Structure

```
/public/          # Main game files (serve this directory)
  index.html
  main.js
  style.css
  sw.js
  manifest.json
  
/src/core/        # Game modules (imported by main.js)
  *.js
  
/assets/          # Future assets
  /icons/
  /images/
```

## Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file to the `/public` directory with your domain
2. Configure your DNS provider to point to GitHub Pages
3. Enable HTTPS in repository settings

## Testing Locally

Before deploying, test locally:

```bash
# Using Python
cd /path/to/Bean-Dean
python3 -m http.server 8080
# Open http://localhost:8080/public/

# Using Node.js
npx http-server -p 8080
# Open http://localhost:8080/public/
```

## PWA Installation

Once deployed:
1. Visit the game in Chrome/Edge/Safari
2. Look for install prompt or menu option
3. Install as standalone app
4. Enjoy offline play!
