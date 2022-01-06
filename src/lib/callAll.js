export function callAll(...callbacks) {
  return (...args) => {
    callbacks.forEach((func) => func && func(...args))
  }
}
