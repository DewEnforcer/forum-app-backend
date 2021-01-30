const express = require("express");
const app = express();

require("express-async-errors");
require("./startup/cors")(app);
require("./startup/config")();
require("./startup/db")();
require("./startup/routes")(app);

app.listen(4000, () => console.log("Listening on port 4000"))