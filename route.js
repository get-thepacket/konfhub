const router = require("express").Router();
const { json } = require("express");
const request = require("superagent");

const uri =
  "https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences";

/**endpoint : /rawall
 * method : GET
 * request parameters : None
 * response : All the conferences as JSON
 */
router.get("/rawall", async (req, res) => {
  try {
    const response = await request.get(uri);

    const json_response = JSON.parse(response.text);

    res.json(json_response);
  } catch (err) {
    res.json(err);
  }
});

/**endpoint : /duplicates
 * method : GET
 * request parameters : None
 * response : All the duplicate conferences as JSON
 */
router.get("/duplicates", async (req, res) => {
  try {
    const response = await request.get(uri);

    //variable declarations
    const json_response = JSON.parse(response.text);
    let paid_array = json_response.paid;
    let free_array = json_response.free;
    let paid_map = new Map();
    let free_map = new Map();
    let duplicates = [];

    //looping over the paid conferences list
    paid_array.forEach((x) => {
      let key = {
        lat: x.lat,
        long: x.long,
        start: x.confStartDate,
        end: x.confEndDate,
      };

      //checking if there is a similar entity in map
      if (paid_map.has(key)) duplicates.push(x);
      paid_map.set(key, x);
    });

    //loooping over the free conferences list
    free_array.forEach((x) => {
      let key = {
        lat: x.lat,
        long: x.long,
        start: x.confStartDate,
        end: x.confEndDate,
      };

      //checking if there is a similar entity in map
      if (free_map.has(key)) duplicates.push(x);
      free_map.set(key, x);
    });

    res.json({ duplicate: duplicates });
  } catch (err) {
    res.json(err);
  }
});

/**endpoint : /free
 * method : GET
 * request parameters : None
 * response : All the free conferences as JSON
 */
router.get("/free", async (req, res) => {
  try {
    const response = await request.get(uri);
    const json_response = JSON.parse(response.text);
    const free = json_response.free;

    res.json(free);
  } catch (err) {
    res.json(err);
  }
});

/**endpoint : /paid
 * method : GET
 * request parameters : None
 * response : All the paid conferences as JSON
 */
router.get("/paid", async (req, res) => {
  try {
    const response = await request.get(uri);
    const json_response = JSON.parse(response.text);
    const paid = json_response.paid;

    res.json(paid);
  } catch (err) {
    res.json(err);
  }
});

/**endpoint : /unique
 * method : GET
 * request parameters : None
 * response : All the unique conferences as JSON.
 *            it will have two properties free and paid
 *            to categorise between the two
 */
router.get("/unique", async (req, res) => {
  try {
    const response = await request.get(uri);

    //variable declarations
    const json_response = JSON.parse(response.text);
    let paid_array = json_response.paid;
    let free_array = json_response.free;
    let paid_map = new Map();
    let free_map = new Map();

    //looping over the paid conferences list
    paid_array.forEach((x) => {
      let key = {
        lat: x.lat,
        long: x.long,
        start: x.confStartDate,
        end: x.confEndDate,
      };

      paid_map.set(key, x);
    });

    //loooping over the free conferences list
    free_array.forEach((x) => {
      let key = {
        lat: x.lat,
        long: x.long,
        start: x.confStartDate,
        end: x.confEndDate,
      };

      free_map.set(key, x);
    });

    var result = {
      paid: [],
      free: [],
    };

    for (const v of paid_map.values()) {
      result.paid.push(v);
    }

    for (const v of free_map.values()) {
      result.free.push(v);
    }

    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

/**endpoint : /readable
 * method : GET
 * request parameters : None
 * response : array of human readable data of conferences
 *            making it easier to analyse.
 */

router.get("/readable", async (req, res) => {
  try {
    const response = await request(uri);
    const json_response = JSON.parse(response.text);
    //extracting two properties of the object
    const { paid, free } = json_response;
    let result = [];

    //a basic template for making data readable
    paid.forEach((x) => {
      result.push(
        `The conference ${x.confName} is being hosted on ${x.confStartDate} and will run till ${x.confEndDate} at ${x.venue}.`
      );
    });
    free.forEach((x) => {
      result.push(
        `The conference ${x.confName} is being hosted on ${x.confStartDate} and will run till ${x.confEndDate} at ${x.venue}.`
      );
    });
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
