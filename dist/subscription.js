"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirehoseSubscription = void 0;
const subscribeRepos_1 = require("./lexicon/types/com/atproto/sync/subscribeRepos");
const subscription_1 = require("./util/subscription");
const en = await Promise.resolve().then(() => __importStar(require('dictionary-en')));
const nspell_1 = __importDefault(require("nspell"));
const spell = (0, nspell_1.default)(en);
// Create a promise-based wrapper for dictionary-en
function lookupWord(word) {
    return spell.correct(word);
}
class FirehoseSubscription extends subscription_1.FirehoseSubscriptionBase {
    async handleEvent(evt) {
        if (!(0, subscribeRepos_1.isCommit)(evt))
            return;
        const ops = await (0, subscription_1.getOpsByType)(evt);
        const postsToDelete = ops.posts.deletes.map((del) => del.uri);
        const postsToCreate = [];
        // Process the posts that should be created
        for (const create of ops.posts.creates) {
            try {
                const text = create.record.text;
                if (text && text.trim().length > 0) {
                    const isAcrosticPost = isAcrostic(text);
                    if (isAcrosticPost) {
                        postsToCreate.push({
                            uri: create.uri,
                            cid: create.cid,
                            indexedAt: new Date().toISOString(),
                        });
                    }
                }
            }
            catch (err) {
                // tslint:disable-next-line:no-console
                console.error('Error processing post:', err);
            }
        }
        if (postsToDelete.length > 0) {
            await this.db
                .deleteFrom('post')
                .where('uri', 'in', postsToDelete)
                .execute();
        }
        if (postsToCreate.length > 0) {
            await this.db
                .insertInto('post')
                .values(postsToCreate)
                .onConflict((oc) => oc.doNothing())
                .execute();
        }
    }
}
exports.FirehoseSubscription = FirehoseSubscription;
function isAcrostic(text) {
    // Split by newlines and get first character of each line
    const lines = text.split('\n')
        .filter(line => line.trim().length > 0) // Remove empty lines
        .map(line => line.trim().charAt(0));
    // Needs at least 4 lines to be considered an acrostic
    if (lines.length < 4) {
        return false;
    }
    const word = lines.join('');
    return lookupWord(word);
}
