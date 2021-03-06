import express from 'express';

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get('/', (req, res, _next) => {
  res.render('index', { page: 'home' });
});

router.get('/users', (req, res, next) => {
  res.render('index', { page: 'users' });
});

router.get('/doc', (req, res, next) => {
  res.render('index', { page: 'doc' });
});

router.get('/login', (req, res, next) => {
  res.render('index', { page: 'login' });
});

export = router;
