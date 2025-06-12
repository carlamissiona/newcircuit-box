const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const searchRoutes = require("./routes/searchRoutes");
const channelsRoutes = require("./routes/channelsRoutes");
const friendsRoutes = require("./routes/friendsRoutes");
const profileRoutes = require("./routes/profileRoutes");
const publisherRoutes = require("./routes/publisherRoutes");
const editorRoutes = require("./routes/editorRoutes");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", authRoutes);
app.use("/app", dashboardRoutes);
app.use("/search", searchRoutes);
app.use("/channels", channelsRoutes);
app.use("/publisher", publisherRoutes);
app.use("/editor", editorRoutes);

app.use("/micro", dashboardRoutes);
app.use("/friends", friendsRoutes);
app.use("/myprofile", profileRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("index", { title: "Express Auth App" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

module.exports = app;
