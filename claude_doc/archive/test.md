# How to Open nback-touchscreen-standalone.html on iPad

## Method 1: Local Wi-Fi Server (Recommended — fastest, no internet needed)

Both your Mac and iPad must be on the **same Wi-Fi network**.

### Step 1 — Start a local web server on your Mac

Open Terminal and run:

```bash
cd /Users/Hades-611-Yang/Documents/PhD/MCMC/n-back
python3 -m http.server 8080
```

You should see:
```
Serving HTTP on 0.0.0.0 port 8080 ...
```

Keep this Terminal window open while testing.

### Step 2 — Find your Mac's local IP address

In a **second** Terminal tab, run:

```bash
ipconfig getifaddr en0
```

This prints something like `192.168.1.42`. That is your Mac's IP on the local network.
(If blank, try `en1` instead: `ipconfig getifaddr en1`)

### Step 3 — Open on iPad Safari

On the iPad, open **Safari** and type in the address bar:

```
http://192.168.1.42:8080/nback-touchscreen-standalone.html
```

Replace `192.168.1.42` with your actual IP from Step 2.

### Step 4 — Stop the server when done

Back in Terminal, press `Ctrl + C` to stop the server.

---

## Method 2: AirDrop the file directly to iPad

This works if you don't want to run a server, but requires a few extra taps on the iPad.

1. In Finder on your Mac, right-click `nback-touchscreen-standalone.html`
2. Choose **Share → AirDrop** and send it to your iPad
3. On the iPad, when the AirDrop prompt appears, tap **Accept**
4. The file lands in the **Files** app (Downloads folder)
5. Open the **Files** app → find the file → tap it
6. Tap **Open in Safari** (or long-press → Share → Open in Safari)

> **Note:** Safari on iPad can open local HTML files this way, but some browser security restrictions may block IndexedDB (the trial data storage). Method 1 avoids this entirely.

---

## Method 3: ngrok (access from anywhere, any network)

Use this if your Mac and iPad are on **different networks** (e.g., lab Mac, personal iPad on cellular).

1. Install ngrok: https://ngrok.com/download
2. Start the local server (same as Method 1, Step 1)
3. In a second Terminal tab:
   ```bash
   ngrok http 8080
   ```
4. ngrok prints a public URL like `https://a1b2c3d4.ngrok.io`
5. Open that URL in iPad Safari — works from anywhere

---

## Recommended iPad Safari Settings

Before running the experiment, adjust these in iPad **Settings → Safari**:

| Setting | Value | Why |
|---------|-------|-----|
| Auto-Lock | **Never** (Settings → Display) | Prevents screen sleeping mid-task |
| Guided Access | **On** (Settings → Accessibility) | Locks iPad into Safari so participants can't exit |
| Pop-up Blocking | Off (optional) | Avoids blocking any alerts |

### Enable Guided Access (optional but useful for research)

1. Settings → Accessibility → Guided Access → turn **On**
2. Set a passcode
3. Open Safari with the task URL
4. Triple-click the **Side button** (or Home button)
5. Tap **Start** — the iPad is now locked to the task screen
6. Triple-click again + enter passcode to exit after the session

---

## Quick Start Checklist

- [ ] Mac and iPad on the same Wi-Fi
- [ ] Run `python3 -m http.server 8080` in the n-back folder on Mac
- [ ] Get Mac IP: `ipconfig getifaddr en0`
- [ ] Open `http://<mac-ip>:8080/nback-touchscreen-standalone.html` in iPad Safari
- [ ] Set iPad Auto-Lock to Never
- [ ] Enable Guided Access if running with participants
