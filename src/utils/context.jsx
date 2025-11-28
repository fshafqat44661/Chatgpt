import { createContext, useContext, useState } from 'react';

const ApiResponseContext = createContext();

export const useApiResponse = () => {
  return useContext(ApiResponseContext);
};

export const ApiResponseProvider = ({ children }) => {
  const [isResponseReceived, setIsResponseReceived] = useState(false);

  const handleResponseReceived = () => {
    setIsResponseReceived(true);
  };

  const resetResponseReceived = () => {
    setIsResponseReceived(false); 
  };
  
  return (
    <ApiResponseContext.Provider value={{ isResponseReceived, handleResponseReceived, resetResponseReceived }}>
      {children}
    </ApiResponseContext.Provider>
  );
};
