const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const upload = require('../middlewares/booksUpload');

const {
  uploadbooks,
  getbooksall,
  getbooksuser,
  updatebooks,
  deletebooks,
} = require('../controllers/booksContoller')

router.post('/uploadbooks', auth, upload.array('images', 6), uploadbooks);
router.post('/getbooksall', auth, getbooksall);
router.get('/getbooksuser', auth, getbooksuser);
router.put('/updatebooks', auth, upload.array('images', 6), updatebooks);
router.delete('/deletebooks', auth, deletebooks);

module.exports = router;
