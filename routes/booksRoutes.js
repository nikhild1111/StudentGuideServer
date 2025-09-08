const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const upload = require('../middlewares/booksUpload');
const checkOwnership=require('../middlewares/checkOwnership')
const {
  uploadbooks,
  getbooksall,
  getbooksuser,
  updatebooks,
  deletebooks,
} = require('../controllers/booksContoller')

router.post('/uploadbooks', auth, upload.array('images', 6), uploadbooks);
router.post('/getbooksall', getbooksall);
router.get('/getbooksuser', auth, getbooksuser);
router.put('/updatebooks', auth,checkOwnership("book"), upload.array('images', 6), updatebooks);
router.delete('/deletebooks', auth,checkOwnership("book"), deletebooks);

module.exports = router;
