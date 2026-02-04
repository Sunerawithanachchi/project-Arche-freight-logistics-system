const userService = require("../services/userService");
const { generateToken } = require("../utils/token");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // requirement 5: missing user fields -> 400
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Missing required field: name,email or password" });
    }

    const newUser = await userService.createUser({ name, email, password });
    const token = generateToken(newUser.id);

    // requirement 2: returns user_id and a signed JWT
    res.status(201).json({
      user_id: newUser.id,
      token: token,
    });
  } catch (err) {
    next(err); // pass to global error handler (handles 503)
  }
};

module.exports = { register };
