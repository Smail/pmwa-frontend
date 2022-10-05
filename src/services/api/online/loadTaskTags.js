import axios from "axios";

export async function loadTaskTags(taskId) {
  const tags = [];
  const response = await axios.get(`tasks/${ taskId }/tags`);
  // Sort array lexicographically based on property "name"
  response.data.sort((a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()));
  response.data.forEach(tag => tags.push(tag));

  return tags;
}
