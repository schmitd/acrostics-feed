"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./server"));
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    dotenv_1.default.config();
    const hostname = (_a = maybeStr(process.env.FEEDGEN_HOSTNAME)) !== null && _a !== void 0 ? _a : 'example.com';
    const serviceDid = (_b = maybeStr(process.env.FEEDGEN_SERVICE_DID)) !== null && _b !== void 0 ? _b : `did:web:${hostname}`;
    const server = server_1.default.create({
        port: (_c = maybeInt(process.env.FEEDGEN_PORT)) !== null && _c !== void 0 ? _c : 3000,
        listenhost: (_d = maybeStr(process.env.FEEDGEN_LISTENHOST)) !== null && _d !== void 0 ? _d : 'localhost',
        sqliteLocation: (_e = maybeStr(process.env.FEEDGEN_SQLITE_LOCATION)) !== null && _e !== void 0 ? _e : ':memory:',
        subscriptionEndpoint: (_f = maybeStr(process.env.FEEDGEN_SUBSCRIPTION_ENDPOINT)) !== null && _f !== void 0 ? _f : 'wss://bsky.network',
        publisherDid: (_g = maybeStr(process.env.FEEDGEN_PUBLISHER_DID)) !== null && _g !== void 0 ? _g : 'did:example:alice',
        subscriptionReconnectDelay: (_h = maybeInt(process.env.FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY)) !== null && _h !== void 0 ? _h : 3000,
        hostname,
        serviceDid,
    });
    yield server.start();
    console.log(`🤖 running feed generator at http://${server.cfg.listenhost}:${server.cfg.port}`);
});
const maybeStr = (val) => {
    if (!val)
        return undefined;
    return val;
};
const maybeInt = (val) => {
    if (!val)
        return undefined;
    const int = parseInt(val, 10);
    if (isNaN(int))
        return undefined;
    return int;
};
run();
