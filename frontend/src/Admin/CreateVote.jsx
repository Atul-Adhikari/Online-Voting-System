import React, { useState } from "react";
import "./CreateVote.css";

const CreateVote = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    options: [{ text: "", file: null }, { text: "", file: null }],
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

  const addOption = () => {
    if (
      form.options.length < 10 &&
      form.options[form.options.length - 1].text.trim() !== ""
    ) {
      setForm({
        ...form,
        options: [...form.options, { text: "", file: null }],
      });
    } else {
      setError(
        "Option cannot be empty. Please fill the previous option before adding a new one."
      );
    }
  };

  const removeOption = (index) => {
    const updatedOptions = form.options.filter((_, i) => i !== index);
    setForm({ ...form, options: updatedOptions });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const updatedOptions = [...form.options];
      updatedOptions[index].file = file;
      setForm({ ...form, options: updatedOptions });
    }
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
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("duration", Number(form.duration));
      formData.append("address", form.address.trim());

      const optionsForServer = form.options.map((opt) => ({
        text: opt.text.trim(),
      }));

      formData.append("options", JSON.stringify(optionsForServer));

      form.options.forEach((opt) => {
        if (opt.file) {
          formData.append("images", opt.file);
        }
      });

      const response = await fetch("http://localhost:3333/polls", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Poll creation failed.");

      const data = await response.json();
      setSuccess("Poll created successfully!");
        setTimeout(() => {
      setSuccess("");
      }, 5000); // 5 seconds


      setForm({
        title: "",
        description: "",
        options: [{ text: "", file: null }, { text: "", file: null }],
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
            <option key={idx} value={prov}>
              {prov}
            </option>
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
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, idx)}
              className="file-input"
            />

            {option.file && (
              <img
                src={URL.createObjectURL(option.file)}
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
