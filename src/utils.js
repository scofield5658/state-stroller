export const isPlainObject = (obj) => {
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    return true;
  }
  return false;
}

export const isArray = (arr) => {
  if (Array.isArray(arr)) {
    return true;
  }
  return false;
}

export const isString = (str) => {
  if (typeof str === 'string') {
    return true;
  }
  return false;
}

export const isFunction = (func) => {
  if (typeof func === 'function') {
    return true;
  }
  return false;
}
