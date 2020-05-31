module.exports = function isString(str) {
    return str instanceof String || typeof str == 'string';
}