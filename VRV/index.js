const express = require("express");
const mongoose = require("mongoose");
const PORT = 8000;
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

const app = express();
app.use(express.json());
mongoose
  .connect("mongodb://localhost:27017/vrv")
  .then(console.log("Connected to DB"))
  .catch((error) => console.log(error));

app.use("/user", userRoute);
app.use("/admin", adminRoute);

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
