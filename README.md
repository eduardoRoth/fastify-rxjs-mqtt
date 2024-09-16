# fastify-rxjs-mqtt

Wrapper for [rxjs-mqtt](https://www.npmjs.com/package/@eduardorothdev/rxjs-mqtt) with TS support.

## Install

```
npm i @eduardorothdev/fastify-rxjs-mqtt
```

## Using it

Add it to your fastify project with the `register` method.

```ts
import fastify from "fastify";
import { fastifyRxjsMqtt } from "@eduardorothdev/fastify-rxjs-mqtt";

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = fastify();

// register plugin
server.register(fastifyRxjsMqtt, { url: "mqtt://localhost:1883" });

server.listen({ port, host }, (err) => {
  if (err) throw err;
});
```

Then you can use it in your methods

```ts
import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get("/mqtt/ping", async function (req, reply) {
    await this.mqttClient.publish("your/topic/#", "Async Hi Mosquitto!");
    reply.send({ mqtt: "message sent!" });
  });
}
```

Listening for events

```ts
import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  try {
    // subscribe to a topic
    await fastify.mqttClient.subscribe("some/topic/#");
    const sub = fastify.mqttClient
      .onJsonMessage<{
        some: string;
        property: string;
        mapping: boolean;
      }>()
      .pipe(
        catchError((err) => {
          // we have to catch the error so the
          // observable pipe doesn't stop sending messages
          return of(null);
        }),
      )
      .subscribe((jsonMessage) => {
        // { some: 'hello', property: 'from mqtt', mapping: true }
        console.log(jsonMessage);
      });

    // later you can unsubscribe when needed.
    // this will unsubscribe from the onJsonMessage observable pipe
    // not from the topic subscription
    // sub.unsubscribe();

    // Unsubscribe from the topic subscription
    // await fastify.mqttClient.unsubscribe('some/topic/#');
  } catch (err) {
    // connection/subscription-to-topic errors
    console.log(err);
  }
}
```

## License

Licensed under [MIT](./LICENSE).
