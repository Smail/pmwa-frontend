export function parseLocalStorageOrDefault(key, defaultValue) {
  if (defaultValue === undefined) throw new Error("Missing defaultValue." +
    "If you intend to use 'undefined' as the default value, then call localStorage directly instead.");
  return (localStorage[key] != null) ? JSON.parse(localStorage[key]) : defaultValue;
}
