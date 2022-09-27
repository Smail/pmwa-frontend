export function logErrorAndAlert(logMsg, alertMsg) {
  const stack = new Error().stack;
  console.error(`${ logMsg }\n${ stack }`);
  alert(alertMsg != null ? alertMsg : logMsg);
}
