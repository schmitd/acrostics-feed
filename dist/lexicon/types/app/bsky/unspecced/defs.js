"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSkeletonSearchPost = isSkeletonSearchPost;
exports.validateSkeletonSearchPost = validateSkeletonSearchPost;
exports.isSkeletonSearchActor = isSkeletonSearchActor;
exports.validateSkeletonSearchActor = validateSkeletonSearchActor;
const lexicons_1 = require("../../../../lexicons");
const util_1 = require("../../../../util");
function isSkeletonSearchPost(v) {
    return ((0, util_1.isObj)(v) &&
        (0, util_1.hasProp)(v, '$type') &&
        v.$type === 'app.bsky.unspecced.defs#skeletonSearchPost');
}
function validateSkeletonSearchPost(v) {
    return lexicons_1.lexicons.validate('app.bsky.unspecced.defs#skeletonSearchPost', v);
}
function isSkeletonSearchActor(v) {
    return ((0, util_1.isObj)(v) &&
        (0, util_1.hasProp)(v, '$type') &&
        v.$type === 'app.bsky.unspecced.defs#skeletonSearchActor');
}
function validateSkeletonSearchActor(v) {
    return lexicons_1.lexicons.validate('app.bsky.unspecced.defs#skeletonSearchActor', v);
}
