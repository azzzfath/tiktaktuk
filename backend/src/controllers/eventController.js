const eventRepository = require("../repositories/eventRepository");
const { createHttpError } = require("../utils/httpError");

async function listEvents(req, res, next) {
  try {
    res.json({ data: await eventRepository.listEvents() });
  } catch (error) {
    next(error);
  }
}

async function getEvent(req, res, next) {
  try {
    const event = await eventRepository.getEventById(req.params.id);
    if (!event) throw createHttpError(404, "Event tidak ditemukan");
    res.json({ data: event });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listEvents,
  getEvent,
};
