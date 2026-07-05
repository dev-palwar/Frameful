# Cutline

Cutline is a video editor and screen recorder designed for seamless zooming and professional exports.

## Self hosting the Cutline - Auto-Zoom Extension

The Cutline Auto-Zoom extension is a JavaScript extension located in the `extension/` directory. It requires no build step.

### 1. Package the Extension
To package the extension for the Chrome Web Store, zip the **contents** of the `extension` directory (not the directory itself).
You can run this command from the root of the project:
```bash
cd extension && zip -r ../cutline-extension.zip *
```
This will create a `cutline-extension.zip` file in your project root.

### 2. Upload to Chrome Web Store
1. Go to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole/).
2. Click **Add new item** (or update your existing item).
3. Upload the `cutline-extension.zip` file.
4. Fill out your store listing (Privacy Policy, Description, Screenshots, etc.).
5. Submit for review!

### 3. Update the Environment Variable
Once your extension is uploaded to the dashboard, it will be assigned a permanent **Extension ID** (a long string of lowercase letters).
For the web application to communicate with it, you must add this ID to your environment variables:
1. Open your `.env` (or `.env.local`) file.
2. Add or update the following line:
   ```env
   VITE_EXTENSION_ID="your_assigned_extension_id"
   ```
3. Rebuild and deploy your web application.

---