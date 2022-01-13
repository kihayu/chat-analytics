import { Database, ID, Message } from "@pipeline/Types";
import { BitStream } from "@pipeline/report/BitStream";
import { readMessage } from "@pipeline/report/serialization/MessageSerialization";
import { Filters } from "@pipeline/aggregate/Filters";

export const parseAndFilterMessages = (
    fn: (msg: Message, channelId: ID) => void,
    database: Database,
    filters: Filters,
    activeFilters = { channels: true, authors: true, time: true }
) => {
    const stream = new BitStream(database.serialized?.buffer);
    for (let i = 0; i < database.channels.length; i++) {
        // filter channel
        if (activeFilters.channels && !filters.hasChannel(i)) continue;
        const channel = database.channels[i];

        // seek
        stream.offset = channel.msgAddr;

        // read messages
        for (let read = 0; read < channel.msgCount; read++) {
            const message = readMessage(stream, database.bitConfig);
            // filter author
            if (!activeFilters.authors || filters.hasAuthor(message.authorId)) {
                // filter time
                if (!activeFilters.time || filters.inTime(message.dayIndex)) {
                    fn(message, i);
                }
            }
        }
    }
};
