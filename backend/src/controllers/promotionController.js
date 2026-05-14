const promotionRepository = require("../repositories/promotionRepository");
const { createHttpError } = require("../utils/httpError");

const allowedTypes = new Set(["PERCENTAGE", "NOMINAL"]);

function validatePromotion(body) {
  if (!body.code?.trim()) throw createHttpError(400, "Kode promo wajib diisi");
  if (!allowedTypes.has(body.type)) throw createHttpError(400, "Tipe diskon tidak valid");
  if (!Number(body.value) || Number(body.value) <= 0) {
    throw createHttpError(400, "Nilai diskon harus lebih dari 0");
  }
  if (!body.startDate || !body.endDate) throw createHttpError(400, "Tanggal promo wajib diisi");
  if (body.endDate < body.startDate) {
    throw createHttpError(400, "Tanggal berakhir harus setelah tanggal mulai");
  }
  if (!Number(body.usageLimit) || Number(body.usageLimit) <= 0) {
    throw createHttpError(400, "Batas penggunaan harus lebih dari 0");
  }
}

async function listPromotions(req, res, next) {
  try {
    res.json({ data: await promotionRepository.listPromotions() });
  } catch (error) {
    next(error);
  }
}

async function validateCode(req, res, next) {
  try {
    const promotion = await promotionRepository.findPromotionByCode(req.params.code, undefined, true);
    if (!promotion) throw createHttpError(404, "Kode promo tidak valid");
    res.json({ data: promotionRepository.mapPromotion(promotion) });
  } catch (error) {
    next(error);
  }
}

async function createPromotion(req, res, next) {
  try {
    validatePromotion(req.body);
    const promotion = await promotionRepository.createPromotion(req.body, req.user.id);
    res.status(201).json({ data: promotion });
  } catch (error) {
    next(error);
  }
}

async function updatePromotion(req, res, next) {
  try {
    validatePromotion(req.body);
    const promotion = await promotionRepository.updatePromotion(req.params.id, req.body);
    if (!promotion) throw createHttpError(404, "Promo tidak ditemukan");
    res.json({ data: promotion });
  } catch (error) {
    next(error);
  }
}

async function deletePromotion(req, res, next) {
  try {
    const promotion = await promotionRepository.deletePromotion(req.params.id);
    if (!promotion) throw createHttpError(404, "Promo tidak ditemukan");
    res.json({ data: promotion });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listPromotions,
  validateCode,
  createPromotion,
  updatePromotion,
  deletePromotion,
};
