require("dotenv").config();
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const connectDB = require("./config/db");
const routes = require("./routes/route");
//body-parse
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// cookie parser
app.use(cookieParser());

// cors
// var whitelist = [
//   "http://localhost:3000",
// ];
// var corsOptions = {
//   origin: function (origin, callback) {
//     console.log(origin);
//     if (!origin || whitelist.indexOf(origin) === -1) {
//       return callback(new Error('Not allowed by CORS'));
//     } else {
//       return callback(null, true);
//     }
//   }
// }

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Init Middleware
app.use(express.json({ extended: false }));
app.use(express.json());

// database connection
connectDB();

// routers
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Hello ControlX!");
});

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
