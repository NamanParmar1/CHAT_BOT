import React, { useState, useEffect } from "react";
import db from "./Firebase/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import "./FormList.css";

const FormList = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const formsSnapshot = await getDocs(collection(db, "form"));
        const formData = formsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(formData);
        setForms(formData);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
  }, []);

  const openForm = (formId) => {
    setSelectedForm(formId);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formId = forms.find((form) => form.id === selectedForm).id;
      const formSubmissionsRef = collection(db, "data", formId, "submissions");
      const formDataToSubmit = { ...formData, formId };
      await addDoc(formSubmissionsRef, formDataToSubmit);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-list">
        {forms.map((form) => (
          <div
            key={form.id}
            className="form-box"
            onClick={() => openForm(form.id)}
          >
            <h2 className="formname">{form.formIDname}</h2>
            <p>Click to open the form.</p>
          </div>
        ))}

        {selectedForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="form-preview">
                <div>
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="close-modal-button"
                  >
                    X
                  </button>
                  <h2>
                    {" "}
                    {forms.find((form) => form.id === selectedForm).formIDname}
                  </h2>
                </div>
                <form onSubmit={handleSubmit}>
                  {Object.entries(
                    forms.find((form) => form.id === selectedForm)
                  )
                    .filter(
                      ([fieldName]) =>
                        fieldName !== "id" && fieldName !== "formIDname"
                    ) // Filter out the 'id' field
                    .map(([fieldName, fieldType], index) => (
                      <div key={index}>
                        <label htmlFor={fieldName}>{fieldName}</label>
                        {fieldType === "int" ? (
                          <input
                            type="number"
                            id={fieldName}
                            name={fieldName}
                            value={formData[fieldName] || ""}
                            onChange={handleInputChange}
                          />
                        ) : fieldType === "date" ? (
                          <input
                            type="date"
                            id={fieldName}
                            name={fieldName}
                            value={formData[fieldName] || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <input
                            type="text"
                            id={fieldName}
                            name={fieldName}
                            value={formData[fieldName] || ""}
                            onChange={handleInputChange}
                          />
                        )}
                      </div>
                    ))}
                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormList;
