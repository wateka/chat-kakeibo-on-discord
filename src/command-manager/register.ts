import { registerApplicationCommands } from ".";
import commands from "../config/commands";

const response = await registerApplicationCommands(commands);

if (response.ok) {
    console.log("Successfully registered all commands.");
} else {
    console.error("Failed to register commands.");
    console.log(await response.json());
}
