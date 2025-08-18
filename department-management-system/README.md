# steps to install node.js and npm
```bash
# Verify installation exist already
node -v
npm -v

# 1. Download and run NodeSource setup script for Node.js 20.x (latest stable)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# 2. Install Node.js and npm
sudo apt-get install -y nodejs

# 3. (Optional) Install build tools for compiling native addons
sudo apt-get install -y build-essential

# 4. Verify installation
node -v
npm -v

```

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


