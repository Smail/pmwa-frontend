/**
 * Returns an object that contains all the differing key-value pairs between the two passed objects.
 * The second argument is the ground truth object, meaning that only the keys, that
 * exist on this object will be checked for a difference and that the values contained in the returned object
 * will come from it.
 *
 * @param currentStateObject
 * @param newStateObject
 * @returns {{}}
 */
export function getObjectChanges(currentStateObject, newStateObject) {
  const changes = {};
  Object.keys(newStateObject)
    .filter(key => currentStateObject[key] !== newStateObject[key])
    .forEach(key => changes[key] = newStateObject[key]);

  if (Object.keys(changes).length === 0) console.debug("Object didn't change");
  return changes;
}
