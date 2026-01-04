import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import consola from "consola";
import passport from "passport";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import application constants
import {DB, PORT} from "./constants/index.js";

// Router exports
import userApis from "./apis/users.js";
import profileApis from "./apis/profiles.js";

// Import passport middleware
import "./middlewares/passport-middleware.js";

// Initialise express application
const app = express();

// Apply application middlewares
app.use(cors());
app.use(express.static(join(__dirname, "uploads")));

// Parse json bodies
app.use(express.json());

app.use(passport.initialize());

// Inject sub router and apis. 
app.use("/users", userApis);
app.use("/profiles", profileApis);

const main = async() => {
    try {
        // connect with the database
        await mongoose.connect(DB);

        consola.success("DATABASE CONNECTED...");

        // start application server
        app.listen(PORT, "0.0.0.0", () => consola.success(`Server started on port ${PORT}`));

    } catch(err) {

        consola.error(`Unable to start the server \n ${err.message}`);

    }
};

main();