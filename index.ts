import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { connect, IClientOptions, MqttClient } from "@eduardorothdev/rxjs-mqtt";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    mqttClient: MqttClient;
  }
}

interface Options {
  url: string;
  opts?: IClientOptions;
  allowRetries?: boolean;
}

const fastifyRxjxMqtt: FastifyPluginAsync<Options> = async (
  fastify: FastifyInstance,
  options: Options,
) => {
  try {
    if (fastify.mqttClient)
      throw new Error("MQTT client has already been registered!");
    const { url, opts, allowRetries } = options;
    const client = await connect(url, opts ?? {}, allowRetries);
    fastify.decorate("mqttClient", client);
    fastify.addHook("onClose", () => client.end());
  } catch (e) {
    fastify.log.error(e);
  }
};

export default fp(fastifyRxjxMqtt, {
  fastify: "4.x",
  name: "fastify-rxjs-mqtt",
});
export { fastifyRxjxMqtt, MqttClient };
