const awsIot = require("aws-iot-device-sdk");

module.exports = {
  friendlyName: "Send MQTT aws notification",

  description: "This will send notifications to IoT Core",

  inputs: {
    channel: {
      type: "string",
      required: true,
      description: "Channel to publish data",
    },
    steps: {
      type: "json",
      required: true,
      description: "Steps to build the drink",
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    console.log(`sendNotification:
      [channel] = ${inputs.channel}
      [steps] = ${JSON.stringify(inputs.steps)}
    `);

    try {
      const device = awsIot.device({
        clientId: inputs.channel,
        host: process.env.IOT_CORE_ENDPOINT,
        port: 8883,
        keyPath: `${process.env.HOME}/AWS_secrets/private.pem.key`,
        certPath: `${process.env.HOME}/AWS_secrets/certificate.pem.crt`,
        caPath: `${process.env.HOME}/AWS_secrets/AmazonRootCA1.cer`,
      });

      const orders = await Order.find({
        where: { status: "ready" },
      });

      console.log(orders);

      const params = {
        printer: 1,
        steps: JSON.stringify(inputs.steps),
      };

      device.on("connect", () => {
        console.log("connecting");
        device.publish(inputs.channel, JSON.stringify(params));
      });

      device.on("message", (topic, payload) => {
        console.log("message", topic, payload.toString());
      });

      return exits.success(params);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
      return exits.error(error.message);
    }
  },
};
