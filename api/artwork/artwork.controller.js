const artworkService = require('./artwork.service')

async function getArtwork(req, res) {
    const artwork = await artworkService.getById(req.params.id)
    res.send(artwork)
}

async function getArtworks(req, res) {
    console.log(req.query, 'inside artowork controller....');
    const artworks = await artworkService.query(req.query)
    res.send(artworks)
}

async function deleteArtwork(req, res) {
    console.log('DELETE ', req.body)
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
    await artworkService.add(artwork)
    res.send(artwork)
}

module.exports = {
    getArtwork,
    getArtworks,
    deleteArtwork,
    updateArtwork,
    addArtwork
}