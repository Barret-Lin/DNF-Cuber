import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.set('trust proxy', 1);

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // WCA OAuth endpoints
  app.get("/api/auth/wca/url", (req, res) => {
    const clientId = process.env.WCA_CLIENT_ID;
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    const redirectUri = process.env.WCA_REDIRECT_URI || `${baseUrl}/auth/callback`;
    
    if (!clientId) {
      return res.status(500).json({ error: "WCA_CLIENT_ID is not configured" });
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "public",
    });

    const authUrl = `https://www.worldcubeassociation.org/oauth/authorize?${params}`;
    res.json({ url: authUrl });
  });

  app.get("/auth/callback", async (req, res) => {
    const { code } = req.query;
    const clientId = process.env.WCA_CLIENT_ID;
    const clientSecret = process.env.WCA_CLIENT_SECRET;
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    const redirectUri = process.env.WCA_REDIRECT_URI || `${baseUrl}/auth/callback`;

    if (!code) {
      return res.status(400).send("Missing code parameter");
    }

    try {
      const tokenResponse = await fetch("https://www.worldcubeassociation.org/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code,
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text();
        console.error("Token exchange failed:", errorData);
        throw new Error("Failed to exchange code for token");
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Send success message to parent window and close popup
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'WCA_AUTH_SUCCESS', token: '${accessToken}' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
