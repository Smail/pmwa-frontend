import axios from "axios";

/**
 * @throws {Error}
 */
export async function requestUserData(context, username) {
  // TODO fix: currently user id is passed and somehow it works when an auth header is set
  if (username == null) throw new Error("Invalid argument: username is null");
  try {
    return (await axios.get(`/users/${ username }`)).data;
  } catch (e) {
    console.error("Could not get user data: %s", e.message);
    throw new Error("Could not get user data", { cause: e });
  }
}
