const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = process.env.PORT || 5003;

// Serve static files from the Vue.js build folder
app.use(express.static(path.join(__dirname, './dist')));


app.use('/api', createProxyMiddleware({
    target: 'https://cmsapi.luckyluy.net',
    changeOrigin: true,
}));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});