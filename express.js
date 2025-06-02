require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const SamlStrategy = require("passport-saml").Strategy;
const path = require("path");
const fs = require("fs");
const embed = require("./embed.js");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const yargs = require("yargs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const users = require("./users.js");

// ✅ Set up CORS (place FIRST)
app.use(
  cors({
    origin:
      "https://domo-everywhere-customapp-frontend-462434048008.asia-south1.run.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); // Needed for parsing JSON bodies

// ✅ Only one session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax", // change to 'none' + secure:true if needed
      secure: false,
    },
  })
);

// CLI argument support
const argv = yargs
  .option("port", {
    alias: "p",
    description: "Specify which port to listen on",
    default: 8080,
    type: "number",
  })
  .help()
  .alias("help", "h").argv;

// Auth setup
function findUser(username, callback) {
  const user = users.find((user) => user.username === username);
  callback(null, user || null);
}

passport.serializeUser((user, cb) => cb(null, user.username));
passport.deserializeUser((username, cb) => findUser(username, cb));

passport.use(
  new LocalStrategy((username, password, done) => {
    findUser(username, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false);
      return done(null, user);
    });
  })
);

passport.use(
  "saml",
  new SamlStrategy(
    {
      path: "/sso/callback",
      entryPoint:
        "https://trial-6945012.okta.com/app/exkry31c7bi0WuV9t697/sso/saml",
      issuer: "http://localhost:3001/sso/metadata",
      cert: fs.readFileSync("./okta.cert", "utf-8"),
    },
    (profile, done) => {
      const user = {
        username: profile.nameID,
        email: profile.email || profile.nameID,
        config: {},
      };
      return done(null, user);
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

passport.authenticationMiddleware = () => {
  return (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/");
  };
};

// Auth routes
app.post(
  "/sso/callback",
  passport.authenticate("saml", { failureRedirect: "/", failureFlash: true }),
  (req, res, next) => {
    const samlUser = req.user;
    const email = samlUser.email;

    const user = users.find((user) => user.email === email);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found in local database" });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.redirect(
        "https://domo-everywhere-customapp-frontend-462434048008.asia-south1.run.app/dashboard"
      );
    });
  }
);

app.get("/sso/login", passport.authenticate("saml", { failureRedirect: "/" }));

app.get("/sso/metadata", (req, res) => {
  const samlStrategy = passport._strategy("saml");
  res.type("application/xml");
  res.status(200).send(samlStrategy.generateServiceProviderMetadata());
});

// API routes
app.get(
  "/api/user-dashboards",
  passport.authenticationMiddleware(),
  (req, res) => {
    const userConfig = req.user.config;
    const response = Object.entries(userConfig).map(([key, value]) => ({
      visualization: key,
      title: value.title || "Untitled",
      header: value.header || "Unknown",
      embedId: value.embedId || "Unknown",
    }));
    res.json(response);
  }
);

app.get(
  "/embed/items/:itemId",
  passport.authenticationMiddleware(),
  (req, res, next) => {
    const config = req.user.config["visualization" + req.params.itemId];
    if (config.embedId) {
      embed.handleRequest(req, res, next, config);
    } else {
      next(`The EMBED_ID${req.params.itemId} is not set.`);
    }
  }
);

app.get("/embed/page", passport.authenticationMiddleware(), (req, res) => {
  embed.showFilters(req, res);
});

app.get("/", (req, res) => {
  res.redirect(
    "https://domo-everywhere-customapp-frontend-462434048008.asia-south1.run.app/"
  );
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: "Authentication failed" });

    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ message: "Authenticated successfully", user: user.username });
    });
  })(req, res, next);
});

app.get("/dashboard", passport.authenticationMiddleware(), (req, res) => {
  const filePath = path.join(
    __dirname,
    process.env.USE_XHR === "true" ? "sample_xhr.html" : "sample.html"
  );
  fs.readFile(filePath, "utf8", (err, contents) => {
    if (err) return res.status(500).send("Internal Server Error");

    let newContents = contents
      .replace("USER", `${req.user.username}`)
      .replace("REPLACE_IFRAME_FROM_ENV", process.env.REPLACE_IFRAME);

    if (req.user.username === "ajay.boobalakrishnan") {
      const jwtBody = {
        sub: 1,
        name: req.user.username,
        email: req.user.username.concat("@gwcdata.ai"),
        jti: uuid.v4(),
      };

      jwtBody[process.env.KEY_ATTRIBUTE] = process.env.MAPPING_VALUE;

      const token = jwt.sign(jwtBody, process.env.JWT_SECRET, {
        expiresIn: "5m",
      });
      const url = process.env.IDP_URL + "/jwt?token=" + token;

      newContents = newContents.replace("/embed/items/1", url);
    }

    res.send(newContents);
  });
});

app.use(express.static("public"));

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(
      "https://domo-everywhere-customapp-frontend-462434048008.asia-south1.run.app/"
    );
  });
});

// Start server
app.listen(argv.port, () =>
  console.log(`✅ Server running on http://localhost:${argv.port}`)
);
