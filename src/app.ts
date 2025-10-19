// import cors from "cors";
// import express from "express";
// // import rateLimit from "express-rate-limit";

// const app = express();
// app.use(cors());
// app.use(express.json());

// // const limiter = rateLimit({
// //   windowMs: 1 * 60 * 1000, //(1 min)
// //   max: 100,
// //   message: "Too many requests, please try again later",
// // });
// // app.use(limiter);

// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// app.listen(4000, () =>
//   console.log("server is running on http://localhost:4000")
// );

import cors from "cors";
import express from "express";
import router from "./router";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const corsOption = {
  origin: true,
  credentials: true,
  accessControlAllowOrigin: true,
};

app.use(cors(corsOption));

app.use("/api/v1", router);

export default app;
