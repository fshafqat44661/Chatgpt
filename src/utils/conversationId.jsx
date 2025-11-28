import React, { createContext, useState, useContext } from 'react';

const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
  const [conversationId, setConversationId] = useState(null);

  return (
    <ConversationContext.Provider value={{ conversationId, setConversationId }}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  return useContext(ConversationContext);
};
