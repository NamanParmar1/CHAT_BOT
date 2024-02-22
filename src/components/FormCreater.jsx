import React, { useState, useRef, useCallback, useEffect } from "react";
import compromise from "compromise";
import suggestions from "./suggestions";
import "./form.css";
import DynamicForm from "./DynamicForm";

const FormCreator = () => {
  const [chatMessages, setChatMessages] = useState([
    { user: false, message: `Type "Hi" or "Hello" to chat..` },
  ]);
  const [formFields, setFormFields] = useState([]);
  const [formName, setFormName] = useState("");
  const [formCreated, setFormCreated] = useState(false);
  const [askForFormName, setAskForFormName] = useState(false);
  const [command, setCommand] = useState("");
  const [showCreateFormButton, setShowCreateFormButton] = useState(false);
  const inputRef = useRef(null);

  const updateFormFields = useCallback((updatedFields) => {
    setFormFields(updatedFields);
    console.log(updatedFields); // Log the updatedFields directly
  }, []);

  useEffect(() => {
    const chatArea = document.querySelector(".chat-area");
    chatArea.scrollTop = chatArea.scrollHeight;
  }, [chatMessages]);

  const handleInputChange = (e) => {
    setCommand(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userMessage = command.trim();
    const userMessageObj = { user: true, message: userMessage };
    setChatMessages((prevMessages) => [...prevMessages, userMessageObj]);

    const parsedInput = compromise(userMessage);
    const intent = determineIntent(parsedInput);

    if (intent === "createForm") {
      const fields = extractFields(parsedInput);
      setFormFields(fields);
      setAskForFormName(true); // Prompt for form name
      setShowCreateFormButton(false);
      setCommand("");
      const botResponse = "Great! Please provide a name for your form.";
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { user: false, message: botResponse },
      ]);
    } else if (askForFormName) {
      setFormName(userMessage); // Set form name
      setAskForFormName(false);
      setCommand("");
      const botResponse = `Form "${userMessage}" Created .`;
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { user: false, message: botResponse },
      ]);
    } else if (intent === "addField") {
      const newField = extractNewField(parsedInput);
      // Check if formName is set before adding fields
      if (formName && !askForFormName) {
        setFormFields((prevFields) => [...prevFields, newField]);
      } else {
        // Provide feedback to the user to set the form name first
        const botResponse = "Please set the form name before adding fields.";
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { user: false, message: botResponse },
        ]);
      }
      const botResponse =
        suggestions.addField[
          Math.floor(Math.random() * suggestions.addField.length)
        ];
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { user: false, message: botResponse },
      ]);
    } else if (intent === "greeting") {
      const botResponse =
        suggestions.greeting[
          Math.floor(Math.random() * suggestions.greeting.length)
        ];
      setShowCreateFormButton(true);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { user: false, message: botResponse },
      ]);
    } else {
      const botResponse =
        suggestions.unknown[
          Math.floor(Math.random() * suggestions.unknown.length)
        ];
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { user: false, message: botResponse },
      ]);
      setShowCreateFormButton(true);
    }
    setCommand("");
  };
  // const scrollToBottom = () => {

  //   const chatArea = document.querySelector(".chat-area");
  //   chatArea.scrollTop = chatArea.scrollHeight;
  // };

  const determineIntent = (parsedInput) => {
    if (
      parsedInput.match("(create|make|generate) form with").found ||
      parsedInput.match("(create|make|generate) a form with").found
    ) {
      return "createForm";
    } else if (parsedInput.match("(add) field").found) {
      return "addField";
    } else if (parsedInput.match("(hi|hello)").found) {
      return "greeting";
    }
    return "unknown";
  };

  const extractFields = (parsedInput) => {
    const inputText = parsedInput.text();
    const withIndex = inputText.indexOf("with");
    if (withIndex !== -1) {
      const fieldsString = inputText.substring(withIndex + 4).trim();
      const fields = fieldsString.split(",");
      const parsedFields = fields.map((field) => {
        const trimmedField = field.trim();
        const nameAndType = trimmedField.split(" as ");
        const name = nameAndType[0].trim();
        const type = nameAndType[1] ? nameAndType[1].trim() : "text";
        return { name, type };
      });
      return parsedFields.filter((field) => field.name !== "");
    }
    return [];
  };

  const extractNewField = (parsedInput) => {
    const inputText = parsedInput.text();
    const addIndex = inputText.indexOf("add field");
    if (addIndex !== -1) {
      const fieldsString = inputText.substring(addIndex + 9).trim();
      const fields = fieldsString.split("as").map((field) => field.trim());
      const name = fields[0];
      const type = fields[1] ? fields[1] : "text";
      return { name, type };
    }
    return null;
  };

  const handleSuggestionClick = (suggestion) => {
    setCommand(suggestion);
    inputRef.current.value = "";
    inputRef.current.focus();
    const userResponse = "Create form";
    const botResponse =
      "Ok great, you want to create a form. Let's get you started.";
    setShowCreateFormButton(false);
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { user: true, message: userResponse },
    ]);
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { user: false, message: botResponse },
    ]);
  };

  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  return (
    <>
      <div className="bot_form">
        <h1>CIGNA-BOT</h1>
        <div className="parent">
          <div className="form-creator-container">
            <div className="chat-area">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.user ? "user" : "bot"}`}
                >
                  <p>{message.message}</p>
                </div>
              ))}

              <div className="suggestions">
                {showCreateFormButton && (
                  <span
                    className="suggestion create-form"
                    onClick={() =>
                      handleSuggestionClick(
                        "create form with field1 as type, field2 as type, etc.."
                      )
                    }
                  >
                    Create Form
                  </span>
                )}
              </div>
            </div>
            <form className="botform" onSubmit={handleSubmit}>
              <input
                type="text"
                value={command}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                className="input-field"
                ref={inputRef}
              />
              <button type="submit" className="send-button">
                Send
              </button>
            </form>
          </div>

          <div className="dynamic-form-container">
            <DynamicForm
              formFields={formFields}
              formName={formName}
              // closeModal={closeModal}
              updateFormFields={updateFormFields}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FormCreator;
