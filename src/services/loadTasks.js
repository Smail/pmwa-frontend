import axios from "axios";

export const loadTasks = () => new Promise(async (resolve, reject) => {
    try {
      resolve((await axios.get("tasks")).data);
    } catch (e) {
      reject(e);
    }
  },
);
