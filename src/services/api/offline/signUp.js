function createUser(user) {
  const { username, firstName, lastName, email } = user;
  for (const key in user) {
    if (user[key] == null) throw new Error(`Invalid argument: '${ key }' is null`);
    if (user[key].length === 0) throw new Error(`Invalid argument: '${ key }' length is 0`);
  }

  localStorage["user"] = JSON.stringify({
    userId: Math.random().toString().substring(2),
    username: username,
    displayName: username,
    firstName: firstName,
    lastName: lastName,
    email: email,
  });
}

function createExampleTasks() {
  const tasks = [];
  for (let i = 1; i < 10; i++) {
    tasks.push({
      id: i.toString(),
      name: `Test ${ i }`,
      isDone: Math.random() > 0.5,
      startDate: null,
      endDate: null,
      tags: [{ id: 1, name: "tag 1", color: "red" }, { id: 2, name: "tag 2", color: "green" }],
    });
  }

  localStorage["tasks"] = JSON.stringify(tasks);
}

export async function signUp(context, user) {
  createUser(user);
  // Delete tasks of other accounts. This is irreversible.
  delete localStorage["tasks"];
  createExampleTasks();
}
