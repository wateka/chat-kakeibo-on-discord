import { deleteApplicationCommand, getApplicationCommandsList } from ".";

const commands = await getApplicationCommandsList();

let succeeded = true;

for (const command of commands) {
    const response = await deleteApplicationCommand(command.id);

    if (!response.ok) {
        console.error(
            `Failed to unregister command "${command.name}" (${command.id})`,
        );
        succeeded = false;
        break;
    }
}

if (succeeded) {
    console.log("Successfully updated all commands.");
} else {
    console.error("Cancelled unregistering commands.");
}
