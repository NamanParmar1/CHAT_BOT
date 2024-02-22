import React, { useEffect, useState } from "react";
import {
  ref,
  child,
  get,
  set,
  update,
  getDatabase,
  push,
} from "firebase/database";
import db from "./Firebase/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
 
import firebaseApp from "./Firebase/firebase";
import ConfirmationModal from "./ConfirmationModal.jsx";
 
const DynamicForm = ({ formFields, formName, updateFormFields }) => {
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [fields, setFields] = useState(formFields);
  const [Name, setName] = useState(formName);
  const [formdata, setFormData] = useState({});
 
  useEffect(() => {
    setFields(formFields);
    setName(formName);
  }, [formFields, formName]);
 
  useEffect(() => {
    updateFormFields(fields);
  }, [fields, updateFormFields]);
 
  const addField = () => {
    const newField = prompt(
      'Enter the name and type of the new field (e.g., "fieldName [as type]"):'
    );
    if (newField) {
      const [name, type] = newField.split(" as ");
      setFields([
        ...fields,
        { name: name.trim(), type: type ? type.trim() : "text" },
      ]);
    }
  };
 
  const handleOpenModal = () => {
    if (!Name || typeof Name !== "string" || Name.trim() === "") {
      const name = prompt("Enter form name");
      setName(name);
      //console.error('Invalid form name');
      return;
    }
    setConfirmationModalOpen(true);
  };
 
  const handleCloseModal = () => {
    setConfirmationModalOpen(false);
  };
 
  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    handleCloseModal();
    handleSubmit(e);
  };
 
  const removeField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    // Ensure Name is a non-empty string
 
    //Firestore database storage
    try {
      const formData = fields.reduce((result, field) => {
        const fieldValue = document.getElementById(field.name)?.value;
    
        if (fieldValue) {
          result[field.name] = fieldValue;
        }
    
        return result;
      }, {});
    
      const formsSnapshot = await addDoc(collection(db, "data"), formData);
    
    } catch (error) {
      console.error("Error storing form Data:", error);
    }
 
    try {
      const formData = {
        formIDname: Name, 
        ...fields.reduce((result, field) => {
          if (field.type === "text") {
            result[field.name] = "string";
          } else {
            result[field.name] = field.type;
          }
          return result;
        }, {}),
      };
    
      const formsSnapshot1 = await addDoc(collection(db, "form"), formData);
    
    } catch (error) {
      console.error("Error storing form structure:", error);
    }
 
    //RealTime Database storage block
 
    // const formData = {
    //   data: fields.reduce((result, field) => {
    //     const fieldValue = document.getElementById(field.name)?.value;
    //     if (fieldValue) {
    //       result[field.name] = fieldValue;
    //     }
    //     return result;
    //   }, {}),
    //   datatype: fields.reduce((result, field) => {
    //     if (field.type === "text") {
    //       result[field.name] = "string";
    //     } else {
    //       result[field.name] = field.type;
    //     }
 
    //     return result;
    //   }, {}),
    // };
 
    // const database = getDatabase(firebaseApp);
    // const formsRef = ref(database, "forms");
    // const formNameRef = child(formsRef, Name);
 
    // // Use push to automatically generate a unique key for each submission
    // const newFormRef = push(formNameRef);
 
    // // Set the data under the newly generated key
    // await set(newFormRef, formData);
 
    // console.log(formData);
  };
 
  return (
    <>
      <div className="dynamic-form-container">
        <div className="form-preview">
          <div className="top">
            <button onClick={addField}>
              ADD
            </button>
            <h2>{Name ? Name : "Dynamic Form"}</h2>
          </div>
          {fields.length === 0 ? (
            <h3 style={{ textAlign: "center" }}>
              No fields to display, Use ChatBot to create a form
            </h3>
          ) : (
            <form onSubmit={handleSubmit}>
              {fields.map((field, index) => (
                <div key={index}>
                  <label htmlFor={field.name}>{field.name}</label>
                  {field.type === "int" ? (
                    <input type="number" id={field.name} name={field.name} />
                  ) : field.type === "date" ? (
                    <input type="date" id={field.name} name={field.name} />
                  ) : (
                    <input type="text" id={field.name} name={field.name} />
                  )}
                  <button type="button" onClick={() => removeField(index)}>
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="submit-button"
                onClick={handleOpenModal}
              >
                Submit
              </button>
            </form>
          )}
 
          {/* <button onClick={addField} className="add-field-button">Add Field</button> */}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmSubmit}
      />
    </>
  );
};
 
export default DynamicForm;