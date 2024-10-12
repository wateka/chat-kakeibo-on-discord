import { InteractionResponseType } from "discord-api-types/v10";

export function createPingPongResponse() {
  return {
    type: InteractionResponseType.Pong,
  };
}

export function createMessageResponse(message: string) {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: message,
    },
  };
}

export class InteractionData {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  interactionData: any;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  constructor(interactionData: any) {
    this.interactionData = interactionData;
  }

  name() {
    return this.interactionData.name;
  }

  option(optionName: string) {
    const option = this.interactionData.options.find(
      (option: { name: string }) => option.name === optionName,
    );
    return option?.value;
  }
}
