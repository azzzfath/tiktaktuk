const venueRepository = require("../repositories/venueRepository");
const { createHttpError } = require("../utils/httpError");

function validateVenue(body) {
  if (!body.venue_name?.trim()) throw createHttpError(400, "Nama venue wajib diisi");
  if (!Number(body.capacity) || Number(body.capacity) <= 0) {
    throw createHttpError(400, "Kapasitas harus lebih dari 0");
  }
  if (!body.address?.trim()) throw createHttpError(400, "Alamat wajib diisi");
  if (!body.city?.trim()) throw createHttpError(400, "Kota wajib diisi");
}

async function listVenues(req, res, next) {
  try {
    res.json({ data: await venueRepository.listVenues() });
  } catch (error) {
    next(error);
  }
}

async function createVenue(req, res, next) {
  try {
    validateVenue(req.body);
    const venue = await venueRepository.createVenue(req.body);
    res.status(201).json({ data: venue });
  } catch (error) {
    next(error);
  }
}

async function updateVenue(req, res, next) {
  try {
    validateVenue(req.body);
    const venue = await venueRepository.updateVenue(req.params.id, req.body);
    if (!venue) throw createHttpError(404, "Venue tidak ditemukan");
    res.json({ data: venue });
  } catch (error) {
    next(error);
  }
}

async function deleteVenue(req, res, next) {
  try {
    const venue = await venueRepository.deleteVenue(req.params.id);
    if (!venue) throw createHttpError(404, "Venue tidak ditemukan");
    res.json({ data: venue });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listVenues,
  createVenue,
  updateVenue,
  deleteVenue,
};
