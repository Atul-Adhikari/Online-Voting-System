import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateVote.css";

const CreateVote = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    options: [{ text: "", imageUrl: "" }, { text: "", imageUrl: "" }],
    duration: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const nepaliProvinces = [
    "Koshi Province",
    "Madhesh Province",
    "Bagmati Province",
    "Gandaki Province",
    "Lumbini Province",
    "Karnali Province",
    "Sudurpashchim Province",
  ];

  const handleChange = (e, index) => {
    if (e.target.name === "options") {
      const updatedOptions = [...form.options];
      updatedOptions[index].text = e.target.value;
      setForm({ ...form, options: updatedOptions });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleImageUrlChange = (e, index) => {
    const updatedOptions = [...form.options];
    updatedOptions[index].imageUrl = e.target.value;
    setForm({ ...form, options: updatedOptions });
  };

  const addOption = () => {
    if (
      form.options.length < 10 &&
      form.options[form.options.length - 1].text.trim() !== ""
    ) {
      setForm({
        ...form,
        options: [...form.options, { text: "", imageUrl: "" }],
      });
    } else {
      setError("Option cannot be empty. Please fill the previous option before adding a new one.");
    }
  };

  const removeOption = (index) => {
    const updatedOptions = form.options.filter((_, i) => i !== index);
    setForm({ ...form, options: updatedOptions });
  };

  const validateForm = () => {
    if (
      !form.title ||
      !form.duration ||
      form.options.some((opt) => !opt.text.trim())
    ) {
      setError("Please fill in all fields and ensure no option is empty.");
      return false;
    }
    if (form.options.length < 2) {
      setError("At least two options are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const optionsForServer = form.options.map((opt) => ({
        name: opt.text.trim(),
        imageUrl: opt.imageUrl.trim(),
      }));

      const response = await fetch("http://localhost:3333/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          duration: Number(form.duration),
          address: form.address.trim(),
          options: optionsForServer,
        }),
      });

      if (!response.ok) throw new Error("Poll creation failed.");

      setSuccess("Poll created successfully!");
      setTimeout(() => setSuccess(""), 5000);

      setForm({
        title: "",
        description: "",
        options: [{ text: "", imageUrl: "" }, { text: "", imageUrl: "" }],
        duration: "",
        address: "",
      });
    } catch (err) {
      setError(err.message || "Poll creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-vote-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate("/admin")}>
        ← Back to Dashboard
      </button>

      <h2 className="create-vote-heading">Create New Poll</h2>

      {error && <p className="message-error">{error}</p>}
      {success && <p className="message-success">{success}</p>}

      <form onSubmit={handleSubmit} className="form-wrapper">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Poll Title"
          className="input-field"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Poll Description"
          className="textarea-field"
        />

        <select
          name="address"
          value={form.address}
          onChange={handleChange}
          className="input-field"
          required
        >
          <option value="">Select Province</option>
          {nepaliProvinces.map((prov, idx) => (
            <option key={idx} value={prov}>{prov}</option>
          ))}
        </select>

        {form.options.map((option, idx) => (
          <div key={idx} className="option-group">
            <input
              name="options"
              value={option.text}
              onChange={(e) => handleChange(e, idx)}
              placeholder={`Option ${idx + 1}`}
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={option.imageUrl}
              onChange={(e) => handleImageUrlChange(e, idx)}
              className="input-field"
            />
            {option.imageUrl && (
              <img
                src={option.imageUrl}
                alt={`Preview ${idx + 1}`}
                className="option-image"
              />
            )}
            {form.options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(idx)}
                className="remove-option"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addOption} className="add-option-btn">
          + Add Option
        </button>

        <input
          name="duration"
          value={form.duration}
          onChange={handleChange}
          placeholder="Duration (in hours)"
          type="number"
          min="0.01"
          step="0.01"
          className="duration-input"
          required
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </form>
    </div>
  );
};

export default CreateVote;
