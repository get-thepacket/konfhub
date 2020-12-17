const router = require("express").Router();
const request = require("superagent");

router.get("/res", async (req, res) => {
  const response = await request.get(
    "https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences"
  );
  res.json(JSON.parse(response.text));
});

module.exports = router;
