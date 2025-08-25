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

# Steps to upgrade node.js and npm
Thanks for the info! You're currently running:

* **Node.js:** v19.9.0 ❌ *(unsupported for many packages)*
* **NPM:** 9.6.3 ✅

You also have Node and NPM installed globally in `/usr/bin/`, which means they were likely installed via **apt** or a **manual installation**, not via **nvm**.

---

### ✅ Goal: Upgrade to Node.js **v20** or **v22** (LTS version)

You have **two main options**. I’ll walk you through the most reliable one:

---

## ✅ Option 1: Use NVM (Recommended – Safe and Flexible)

NVM (Node Version Manager) allows you to install and switch between Node versions easily **without messing with your system files**.

### 🔧 Step-by-Step: Install NVM and Node v20

1. **Install NVM**:
   Run this in your terminal:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   ```

2. **Restart your terminal**, then confirm it's installed:

   ```bash
   command -v nvm
   ```

   It should return `nvm`.

3. **Install Node.js v20**:

   ```bash
   nvm install 20
   ```

4. **Use Node v20** for your current terminal session:

   ```bash
   nvm use 20
   ```

5. **(Optional)** Make Node v20 your default globally:

   ```bash
   nvm alias default 20
   ```

6. **Verify**:

   ```bash
   node -v   # should show v20.x.x
   npm -v    # updated version depending on Node version
   ```

---

## ⚠️ Option 2: Remove System Node.js & Install LTS from NodeSource

If you **don’t want to use NVM**, you can replace your system Node.js — but this is riskier and can break other packages.

Would you like help with this method too, or should we proceed with the safer NVM approach?


# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


