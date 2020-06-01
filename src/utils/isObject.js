module.exports = function isObject() {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}