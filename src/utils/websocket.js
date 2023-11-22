import { io } from "socket.io-client";

const WEBSOCKET_URL = {
    "prod": "https://notification.nodeguardians.io",
    "preprod": "https://preprod.notification.nodeguardians.com",
    "staging": "https://staging.notification.nodeguardians.com"
};

/**
 *  Get the websocket client for the notification microservice
 * @param {String} token : the web3 token
 * @param {String} environment : the environment to connect to ("prod" | "preprod" | "staging")
 * @returns the websocket client
 */
export async function getWsClient(token, environment) {
  const client = io(WEBSOCKET_URL[environment], {
    auth: { token: String(token) },
  });

  return client;
}

/**
 * Wait for an topic message from the websocket client
 * @param {Socket.io client} websocket client
 * @param {String} topic to wait for
 * @param {Number} timeout in ms until promise is rejected
 * @returns the promise that will be resolved when the message is received or rejected if the timeout is reached
 */
export function waitTopicMessage(client, topic, timeout = 30000) {
  let promise = new Promise(function (resolve, reject) {
    const handler = setTimeout(() => {
      reject(new Error("Timeout"));
    }, timeout);

    client.on(topic, (data) => {
      clearTimeout(handler);
      resolve(data);
    });
  });

  return promise;
}

/**
 * Wait for an event from the websocket client on a specific topic
 * @param {Socket.io client} websocket client
 * @param {String} topic to wait for
 * @param {String} event to wait for
 * @param {Number} timeout in ms until promise is rejected
 * @returns the promise that will be resolved when the event is received or rejected if the timeout is reached
 */
export function waitTopicEventMessage(client, topic, event, timeout = 30000) {
  let promise = new Promise(function (resolve, reject) {
    const handler = setTimeout(() => {
      reject(new Error("Timeout"));
    }, timeout);

    client.on(topic, (data) => {
      if (data.event === event) {
        clearTimeout(handler);
        resolve(data);
      }
    });
  });

  return promise;
}

/**
 * Wait for one of two events from the websocket client on a specific topic
 * @param {Socket.io client} websocket client
 * @param {String} topic to wait for
 * @param {Array[String]} events to wait for
 * @param {Number} timeout  in ms until promise is rejected
 * @returns
 */
export function waitExclusiveTopicEventsMessage(
  client,
  topic,
  events,
  timeout = 10000
) {
  let promise = new Promise(function (resolve, reject) {
    const handler = setTimeout(() => {
      reject(new Error("Timeout"));
    }, timeout);

    client.on(topic, (data) => {
      if (events.includes(data.event)) {
        clearTimeout(handler);
        resolve(data);
      }
    });
  });

  return promise;
}
