/* Elegant hostname viewer for Kubernetes pods */
const express = require('express');
const os       = require('os');

const app  = express();
const PORT = process.env.PORT || 80;

/* Main route */
app.get('/', (_, res) => {
  const hostname = os.hostname();              // ← Pod name in k8s
  res.type('html').send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>Pod ${hostname}</title>
    <link href="/style.css" rel="stylesheet"/>
  </head>
  <body>
    <main>
      <h1>Welcome, Kubernetes explorer!</h1>
      <p>This pod’s hostname is</p>
      <code>${hostname}</code>
    </main>
    <footer>Served from a Kubernetes cluster – Node ${process.version}</footer>
  </body>
  </html>`);
});

/* Static CSS (single file, zero build tools) */
app.get('/style.css', (_, res) => {
  res.type('text/css').send(`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    :root      { --bg1:#667eea; --bg2:#764ba2; --accent:#fff; }
    *          { margin:0; box-sizing:border-box; font-family:Inter,system-ui,sans-serif;}
    body       { min-height:100vh; display:grid; place-items:center;
                 background:linear-gradient(135deg,var(--bg1),var(--bg2)); color:var(--accent); }
    main       { text-align:center; backdrop-filter:blur(6px);
                 background-color:rgba(0,0,0,.35); padding:2.5rem 3rem; border-radius:1rem; }
    h1         { font-size:2rem; letter-spacing:.04em; margin-bottom:.75rem; }
    p          { opacity:.85; margin-bottom:1rem; }
    code       { display:inline-block; font-size:1.3rem; padding:.4rem .8rem;
                 background:var(--accent); color:var(--bg2); border-radius:.5rem; user-select:all; }
    footer     { margin-top:1.5rem; font-size:.8rem; opacity:.7; }
  `);
});

app.listen(PORT, () => console.log(`🚀  Listening on ${PORT}`));
