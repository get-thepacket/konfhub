const express = require("express");
const routes = require("./route");
const app = express();
const PORT = 4000;

app.use(express.json());
app.use("/allConferences", routes);

app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
