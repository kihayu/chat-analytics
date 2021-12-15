import { FileInput } from "@pipeline/Types";
import { Parser } from "@pipeline/parse/Parser";

/*
    There is a convenient parser already out there
*/
import { parseStringSync } from "whatsapp-chat-parser";

export class WhatsAppParser extends Parser {
    private channelIndex = 0;
    private messageIndex = 0;

    constructor() {
        super("whatsapp");
    }

    async *parse(file: FileInput) {
        const file_buffer = await file.slice();
        const file_content = new TextDecoder("utf-8").decode(file_buffer);
        const parsed = parseStringSync(file_content);

        const channelId = this.addChannel(this.channelIndex++, {
            name: "default",
        });

        for (const message of parsed) {
            const timestamp = message.date.getTime();

            if (message.author !== "System") {
                const authorId = this.addAuthor(message.author, {
                    name: message.author,
                    bot: false,
                });
                this.addMessage(this.messageIndex++, channelId, {
                    authorId,
                    content: message.message,
                    timestamp,
                });
            } else {
                // TODO: parse system messages
            }
        }

        this.updateTitle("WhatsApp chat"); // TODO: chat or group
    }
}
