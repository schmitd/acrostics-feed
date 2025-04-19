"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrationProvider = void 0;
const migrations = {};
exports.migrationProvider = {
    async getMigrations() {
        return migrations;
    },
};
migrations['001'] = {
    async up(db) {
        await db.schema
            .createTable('post')
            .addColumn('uri', 'varchar', (col) => col.primaryKey())
            .addColumn('cid', 'varchar', (col) => col.notNull())
            .addColumn('indexedAt', 'varchar', (col) => col.notNull())
            .execute();
        await db.schema
            .createTable('sub_state')
            .addColumn('service', 'varchar', (col) => col.primaryKey())
            .addColumn('cursor', 'integer', (col) => col.notNull())
            .execute();
    },
    async down(db) {
        await db.schema.dropTable('post').execute();
        await db.schema.dropTable('sub_state').execute();
    },
};
