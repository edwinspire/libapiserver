const { createHmac } = await import("node:crypto");
import jwt from "jsonwebtoken";

const { JWT_KEY, EXPOSE_DEV_API, EXPOSE_QA_API, EXPOSE_PROD_API } = process.env;

const errors = {
  1: { code: 1, message: "You must enter the same password twice" },
  2: { code: 2, message: "Invalid credentials" },
};

export const defaultSystemPath = (/** @type {string} */ name) => {
  return "/system/main/" + name;
};

/**
 * @param {any} token
 */
export function checkToken(token) {
  try {
    // Verificar y decodificar el token
    const decodedToken = tokenVerify(token);
    // @ts-ignore
    return decodedToken;
  } catch (error) {
    return false;
  }
}

// Middleware para validar el token
/**
 * @param {any} req
 * @param { any } res
 * @param {() => void} next
 */
export function validateToken(req, res, next) {
  // Obtener el token del encabezado de autorización
  // @ts-ignore
  const token = req.headers["api-token"];

  // Verificar si se proporcionó un token
  if (!token) {
    return res.status(401).json({ error: "Token not found" });
  }

  let data = checkToken(token);

  if (data) {
    next();
  } else {
    return res.status(401).json({ error: "Token invalid" });
  }
}

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
  return createHmac("sha256", JWT_KEY || "9999999999")
    .update(pwd)
    .digest("hex");
}

/**
 * @param {any} data
 */
export function GenToken(data) {
  console.log("GenToken > ", data);
  // Genera un Token
  return jwt.sign(
    { data: data, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
    JWT_KEY || "9999999999"
  );
}

/**
 * @param {any} token
 */
export function tokenVerify(token) {
  return jwt.verify(token, JWT_KEY || "9999999999");
}
