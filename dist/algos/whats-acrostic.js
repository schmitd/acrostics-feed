"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.shortname = void 0;
// max 15 chars
exports.shortname = 'whats-acrostic';
const handler = async (ctx, params) => {
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
    const res = await builder.execute();
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
};
exports.handler = handler;
