import React, { useState } from "react";
import "./CreateVote.css";

const CreateVote = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    options: [{ text: "", image: "" }, { text: "", image: "" }],
    duration: "",
    province: ""
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
    "Sudurpashchim Province"
  ];

  const handleChange = (e, index) => {
    if (e.target.name === "options") {
      const updatedOptions = [...form.options];
      updatedOptions[index][e.target.id] = e.target.value;
      setForm({ ...form, options: updatedOptions });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addOption = () => {
    if (form.options.length < 10 && form.options[form.options.length - 1].text.trim() !== "") {
      setForm({ ...form, options: [...form.options, { text: "", image: "" }] });
    } else {
      setError("Option cannot be empty. Please fill the previous option before adding a new one.");
    }
  };

  const removeOption = (index) => {
    const updatedOptions = form.options.filter((_, i) => i !== index);
    setForm({ ...form, options: updatedOptions });
  };

  const handleImageDrop = (e, index) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const updatedOptions = [...form.options];
      updatedOptions[index].image = URL.createObjectURL(file);
      setForm({ ...form, options: updatedOptions });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const updatedOptions = [...form.options];
      updatedOptions[index].image = URL.createObjectURL(file);
      setForm({ ...form, options: updatedOptions });
    }
  };

  const validateForm = () => {
    if (!form.title || !form.duration || form.options.some(opt => !opt.text.trim())) {
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
      const response = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          options: form.options.map((option) => ({ text: option.text.trim(), image: option.image })),
          duration: Number(form.duration),
          province: form.province.trim(),
          status: "Active"
        })
      });

      if (!response.ok) throw new Error("Poll creation failed");

      await response.json();
      setSuccess("Poll created successfully!");
      setForm({ title: "", description: "", options: [{ text: "", image: "" }, { text: "", image: "" }], duration: "", province: "" });
    } catch (err) {
      setError(err.message || "Poll creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-vote-container">
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
          placeholder="Poll Description (optional)"
          className="textarea-field"
        />

        <select
          name="province"
          value={form.province}
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
              id="text"
              name="options"
              value={option.text}
              onChange={(e) => handleChange(e, idx)}
              placeholder={`Option ${idx + 1}`}
              className="input-field"
              required
            />
            <div
              className="drop-zone"
              onDrop={(e) => handleImageDrop(e, idx)}
              onDragOver={handleDragOver}
            >
              <span>Drag & drop image or click to upload</span>
              <input
                type="file"
                onChange={(e) => handleImageChange(e, idx)}
                className="file-input"
              />
            </div>
            {option.image && <img src={option.image} alt={`Option ${idx + 1}`} className="option-image" />}
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

        <button
          type="button"
          onClick={addOption}
          className="add-option-btn"
        >
          + Add Option
        </button>

        <input
          name="duration"
          value={form.duration}
          onChange={handleChange}
          placeholder="Duration (in hours)"
          type="number"
          min="1"
          className="duration-input"
          required
        />

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </form>
    </div>
  );
};

export default CreateVote;
