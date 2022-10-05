export async function requestUserData(context, username) {
  if (localStorage["user"] == null) throw new Error("No user in local storage found.");
  const user = JSON.parse(localStorage["user"]);

  if (user.username !== username) {
    console.warn(`Username mismatch (demo, local storage): ${ user.username } (stored) !== ${ username } (arg)`);
  }

  return {
    username: username,
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    ...user,
  };
}
