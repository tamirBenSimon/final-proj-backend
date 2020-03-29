const artworkService = require('./artwork.service')

async function getArtwork(req, res) {
    const artwork = await artworkService.getById(req.params.id)
    res.send(artwork)
}

async function getArtworks(req, res) {
    const artworks = await artworkService.query(req.query)
    res.send(artworks)
}

async function deleteArtwork(req, res) {
    await artworkService.remove(req.params.id)
    res.end()
}

async function updateArtwork(req, res) {
    const artwork = req.body;
    await artworkService.update(artwork)
    res.send(artwork)
}
async function addArtwork(req, res) {
    const artwork = req.body;
    const resArtwork= await artworkService.add(artwork)
    res.send(resArtwork)
}

module.exports = {
    getArtwork,
    getArtworks,
    deleteArtwork,
    updateArtwork,
    addArtwork
}