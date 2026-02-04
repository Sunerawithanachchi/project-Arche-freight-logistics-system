const authService = require("../services/authService");
const tokenUtil = require("../utils/token");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //missing credentials check

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await authService.authenticate(email, password);

    // generic error for both "not found" and "wrong password"

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // success : issue the same JWT we used in the registration flow

    const token = tokenUtil.generateToken(user.id);
    res.json({ user_id: user.id, token });
  } catch (err) {
    //if db is down
    next(err);
  }
};

module.exports = { login };
