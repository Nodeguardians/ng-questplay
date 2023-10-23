import express from "express";
import { isJwtExpired } from "jwt-check-expiration";
import fs from "fs";
import { GracefulShutdownManager } from "@moebius/http-graceful-shutdown";
import { mainPath } from "./navigation.js";
import chalk from "chalk";

const AUTH_CLI_URL = {
    "prod": "https://nodeguardians.io/auth/cli",
    "preprod": "https://preprod.nodeguardians.com/auth/cli",
    "staging": "https://staging.nodeguardians.com/auth/cli"
};

/**
 * Get the expected token path for the given environment
 */
function getTokenPath(environment) {
  if (environment == "prod") {
    return mainPath() + "/.cache/token.jwt";
  }

  return mainPath() + `/.cache/${environment}-token.jwt`;
}

/**
 * Get the local stored in the local cache
 */
async function getLocalToken(environment) {
  const tokenPath = getTokenPath(environment);

  if (fs.existsSync(tokenPath)) {
    return fs.readFileSync(tokenPath).toString();
  } else {
    return null;
  }
}

/**
 * Store the token in the local cache
 */
function storeLocalToken(token, environment) {
  const tokenPath = getTokenPath(environment);
  fs.writeFileSync(tokenPath, token);
}

/**
 * Get the user to sign a message on nodeguardians.io website using
 * they private key and get the signature back for later auth with
 * the notification microservice
 */
async function getNewToken(environment) {
  return new Promise((resolve, reject) => {
    const app = express();
    let shutdownManager;

    app.get("/", (req, res) => {
      res.set("Connection", "close");
      res.redirect(AUTH_CLI_URL[environment] + "?success=true");
      res.send();
      shutdownManager.terminate();
      resolve(req.query.token);
    });

    const server = app.listen(0, () => {
      const port = server.address().port;
      console.log(
        chalk.yellow(
          "Please log into nodeguardians.io to authenticate yourself: ",
          chalk.underline(AUTH_CLI_URL[environment] + `?port=${port}\n`),
          "You will only need to do this once."
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
 * @param {string} environment : The environment to use ("prod" | "preprod" | "staging") 
 * @returns {Promise<string>} The token
 */
export async function getToken(environment) {
  let token;
  let renew = false;

  token = await getLocalToken(environment);

  if (token == null) {
    console.log(chalk.yellow("No token found."));
    renew = true;
  } else {
    try {
      await verifyToken(token);
    } catch (e) {
      console.log(e);
      console.log("Invalid or expired token");
      renew = true;
    }
  }

  if (renew) {
    token = await getNewToken(environment);
  }

  await verifyToken(token);
  storeLocalToken(token, environment);

  return token;
}
