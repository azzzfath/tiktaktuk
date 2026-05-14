const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const { createHttpError } = require("../utils/httpError");

const allowedRoles = new Set(["customer", "organizer", "admin"]);

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function validateAuthPayload({ username, password, role }, isRegister) {
  if (!username?.trim()) throw createHttpError(400, "Username wajib diisi");
  if (!password || password.length < 6) {
    throw createHttpError(400, "Password minimal 6 karakter");
  }
  if (isRegister && !allowedRoles.has(role)) {
    throw createHttpError(400, "Role tidak valid");
  }
}

async function register(payload) {
  validateAuthPayload(payload, true);
  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await userRepository.createUser({
    username: payload.username.trim(),
    passwordHash,
    role: payload.role,
    fullName: payload.fullName?.trim() || payload.username.trim(),
    email: payload.email?.trim() || null,
  });

  return {
    user,
    token: signToken(user),
  };
}

async function login({ username, password }) {
  validateAuthPayload({ username, password, role: "customer" }, false);
  const row = await userRepository.findUserWithPasswordByUsername(username.trim());
  if (!row) throw createHttpError(401, "Username atau password salah");

  const validPassword = row.password?.startsWith("$2")
    ? await bcrypt.compare(password, row.password)
    : password === row.password;
  if (!validPassword) throw createHttpError(401, "Username atau password salah");

  const user = userRepository.mapUser(row);
  return {
    user,
    token: signToken(user),
  };
}

module.exports = {
  register,
  login,
};
