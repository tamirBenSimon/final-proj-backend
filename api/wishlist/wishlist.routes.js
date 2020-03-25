const express = require('express')
    // const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const { addWishlist, getWishlist, deleteWishlist } = require('./wishlist.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/:id', getWishlist)
router.put('/:id', addWishlist)
    // router.put('/:id',  requireAuth, updateUser)
router.delete('/', deleteWishlist)

module.exports = router