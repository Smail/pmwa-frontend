import axios from "axios";

export async function signUp({ username, firstName, lastName, email, password, repeatedPassword }) {
  try {
    await axios.post("auth/sign-up", {
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      repeatedPassword: repeatedPassword,
    });
  } catch (e) {
    if (e.response?.data?.message != null) {
      console.error(e.response.data.message);
      alert("Error during sign up: " + e.response.data.message);
    } else {
      console.error(e.message);
      alert("An unknown error occurred");
    }
  }
}
