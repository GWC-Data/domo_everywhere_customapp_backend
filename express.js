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
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
const users = require("./users.js");
const yargs = require("yargs");
const cors = require("cors");

app.use(
  cors({
    origin:
      "https://domo-everywhere-customapp-frontend-462434048008.asia-south1.run.app",
    credentials: true,
  })
);

const argv = yargs
  .option("port", {
    alias: "p",
    description: "Specify which port to listen on",
    default: 8080,
    type: "number",
  })
  .help()
  .alias("help", "h").argv;

// Add in the variables for routing to the identity broker
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax", // or "none" if cross-origin; "lax" is safe for same-site dev
      secure: false, // true only if using HTTPS
    },
  })
);

function findUser(username, callback) {
  let user = users.find((user) => {
    return user.username === username;
  });
  if (user) {
    return callback(null, user);
  }
  return callback(null);
}

passport.serializeUser(function (user, cb) {
  cb(null, user.username);
});

passport.deserializeUser(function (username, cb) {
  findUser(username, cb);
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(function (username, password, done) {
    findUser(username, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  };
}
passport.use(
  "saml",
  new SamlStrategy(
    {
      path: "/sso/callback", // This must match what you set in Okta SSO URL
      entryPoint:
        "https://trial-6945012.okta.com/app/exkry31c7bi0WuV9t697/sso/saml", // from Okta
      issuer: "http://localhost:3001/sso/metadata", // or your chosen SP Entity ID
      cert: fs.readFileSync("./okta.cert", "utf-8"), // save Okta X.509 cert here
    },
    (profile, done) => {
      const user = {
        username: profile.nameID,
        email: profile.email || profile.nameID,
        config: {}, // Add user-specific config if needed
      };
      return done(null, user);
    }
  )
);
passport.authenticationMiddleware = authenticationMiddleware;

app.post(
  "/sso/callback",
  passport.authenticate("saml", { failureRedirect: "/", failureFlash: true }),
  async (req, res, next) => {
    try {
      console.log("req = ", req);

      // Extract email or nameID from SAML response
      const samlUser = req.user;
      const email = samlUser.email;

      if (!email) {
        return res
          .status(400)
          .json({ message: "No email found in SAML response" });
      }
      const user = users.find((user) => user.email === email);

      if (!user) {
        return res
          .status(401)
          .json({ message: "User not found in local database" });
      }

      // Log in the user and establish a session
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect(
          "https://domo-everywhere-customapp-frontend-462434048008.asia-south1.run.app/dashboard"
        );
      });
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  "/sso/login",
  passport.authenticate("saml", {
    failureRedirect: "/", // if something goes wrong
  })
);

app.get("/sso/metadata", (req, res) => {
  const samlStrategy = passport._strategy("saml");
  res.type("application/xml");
  res.status(200).send(samlStrategy.generateServiceProviderMetadata());
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

// if (
//   !process.env.EMBED_ID ||
//   !process.env.CLIENT_ID ||
//   !process.env.CLIENT_SECRET ||
//   !process.env.EMBED_TYPE
// ) {
//   console.log(
//     "The following variables must be declared in your .env file: EMBED_ID, CLIENT_ID, CLIENT_SECRET, EMBED_TYPE."
//   );
//   return;
// }
app.get(
  "/api/user-dashboards",
  passport.authenticationMiddleware(),
  (req, res) => {
    const userConfig = req.user.config;
    const response = [];

    for (const [key, value] of Object.entries(userConfig)) {
      response.push({
        visualization: key,
        title: value.title || "Untitled",
        header: value.header || "Unknown",
        embedId: value.embedId || "Unknown",
      });
    }

    res.json(response);
  }
);

app.get(
  "/embed/items/:itemId",
  passport.authenticationMiddleware(),
  (req, res, next) => {
    const config = req.user.config["visualization" + req.params.itemId];
    if (config.embedId) {
      embed.handleRequest(
        req,
        res,
        next,
        req.user.config["visualization" + req.params.itemId]
      );
    } else {
      next(
        `The EMBED_ID${req.params.itemId} environment variable in your .env file is not set. Please set this in order to view content here.`
      );
    }
  }
);

app.get(
  "/embed/page",
  passport.authenticationMiddleware(),
  (req, res, next) => {
    embed.showFilters(req, res);
  }
);

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname,'/login.html'));
// })

app.get("/", (req, res) => {
  res.redirect(
    "https://domo-everywhere-customapp-frontend-462434048008.asia-south1.run.app/"
  );
});

// app.post('/login', passport.authenticate('local', {
//   successRedirect: 'http://localhost:5173/dashboard',
//   failureRedirect: 'http://localhost:5173/'
// }))

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: "Authentication failed" });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({
        message: "Authenticated successfully",
        user: user.username,
      });
    });
  })(req, res, next);
});

// This section will draw the differnet content based on the user that logs in. It is currently hardcoded embed the platform when samantha logs in, but embed individual cards when anyone else logs in

app.get("/dashboard", passport.authenticationMiddleware(), (req, res, next) => {
  fs.readFile(
    path.join(
      __dirname,
      process.env.USE_XHR === "true" ? "sample_xhr.html" : "sample.html"
    ),
    "utf8",
    function (err, contents) {
      let newContents = contents.replace("USER", `${req.user.username}`);
      newContents = newContents.replace(
        "REPLACE_IFRAME_FROM_ENV",
        process.env.REPLACE_IFRAME
      );

      if (req.user.username === "ajay.boobalakrishnan") {
        // Here we generate the URL using the info passed
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
        url = process.env.IDP_URL + "/jwt?token=" + token;

        newContents = newContents.replace("/embed/items/1", url);
      }

      res.send(newContents);
    }
  );
});

app.use(express.static("public"));

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect(
    "https://domo-everywhere-customapp-frontend-462434048008.asia-south1.run.app/"
  );
});

app.listen(argv.port, () =>
  console.log(`Example app listening on port ${argv.port}!`)
);
