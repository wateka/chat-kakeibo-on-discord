import dotenv from "dotenv";
import process from "node:process";
import type { RESTGetAPIApplicationCommandsResult } from "discord-api-types/rest/v10";
import type { Snowflake } from "discord-api-types/globals";

dotenv.config({
  path: ".dev.vars",
});

export const token = process.env.DISCORD_TOKEN;
export const applicationId = process.env.DISCORD_APPLICATION_ID;

if (token === undefined) {
  throw new Error("DISCORD_TOKEN is undefined.");
}

if (applicationId === undefined) {
  throw new Error("DISCORD_APPLICATION_ID is undefined.");
}

export async function getApplicationCommandsList() {
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${token}`,
    },
    method: "GET",
  });

  const commands: RESTGetAPIApplicationCommandsResult = await res.json();

  return commands;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function registerApplicationCommands(commands: any) {
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(commands),
  });

  console.log(response);

  return response;
}

export async function deleteApplicationCommand(id: Snowflake) {
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands/${id}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${token}`,
    },
    method: "DELETE",
  });

  return response;
}
