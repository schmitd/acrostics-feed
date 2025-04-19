"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const algos_1 = __importDefault(require("../algos"));
const syntax_1 = require("@atproto/syntax");
function default_1(server, ctx) {
    server.app.bsky.feed.describeFeedGenerator(async () => {
        const feeds = Object.keys(algos_1.default).map((shortname) => ({
            uri: syntax_1.AtUri.make(ctx.cfg.publisherDid, 'app.bsky.feed.generator', shortname).toString(),
        }));
        return {
            encoding: 'application/json',
            body: {
                did: ctx.cfg.serviceDid,
                feeds,
            },
        };
    });
}
