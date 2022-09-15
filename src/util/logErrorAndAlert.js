export function logErrorAndAlert(logMsg, alertMsg) {
  console.error(logMsg);
  alert(alertMsg != null ? alertMsg : logMsg);
}
