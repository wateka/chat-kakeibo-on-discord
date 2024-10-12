import { getApplicationCommandsList } from ".";

const list = await getApplicationCommandsList();

console.log("Here is the application commands list:");
for (const { id, name, description } of list) {
  console.log(`* ${name} (${id}): ${description}`);
}
