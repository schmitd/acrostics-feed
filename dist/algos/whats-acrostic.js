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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.shortname = void 0;
// max 15 chars
exports.shortname = 'whats-acrostic';
const handler = (ctx, params) => __awaiter(void 0, void 0, void 0, function* () {
    let builder = ctx.db
        .selectFrom('post')
        .selectAll()
        .orderBy('indexedAt', 'desc')
        .orderBy('cid', 'desc')
        .limit(params.limit);
    if (params.cursor) {
        const timeStr = new Date(parseInt(params.cursor, 10)).toISOString();
        builder = builder.where('post.indexedAt', '<', timeStr);
    }
    const res = yield builder.execute();
    const feed = res.map((row) => ({
        post: row.uri,
    }));
    let cursor;
    const last = res.at(-1);
    if (last) {
        cursor = new Date(last.indexedAt).getTime().toString(10);
    }
    return {
        cursor,
        feed,
    };
});
exports.handler = handler;
