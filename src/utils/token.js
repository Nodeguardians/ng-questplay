import express from "express";
import { isJwtExpired } from "jwt-check-expiration";
import fs from "fs";
import { GracefulShutdownManager } from "@moebius/http-graceful-shutdown";
import { mainPath } from "./navigation.js";
import chalk from "chalk";

const AUTH_CLI_URL = "https://nodeguardians.io/auth/cli";

/**
 * Get the local stored in the local cache
 */
async function getLocalToken() {
  if (fs.existsSync(mainPath() + "/.cache/token.jwt")) {
    return fs.readFileSync(mainPath() + "/.cache/token.jwt").toString();
  } else {
    return null;
  }
}

/**
 * Store the token in the local cache
 */
function storeLocalToken(token) {
  fs.writeFileSync(mainPath() + "/.cache/token.jwt", token);
}

/**
 * Get the user to sign a message on nodeguardians.io website using
 * they private key and get the signature back for later auth with
 * the notification microservice
 */
async function getNewToken() {
  return new Promise((resolve, reject) => {
    const app = express();
    let shutdownManager;

    app.get("/", (req, res) => {
      res.set("Connection", "close");
      res.redirect(AUTH_CLI_URL + "?sucess=true");
      res.send();
      shutdownManager.terminate();
      resolve(req.query.token);
    });

    const server = app.listen(0, () => {
      const port = server.address().port;
      console.log(
        chalk.yellow(
          `Please open: ` + chalk.bold(AUTH_CLI_URL + `?port=${port}`)
        )
      );
    });

    shutdownManager = new GracefulShutdownManager(server);
  });
}

/**
 * Verify a json webtoken expiration
 */
async function verifyToken(token) {
  if (isJwtExpired(token) === true) {
    throw new Error("Token expired");
  }
}

/**
 * Get the token from the local cache or get a new one
 * @returns {Promise<string>} The token
 */
export async function getToken() {
  let token;
  let renew = false;

  token = await getLocalToken();

  if (token == null) {
    console.log(chalk.yellow("No token found."));
    renew = true;
  } else {
    try {
      await verifyToken(token);
    } catch (e) {
      console.log(e);
      console.log("invalid token");
      renew = true;
    }
  }

  if (renew) {
    token = await getNewToken();
  }

  await verifyToken(token);
  storeLocalToken(token);

  return token;
}
