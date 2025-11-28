import React, { useState, useEffect, useRef, useCallback } from "react";
import { AiOutlineSend } from "react-icons/ai";
// import { MdOutlineAttachFile } from "react-icons/md";
import { FaRegCircleStop } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
// import { AiOutlineEdit } from "react-icons/ai";
// import Testimonial from "./Testimonial";
import img1 from "../../../assets/icon.svg";
import img2 from "../../../assets/icon2.jpg";

// import { useOutletContext } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import apiRequest from "../../../utils/apiRequest";
import { toast } from "react-toastify";
import { useApiResponse } from "../../../utils/context";
import { useSideBar } from "../../../utils/SideBarContext";
import { useConversation } from "../../../utils/conversationId";
import { useLocation, useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [copy, setCopy] = useState(false);
  // const [editingMessage, setEditingMessage] = useState(null);
  const [copied, setCopied] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  // const { isSidebarOpen } = useOutletContext();
  // Removed file upload functionality
  const [ConversationId, setConversationId] = useState(null);
  const token = null; // No authentication required

  const theme = localStorage.getItem("theme");
  const imgSrc = theme === "dark" ? img2 : img1;

  // File upload functionality removed

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 10;
      setShowArrow(!isAtBottom);
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(null);
      }, 2000);
    });
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // const handleEdit = (index) => {
  //   setInput(messages[index].text);
  //   setEditingMessage(index);
  // };

  // const handleSave = () => {
  //   if (editingMessage !== null) {
  //     const updatedMessages = [...messages];
  //     updatedMessages[editingMessage] = {
  //       ...updatedMessages[editingMessage],
  //       text: input,
  //     };
  //     setMessages(updatedMessages);
  //     setEditingMessage(null);
  //     setLoading(true);
  //     setInput("");
  //     setTimeout(() => {
  //       const container = messagesContainerRef.current;
  //       if (container) {
  //         const isAtBottom =
  //           container.scrollHeight - container.scrollTop ===
  //           container.clientHeight;
  //         setShowArrow(!isAtBottom);
  //       }
  //       scrollToBottom();
  //       setLoading(false);
  //     }, 1000);
  //   }
  // };

  // const handleCancel = () => {
  //   setEditingMessage(null);
  //   setInput("");
  // };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, isResponse: false };
    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);
    setInput("");

    const loadingMessage = { text: "Loading...", isResponse: true };
    setMessages((prev) => [...prev, loadingMessage]);

    const response = await handleApiRequest();

    if (response) {
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          text: response,
          isResponse: true,
        };
        return updatedMessages;
      });
    }

    setLoading(false);
    scrollToBottom();
  };

  const { handleResponseReceived, resetResponseReceived } = useApiResponse();
  const location = useLocation();
  const [analysisConversationId, setAnalysisConversationId] = useState(null);

  const handleApiRequest = async () => {
    // Use the current conversation ID or create a new one
    const currentConversationId = conversationId || ConversationId || analysisConversationId;
    
    const values = {
      query: input,
      ...(currentConversationId ? { conversationId: currentConversationId } : {}),
    };

    try {
      const response = await apiRequest("post", "/gpt/chat", values, token);

      if (response.status === 200) {
        // Update conversation ID if we don't have one
        const newConversationId = response.data.conversationId;
        if (!ConversationId && !conversationId && !analysisConversationId) {
          setConversationId(newConversationId);
          setGlobalConversationId(newConversationId);
        }
        handleResponseReceived();
        return response.data.response;
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const { conversationId, setConversationId: setGlobalConversationId } = useConversation();
  const [apiCalled, setApiCalled] = useState(false);
  const { clickedItem, setClickedItem } = useSideBar();
  
  const resetConversation = useCallback(() => {
    resetResponseReceived();
    setMessages([]);
    setInput("");
    setConversationId(null);
    setGlobalConversationId(null);
    setAnalysisConversationId(null);
    setApiCalled(false);
    // Clear the previous conversation ID ref
    previousConversationIdRef.current = null;
  }, [
    resetResponseReceived,
    setMessages,
    setInput,
    setConversationId,
    setGlobalConversationId,
  ]);

  useEffect(() => {
    if (clickedItem) {
      resetConversation();
      setClickedItem(null);
    }
  }, [clickedItem, setClickedItem, resetConversation]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const chatId = analysisConversationId || conversationId || ConversationId;
      
      // If we have a conversation ID, fetch its history
      if (chatId) {
        try {
          const response = await apiRequest(
            "get",
            `/gpt/single-chat-history/${chatId}`,
            {},
            token
          );

          if (response.status === 200) {
            const chatHistory = response.data
              .map((message) => {
                const messages = [];

                // Add user query
                if (message.query) {
                  messages.push({
                    text: message.query,
                    isResponse: false,
                  });
                }

                // Add chatbot response
                if (message.chatbotResponse) {
                  messages.push({
                    text: message.chatbotResponse,
                    isResponse: true,
                  });
                }

                return messages;
              })
              .flat();

            setMessages(chatHistory);
          } else if (response && response.status === 401) {
            toast.error("Authentication error");
          }
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      } else {
        // No conversation ID means new chat - clear messages
        setMessages([]);
      }
    };

    fetchChatHistory();
  }, [
    analysisConversationId,
    conversationId,
    ConversationId,
    token,
    navigate,
  ]);

  useEffect(() => {
    if (clickedItem) {
      setAnalysisConversationId(null);
      setClickedItem(false);
    } else if (!clickedItem && location.state?.conversationId) {
      // Clear messages when switching to a different conversation
      setMessages([]);
      setAnalysisConversationId(location.state.conversationId);
    }
  }, [clickedItem, setClickedItem, location.state]);

  useEffect(() => {
    if (!location.state?.conversationId) {
      setAnalysisConversationId(null);
    }
  }, [location.state]);

  // Track previous conversation ID to detect changes
  const previousConversationIdRef = useRef(null);
  
  // Clear messages when conversation ID changes
  useEffect(() => {
    const currentConversationId = analysisConversationId || conversationId || ConversationId;
    
    if (previousConversationIdRef.current && previousConversationIdRef.current !== currentConversationId) {
      setMessages([]);
    }
    
    previousConversationIdRef.current = currentConversationId;
  }, [analysisConversationId, conversationId, ConversationId]);

  const renderFormattedText = (text) => {
    // Handle code blocks first
    const codePattern = /```([\s\S]+?)```/g;
    const parts = text.split(codePattern);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a code block
        const handleCopy = () => {
          navigator.clipboard.writeText(part).then(() => {
            setCopy(true);
            setTimeout(() => setCopy(false), 2000);
          });
        };
        return (
          <div
            key={index}
            className="bg-backgroundthree text-texttwo p-4 rounded-xl my-3 relative group cursor-pointer"
            style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            onClick={handleCopy}
            title="Copy code"
          >
            <pre className="text-sm overflow-x-auto">{part}</pre>
            <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {copy ? (
                <FaCheck size={15} className="text-green-500" />
              ) : (
                <IoCopyOutline size={15} />
              )}
            </span>
          </div>
        );
      } else {
        // Regular text - apply formatting
        return (
          <div key={index} className="formatted-text">
            {formatTextContent(part)}
          </div>
        );
      }
    });
  };

  const formatTextContent = (text) => {
    // Split by double line breaks for paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    
    return paragraphs.map((paragraph, pIndex) => {
      if (!paragraph.trim()) return null;
      
      // Check if it's a list (starts with bullet points or numbers)
      const listItems = paragraph.split('\n').filter(line => 
        line.trim().match(/^[•\-\*]\s/) || line.trim().match(/^\d+\.\s/)
      );
      
      if (listItems.length > 0 && listItems.length === paragraph.split('\n').filter(l => l.trim()).length) {
        // This is a list
        return (
          <ul key={pIndex} className="list-disc list-inside space-y-1 my-3 ml-4">
            {listItems.map((item, iIndex) => (
              <li key={iIndex} className="text-text">
                {formatInlineText(item.replace(/^[•\-\*]\s|^\d+\.\s/, ''))}
              </li>
            ))}
          </ul>
        );
      } else {
        // Regular paragraph
        const lines = paragraph.split('\n');
        return (
          <div key={pIndex} className="mb-4">
            {lines.map((line, lIndex) => {
              if (!line.trim()) return <br key={lIndex} />;
              
              // Check if it's a heading (starts with #)
              if (line.trim().startsWith('#')) {
                const level = line.match(/^#+/)[0].length;
                const text = line.replace(/^#+\s*/, '');
                const HeadingTag = `h${Math.min(level, 6)}`;
                const headingClasses = {
                  1: "text-xl font-bold text-text mt-4 mb-2",
                  2: "text-lg font-bold text-text mt-3 mb-2",
                  3: "text-base font-bold text-text mt-2 mb-1",
                };
                
                return React.createElement(HeadingTag, {
                  key: lIndex,
                  className: headingClasses[level] || headingClasses[3]
                }, formatInlineText(text));
              }
              
              return (
                <p key={lIndex} className="text-text leading-relaxed">
                  {formatInlineText(line)}
                </p>
              );
            })}
          </div>
        );
      }
    }).filter(Boolean);
  };

  const formatInlineText = (text) => {
    // Handle bold text **text**
    const boldPattern = /\*\*(.*?)\*\*/g;
    const parts = text.split(boldPattern);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-semibold text-text">{part}</strong>;
      }
      
      // Handle inline code `code`
      const codePattern = /`([^`]+)`/g;
      const codeParts = part.split(codePattern);
      
      return codeParts.map((codePart, cIndex) => {
        if (cIndex % 2 === 1) {
          return (
            <code key={`${index}-${cIndex}`} className="bg-backgroundthree text-texttwo px-1 py-0.5 rounded text-sm">
              {codePart}
            </code>
          );
        }
        return codePart;
      });
    });
  };

  const SkeletonLoader = () => {
    return (
      <div className="flex items-start space-x-3">
        <img
          src={imgSrc}
          alt="Icon"
          className="w-7 h-7 mt-1 rounded-full flex-shrink-0 border-[1px] p-1 border-border"
        />
        <div className="ml-4 mt-[14px] rounded-lg w-[250px] h-3 bg-gray-200 animate-pulse"></div>
      </div>
    );
  };

  return (
    <div className="flex bg-background flex-col h-[88.5vh] px-4">
      {messages.length > 0 && (
        <div className="flex justify-center">
          <div
            ref={messagesContainerRef}
            className="flex flex-col items-center overflow-y-auto sm:max-h-[calc(100vh-200px)] max-h-[calc(100vh-200px)] scrollbar-custom space-y-4 p-4 max-w-4xl w-full"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  msg.isResponse ? "self-start" : "self-end"
                }`}
                style={{ maxWidth: msg.isResponse ? "97%" : "80%" }}
              >
                {msg.isResponse && loading && index === messages.length - 1 ? (
                  <SkeletonLoader />
                ) : (
                  <>
                    {msg.isResponse && (
                      <img
                        src={imgSrc}
                        alt="Icon"
                        className="w-7 h-7 mt-1 rounded-full flex-shrink-0 border-[1px] p-1 border-border"
                      />
                    )}
                    <div
                      className={`relative pt-1.5 rounded-2xl text-sm break-words ${
                        msg.isResponse
                          ? "bg-background text-text pr-4 pl-1.5"
                          : "bg-backgroundtwo text-text px-4"
                      } group`}
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {/* {!msg.isResponse && editingMessage !== index && (
                    <AiOutlineEdit
                      onClick={() => handleEdit(index)}
                      className={`${
                        fileNames.length > 0
                          ? "top-6 -left-4"
                          : "top-1.5 -left-7"
                      } absolute cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-text hover:text-blue-500`}
                      size={16}
                    />
                  )} */}

                      {msg.files && msg.files.length > 0 && (
                        <div className="my-2 flex space-x-2 -ml-1">
                          {msg.files.map((fileName) => (
                            <div
                              key={fileName}
                              className="bg-backgroundfive text-text px-2 py-2 rounded-xl flex items-center text-xs space-x-2"
                            >
                              <FaFileAlt />
                              <span>{fileName?.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {
                        // editingMessage === index ? (
                        //   <div className="relative">
                        //     <textarea
                        //       value={input}
                        //       onChange={(e) => setInput(e.target.value)}
                        //       onInput={(e) => {
                        //         e.target.style.height = "auto";
                        //         e.target.style.height = `${Math.min(
                        //           e.target.scrollHeight,
                        //           200
                        //         )}px`;
                        //       }}
                        //       className={`border-t border-l border-r rounded-t-3xl border-border max-w-[500px] w-[180px] min-[400px]:w-[250px] min-[500px]:w-[330px] min-[600px]:w-[360px] sm:w-[430px] ${
                        //         isSidebarOpen ? "md:w-[400px]" : "md:w-[500px]"
                        //       } max-h-[200px] min-h-20 sm:max-h-[250px] overflow-y-auto p-4 focus:outline-none text-sm bg-background resize-none scrollbar-custom`}
                        //       style={{
                        //         height: `${Math.min(input.length / 10, 200)}px`,
                        //       }}
                        //     />
                        //     <div className="flex justify-end space-x-2 -mt-1.5 p-2 bg-background border-b border-l border-r rounded-b-3xl border-border">
                        //       <button
                        //         onClick={handleCancel}
                        //         className="text-text bg-backgroundtwo hover:bg-backgroundthree hover:text-texttwo py-2 px-4 rounded-full"
                        //       >
                        //         Cancel
                        //       </button>
                        //       <button
                        //         onClick={handleSave}
                        //         className="text-background bg-text hover:bg-texthover py-2 px-4 rounded-full"
                        //       >
                        //         Send
                        //       </button>
                        //     </div>
                        //   </div>
                        // ) :
                        <div>{renderFormattedText(msg.text)}</div>
                      }

                      {msg.isResponse && (
                        <div
                          className="absolute -bottom-3 left-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyText(msg.text)}
                        >
                          {copied ? (
                            <FaCheck size={15} className="text-green-500" />
                          ) : (
                            <IoCopyOutline size={15} />
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}

            {showArrow && (
              <div
                className="bottom-36 absolute z-50 cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-background shadow-lg"
                onClick={scrollToBottom}
              >
                <FaArrowDown className="text-text" size={16} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      <div
        className={`flex flex-col items-center justify-center ${
          messages.length ? "mt-auto" : "flex-grow"
        }`}
      >
        {!messages.length && (
          <h1 className="text-2xl text-text sm:text-3xl font-bold mb-4">
            What can I help with?
          </h1>
        )}
        <div
          className={`relative w-full max-w-4xl ${
            !messages.length ? "mb-4" : "mb-2 mt-4 sm:mt-0"
          } rounded-3xl overflow-hidden`}
        >
          <div className="relative">
            {/* File upload removed */}
            <textarea
              value={
                // editingMessage !== null ? "" :
                input
              }
              onChange={(e) => {
                // if (editingMessage === null) {
                setInput(e.target.value);
                // }
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(
                  e.target.scrollHeight,
                  150
                )}px`;
              }}
              placeholder="Message ChatConnect"
              rows={1}
              // disabled={loading} p
              // disabled={editingMessage !== null}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!loading) handleSend();
                }
              }}
              className="w-full max-h-9 text-text sm:max-h-14 overflow-y-auto p-4 focus:outline-none text-sm bg-backgroundfour rounded-t-3xl resize-none scrollbar-custom"
            />
          </div>
          <div className="flex items-center justify-end -mt-2 rounded-b-3xl bg-backgroundfour px-3 pt-5 pb-3">
            <button
              onClick={
                // editingMessage === null ?
                handleSend
                // : handleSave
              }
              disabled={
                loading
                //  || editingMessage !== null
              }
              className="absolute right-1 -bottom-1 text-text hover:text-blue-500 p-3 rounded-full transition"
            >
              {loading ? (
                <FaRegCircleStop size={20} />
              ) : (
                <AiOutlineSend size={20} />
              )}
            </button>
          </div>
        </div>

        {/* {!messages.length && <Testimonial />} */}
      </div>

      {/* <h1
        className={`text-text text-[11px] text-nowrap ${
          !messages.length ? "mt-3" : ""
        } text-center`}
      >
        ChatConnect can make mistakes. Check important info.
      </h1> */}
    </div>
  );
}
