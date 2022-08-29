import axios from "axios";

export const loadTasks = () => new Promise(async resolve => {
    const response = await axios.get('tasks');
    const tasks = response.data;

    resolve(tasks);
  }
);
