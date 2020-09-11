const { Router } = require('express');
const router = new Router();

router.get('/about', (req, res) => res.render('about/about.hbs'));

module.exports = router;
