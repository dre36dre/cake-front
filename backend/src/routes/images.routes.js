const express = require('express');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/upload', upload.single('file'), (req, res) => {
  const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  return res.type('text/plain').send(dataUrl);
});

module.exports = router;
