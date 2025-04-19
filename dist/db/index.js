"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateToLatest = exports.createDb = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const kysely_1 = require("kysely");
const migrations_1 = require("./migrations");
const createDb = (location) => {
    return new kysely_1.Kysely({
        dialect: new kysely_1.SqliteDialect({
            database: new better_sqlite3_1.default(location),
        }),
    });
};
exports.createDb = createDb;
const migrateToLatest = async (db) => {
    const migrator = new kysely_1.Migrator({ db, provider: migrations_1.migrationProvider });
    const { error } = await migrator.migrateToLatest();
    if (error)
        throw error;
};
exports.migrateToLatest = migrateToLatest;
