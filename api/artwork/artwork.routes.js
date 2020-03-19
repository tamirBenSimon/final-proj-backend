const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getArtwork, getArtworks, deleteArtwork, updateArtwork} = require('./artwork.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getArtworks)
router.get('/:id', getArtwork)
router.put('/:id',  requireAuth, updateArtwork)
router.delete('/:id',  requireAuth, requireAdmin, deleteArtwork)

module.exports = router