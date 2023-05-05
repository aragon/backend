import "reflect-metadata";
import { config } from "dotenv";
config(); // dotenv loading has to be on the top

import mongoose from "mongoose";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { container } from "tsyringe";
import Logger from "./services/Logger.service";
import AddressResolver from "./resolvers/Address.resolver";

async function main() {
  mongoose.connect("mongodb://127.0.0.1:27017/test");
  const schema = await buildSchema({
    resolvers: [AddressResolver],
    emitSchemaFile: true,
    validate: true,
    container: { get: (cls) => container.resolve(cls) },
  });

  const apolloLogger = container.resolve(Logger);
  apolloLogger.setName("Apollo-Server");
  const server = new ApolloServer({
    schema,
    logger: apolloLogger,
    introspection: process.env.NODE_ENV !== "production",
  });
  const port = parseInt(process.env.PORT || "8080");
  const { url } = await startStandaloneServer(server, {
    listen: {
      port,
    },
  });
  apolloLogger.log(`Started on port ${port} with url ${url}`);
}

main();
