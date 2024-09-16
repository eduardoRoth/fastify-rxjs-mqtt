import { FastifyPluginAsync } from "fastify";
import {
  AsyncMqttClient,
  IClientOptions,
  IConnackPacket,
  IDisconnectPacket,
  IMqttClient,
  IPublishPacket,
  Packet,
} from "async-mqtt";
import {
  OnCloseCallback,
  OnConnectCallback,
  OnDisconnectCallback,
  OnErrorCallback,
  OnMessageCallback,
  OnPacketCallback,
} from "mqtt/types/lib/client";
import { Observable } from "rxjs";

declare module "fastify" {
  interface FastifyInstance {
    mqttClient: ExtendedAsyncMqttClient;
  }
}
interface Options {
  url?: string;
  opts?: IClientOptions;
  allowRetries?: boolean;
}

declare const fastifyMqttAsync: FastifyPluginAsync<Options>;
declare const _default: FastifyPluginAsync<
  Options,
  import("fastify").RawServerDefault,
  import("fastify").FastifyTypeProviderDefault
>;

export declare function connectAsync(
  brokerUrl: string | any,
  opts?: IClientOptions,
  allowRetries?: boolean,
): Promise<AsyncMqttClient>;

export declare function connectObs(
  brokerUrl: string | any,
  opts?: IClientOptions,
  allowRetries?: boolean,
): Promise<ExtendedAsyncMqttClient>;

declare class AsyncMqttClient extends BasicAsyncMqttClient {
  public on(event: "connect"): Observable<IConnackPacket>;
  public on(event: "disconnect"): Observable<IDisconnectPacket>;
  public on(event: "error"): Observable<Error>;
  public on(event: "close"): Observable<void>;
  public on(
    event: "end" | "reconnect" | "offline" | "outgoingEmpty",
  ): Observable<"end" | "reconnect" | "offline" | "outgoingEmpty">;
  public on(event: "message"): Observable<{
    topic: string;
    payload: Buffer;
    packet: IPublishPacket;
  }>;
  public on(event): Observable<{
    topic: string;
    payload: Buffer;
    packet: IPublishPacket;
  }>;

  public once(event: "connect"): Observable<IConnackPacket>;
  public once(event: "disconnect"): Observable<IDisconnectPacket>;
  public once(event: "error"): Observable<Error>;
  public once(event: "close"): Observable<void>;
  public once(
    event: "end" | "reconnect" | "offline" | "outgoingEmpty",
  ): Observable<"end" | "reconnect" | "offline" | "outgoingEmpty">;
  public once(event: "message"): Observable<{
    topic: string;
    payload: Buffer;
    packet: IPublishPacket;
  }>;
  public once(event): Observable<{
    topic: string;
    payload: Buffer;
    packet: IPublishPacket;
  }>;
}

export default { fastifyMqttAsync, AsyncMqttClient };
