import {
	type APIChatInputApplicationCommandInteractionData,
	type APIInteraction,
	type APIInteractionResponse,
	type APIInteractionResponsePong,
	InteractionType,
} from "discord-api-types/v10";

export class InteractionData {
	interactionData: APIChatInputApplicationCommandInteractionData;

	constructor(interactionData: APIChatInputApplicationCommandInteractionData) {
		this.interactionData = interactionData;
	}

	name() {
		return this.interactionData.name;
	}

	option(optionName: string) {
		const option = this.interactionData.options?.find(
			(option) => option.name === optionName,
		);
		return option;
	}
}

type DiscordAppOption = {
	ping: () => APIInteractionResponsePong;
	applicationCommand: () => APIInteractionResponse;
};

export type DiscordEnv = {
	Bindings: {
		[key: string]: unknown;
	};
};

class DiscordApp<Env extends DiscordEnv> {
	option: DiscordAppOption;
	bindings: Env["Bindings"];

	constructor(option: DiscordAppOption) {
		this.option = option;
		this.bindings = {} as Env["Bindings"];
	}

	bind<T>(key: string, value: T) {
		(this.bindings as Record<string, unknown>)[key] = value;
	}

	handle(interaction: APIInteraction) {
		if (interaction.type === InteractionType.Ping) {
			return this.option.ping();
		}
		if (interaction.type === InteractionType.ApplicationCommand) {
			return this.option.applicationCommand();
		}
	}
}
