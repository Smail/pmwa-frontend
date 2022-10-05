import axios from "axios";

/**
 * @throws {Error}
 */
export async function updateUser(context, newUser) {
  const currentUser = context.state.user;

  // Check if all keys contained in the new user object actually exist on the current one,
  // i.e., no additional (unknown) keys are added to the state user object.
  const updatableKeys = Object.keys(currentUser);
  for (const key of Object.keys(newUser)) {
    if (!updatableKeys.includes(key)) throw new Error(`Unknown key on user object '${ key }'`);
  }

  // Force the username to be lowercase
  if (!newUser.username) newUser.username = newUser.username.toLowerCase();

  // Contains only the keys that have changed
  const changedUserObject = {};
  for (const key of Object.keys(newUser)) {
    if (currentUser[key] !== newUser[key]) changedUserObject[key] = newUser[key];
  }

  if (Object.keys(changedUserObject).length === 0) {
    console.debug("User object has not changed. No updates required");
    return;
  }

  try {
    await axios.patch(`users/${ currentUser.username }`, changedUserObject);
  } catch (e) {
    throw new Error("Could not update the user", { cause: e });
  }

  // Update user object locally, i.e., client-side
  context.commit("updateUser", changedUserObject);
}
