// interface MessageAttributes {
//   [key: string]: string;
// }

interface ConversationEntry {
  from?: string;
  from_content?: string;
//   from_attributes?: MessageAttributes;
  to?: string;
  to_content?: string;
//   to_attributes?: MessageAttributes;
}

interface Conversation {
  [key: string]: ConversationEntry;
}

const formatConversation = (conversation: Conversation): string => {
  let formattedString = '';

  for (const key in conversation) {
    if (conversation.hasOwnProperty(key)) {
      const entry = conversation[key];
      if (entry.from && entry.from_content) {
        // formattedString += `${entry.from}: ${entry.from_content} (${JSON.stringify(entry.from_attributes)})\n`;
        formattedString += `${entry.from}: ${entry.from_content} \n`;
      }
      if (entry.to && entry.to_content) {
        // formattedString += `${entry.to}: ${entry.to_content} (${JSON.stringify(entry.to_attributes)})\n`;
        formattedString += `${entry.to}: ${entry.to_content}\n`;
      }
    }
  }

  return formattedString.trim();
};

export default formatConversation;
