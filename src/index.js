import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import consola from "consola";

// Import application constants
import {DB, PORT} from "./constants/index.js";

// Router exports
import userApis from "./apis/users.js";

// Initialise express application
const app = express();

// Apply application middlewares
app.use(cors());

// Inject sub router and apis. 
app.use("/users", userApis);

const main = async() => {
    try {
        // connect with the database
        await mongoose.connect(DB, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });

        consola.success("DATABASE CONNECTED...");

        // start application server
        app.listen(PORT, () => consola.success(`Server started on port ${PORT}`));

    } catch(err) {

        consola.error(`Unable to start the server \n ${err.message}`);

    }
};

main();