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
exports.FirehoseSubscription = void 0;
const subscribeRepos_1 = require("./lexicon/types/com/atproto/sync/subscribeRepos");
const subscription_1 = require("./util/subscription");
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
class FirehoseSubscription extends subscription_1.FirehoseSubscriptionBase {
    handleEvent(evt) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, subscribeRepos_1.isCommit)(evt))
                return;
            const ops = yield (0, subscription_1.getOpsByType)(evt);
            const postsToDelete = ops.posts.deletes.map((del) => del.uri);
            const postsToCreate = [];
            // Process the posts that should be created
            for (const create of ops.posts.creates) {
                try {
                    const text = create.record.text;
                    if (text && text.trim().length > 0) {
                        const isAcrosticPost = yield isAcrostic(text);
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
                yield this.db
                    .deleteFrom('post')
                    .where('uri', 'in', postsToDelete)
                    .execute();
            }
            if (postsToCreate.length > 0) {
                yield this.db
                    .insertInto('post')
                    .values(postsToCreate)
                    .onConflict((oc) => oc.doNothing())
                    .execute();
            }
        });
    }
}
exports.FirehoseSubscription = FirehoseSubscription;
function isAcrostic(text) {
    return new Promise((resolve, reject) => {
        // Split by newlines and get first character of each line
        const lines = text.split('\n')
            .filter(line => line.trim().length > 0) // Remove empty lines
            .map(line => line.trim().charAt(0));
        // Needs at least 3 lines to be considered an acrostic
        if (lines.length < 3) {
            return resolve(false);
        }
        const word = lines.join('');
        // Run the Python script to check if the word is English
        const scriptPath = path.resolve(process.cwd(), 'src/is_english.py');
        const pythonExecutable = path.resolve(process.cwd(), '.venv/bin/python3');
        const isEnglish = (0, child_process_1.spawn)(pythonExecutable, [scriptPath, word]);
        let result = '';
        isEnglish.stdout.on('data', (chunk) => {
            result += chunk.toString();
        });
        isEnglish.on('close', (code) => {
            if (code !== 0) {
                // tslint:disable-next-line:no-console
                console.error(`Python script exited with code ${code}`);
                return resolve(false);
            }
            resolve(result.trim() === 'true');
        });
        isEnglish.on('error', (err) => {
            // tslint:disable-next-line:no-console
            console.error('Failed to start Python process:', err);
            reject(err);
        });
    });
}
