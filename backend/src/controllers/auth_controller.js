const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey =
  "5ae071133feaf93f700f83e862f303d838ec60e1803dc4d99b1d9d1ee82966c4cb53cb72d51c3764d0154909ed5a43d089365116c0489a540ef3f6903b07ad61";
const { db } = require("../models");

const forbiddenRoutesForParent = [
  { method: "GET", path: "/admin" },
  { method: "GET", path: "/parent/:id" },
];

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function generateToken(user) {
  const { password, ...userWithoutPassword } = user;
  return jwt.sign(userWithoutPassword, secretKey, { expiresIn: "1h" });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (user.isParent) {
      const isForbidden = forbiddenRoutesForParent.some(
        (route) =>
          route.method === req.method && req.path.startsWith(route.path)
      );
      if (isForbidden) {
        return res.status(403).json({ error: "Forbidden" });
      }
    }
    req.user = user;
    next();
  });
}

class AuthController {
  static async getConnected(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Missing email or password" });
      return;
    }

    let user = await db.Parent.findOne({ where: { email } });

    if (!user) {
      user = await db.Administrator.findOne({ where: { email } });
    } else {
      user.isParent = "true";
    }

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    console.log(user);
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    console.log(isPasswordValid);
    if (isPasswordValid) {
      const token = generateToken(user);
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  }

  static async getDisconnected(req, res) {
    res.status(204).send();
  }
}

module.exports = { AuthController, authenticateToken, hashPassword };
