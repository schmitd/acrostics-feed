"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
const algos_1 = __importDefault(require("../algos"));
const syntax_1 = require("@atproto/syntax");
function default_1(server, ctx) {
    server.app.bsky.feed.getFeedSkeleton(async ({ params, req }) => {
        const feedUri = new syntax_1.AtUri(params.feed);
        const algo = algos_1.default[feedUri.rkey];
        if (feedUri.hostname !== ctx.cfg.publisherDid ||
            feedUri.collection !== 'app.bsky.feed.generator' ||
            !algo) {
            throw new xrpc_server_1.InvalidRequestError('Unsupported algorithm', 'UnsupportedAlgorithm');
        }
        /**
         * Example of how to check auth if giving user-specific results:
         *
         * const requesterDid = await validateAuth(
         *   req,
         *   ctx.cfg.serviceDid,
         *   ctx.didResolver,
         * )
         */
        const body = await algo(ctx, params);
        return {
            encoding: 'application/json',
            body: body,
        };
    });
}
