# Running the Big Five Test App

## ✅ Solution Implemented

This app is now configured to run on **port 5174** to avoid conflicts with other local apps.

## Quick Start

### Option 1: Use the Helper Script (Recommended)
```bash
./dev-helper.sh
```
This will:
- Kill any existing process on port 5174
- Start the dev server
- Auto-open your browser

### Option 2: Standard Command
```bash
npm run dev
```
The app will open at: **http://localhost:5174**

---

## Troubleshooting: Wrong App Showing?

### Immediate Fixes:

1. **Hard Reload Browser**
   - **Chrome/Edge**: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
   - **Firefox**: `Cmd + Shift + R` (Mac) or `Ctrl + F5` (Windows)
   - **Safari**: `Cmd + Option + R`

2. **Clear Cache & Reload**
   - Open DevTools (`Cmd/Ctrl + Shift + I`)
   - Right-click the reload button
   - Select "Empty Cache and Hard Reload"

3. **Kill Existing Dev Servers**
   ```bash
   # Find what's running on port 5174
   lsof -i :5174

   # Kill it
   lsof -ti:5174 | xargs kill -9

   # Then start fresh
   npm run dev
   ```

4. **Check Which App Is Actually Running**
   - Look at the terminal output - it shows the project path
   - Check the browser tab title
   - Open DevTools → Console and type: `window.location.href`

---

## Best Practices for Multiple Local Apps

### 1. Assign Unique Ports to Each Project

Edit `vite.config.ts` in each project:

```typescript
export default defineConfig({
  server: {
    port: 5174, // Change this for each project
    strictPort: true, // Fail if port is busy
    open: true, // Auto-open browser
  },
})
```

**Suggested Port Assignments:**
- Project A: 5173 (default)
- Project B (Big Five Test): 5174
- Project C: 5175
- Project D: 5176

### 2. Use Process Management

Install `npm-run-all` globally:
```bash
npm install -g npm-run-all
```

Create project-specific package.json scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "dev:clean": "lsof -ti:5174 | xargs kill -9 2>/dev/null; npm run dev"
  }
}
```

### 3. Browser Bookmarks

Create bookmarks for each project:
- `http://localhost:5173` → Project A
- `http://localhost:5174` → Big Five Test
- `http://localhost:5175` → Project C

### 4. Terminal Session Management

Use **tmux** or **iTerm2** tabs to keep each dev server in its own session with clear labels.

---

## Verification Checklist

Before assuming the wrong app is showing:

- [ ] Check terminal - is it running from the correct directory?
- [ ] Look at terminal output - does it show the right project path?
- [ ] Check browser URL - is it the right port?
- [ ] Check browser title - does it match the expected app?
- [ ] Hard reload (Cmd+Shift+R)
- [ ] Check if multiple dev servers are running: `lsof -i :5173 && lsof -i :5174`

---

## Emergency: Kill All Node Processes

If you have multiple dev servers running and aren't sure which is which:

```bash
# Find all node processes
ps aux | grep node

# Kill all node processes (nuclear option!)
pkill -9 node

# Then restart the one you want
npm run dev
```

---

## This Project's Configuration

- **Port**: 5174
- **URL**: http://localhost:5174
- **Auto-open**: Yes
- **Strict Port**: Yes (will fail if 5174 is busy instead of using a different port)
