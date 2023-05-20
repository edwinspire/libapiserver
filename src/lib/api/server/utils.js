const { createHmac } = await import("node:crypto");
import jwt from "jsonwebtoken";
const { SECRET_KEY } = process.env;

const errors = {
  1: { code: 1, message: "You must enter the same password twice" },
  2: { code: 2, message: "Invalid credentials" },
};

/**
 * @param {number} code
 * @param {string | any | undefined} [message]
 */
export function customError(code, message) {
  // @ts-ignore
  if (errors[code]) {
    // @ts-ignore
    let e = { ...errors[code] };
    e.message = message && message.length > 0 ? message : e.message;
    return e;
  } else {
    return { errors: code, message: message };
  }
}

/**
 * @param {import("crypto").BinaryLike} pwd
 */
export function EncryptPwd(pwd) {
  return createHmac("sha256", SECRET_KEY || "9999999999")
    .update(pwd)
    .digest("hex");
}

/**
 * @param {any} data
 */
export function GenToken(data) {
  // Genera un Token
  return jwt.sign(
    { data: data, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
    SECRET_KEY || "9999999999"
  );
}

/**
 * @param {any} token
 */
export function tokenVerify(token) {
  return jwt.verify(token, SECRET_KEY || "9999999999");
}
