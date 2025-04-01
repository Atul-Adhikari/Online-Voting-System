import React, { useEffect, useState } from "react";
import "./VoteList.css";

const VoteList = () => {
  const [polls, setPolls] = useState([]);
  const [editingPollId, setEditingPollId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    duration: "",
    province: "",
    options: []
  });

  const [filterProvince, setFilterProvince] = useState("");

  const nepaliProvinces = [
    "Koshi Province",
    "Madhesh Province",
    "Bagmati Province",
    "Gandaki Province",
    "Lumbini Province",
    "Karnali Province",
    "Sudurpashchim Province"
  ];

  useEffect(() => {
    // 🟡 Backend: Fetch polls from the API
    /*
    fetch("/api/polls")
      .then((res) => res.json())
      .then((data) => setPolls(data))
      .catch((err) => console.error("Fetch error:", err));
    */

    const dummyPolls = [
      {
        id: 1,
        title: "Best Programming Language?",
        description: "Vote for your favorite language in 2025.",
        createdAt: "2025-03-01",
        duration: 48,
        status: "Active",
        province: "Bagmati Province",
        options: [
          { text: "JavaScript", votes: 45, image: "https://via.placeholder.com/40" },
          { text: "Python", votes: 30, image: "https://via.placeholder.com/40" },
          { text: "Rust", votes: 25, image: "https://via.placeholder.com/40" }
        ],
      },
      {
        id: 2,
        title: "Preferred Frontend Framework",
        description: "React vs Vue vs Angular showdown!",
        createdAt: "2025-02-25",
        duration: 72,
        status: "Ended",
        province: "Gandaki Province",
        options: [
          { text: "React", votes: 60, image: "https://via.placeholder.com/40" },
          { text: "Vue", votes: 25, image: "https://via.placeholder.com/40" },
          { text: "Angular", votes: 15, image: "https://via.placeholder.com/40" }
        ],
      },
    ];
    setPolls(dummyPolls);
  }, []);

  const handleEditClick = (poll) => {
    setEditingPollId(poll.id);
    setEditForm({
      title: poll.title,
      description: poll.description,
      duration: poll.duration,
      province: poll.province,
      options: poll.options.map((opt) => ({ ...opt }))
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...editForm.options];
    newOptions[index].text = value;
    setEditForm((prev) => ({ ...prev, options: newOptions }));
  };

  const handleOptionImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newOptions = [...editForm.options];
      newOptions[index].image = URL.createObjectURL(file);
      setEditForm((prev) => ({ ...prev, options: newOptions }));
    }
  };

  const addOption = () => {
    setEditForm((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", votes: 0, image: "" }],
    }));
  };

  const removeOption = (index) => {
    if (editForm.options.length <= 2) return;
    const updated = [...editForm.options];
    updated.splice(index, 1);
    setEditForm((prev) => ({ ...prev, options: updated }));
  };

  const saveEdit = async () => {
    if (!editForm.title.trim() || editForm.options.some((opt) => !opt.text.trim())) {
      alert("Please fill out the title and all options.");
      return;
    }

    // 🟡 Backend: Update poll in the database
    /*
    await fetch(`/api/polls/${editingPollId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    */

    setPolls((prev) =>
      prev.map((poll) =>
        poll.id === editingPollId ? { ...poll, ...editForm } : poll
      )
    );
    setEditingPollId(null);
  };

  const manuallyClosePoll = async (id) => {
    // 🟡 Backend: Close poll via API
    /*
    await fetch(`/api/polls/${id}/close`, {
      method: "POST",
    });
    */
    setPolls((prev) =>
      prev.map((poll) =>
        poll.id === id ? { ...poll, status: "Ended" } : poll
      )
    );
  };

  const deletePoll = async (id) => {
    // 🟡 Backend: Delete poll
    /*
    await fetch(`/api/polls/${id}`, {
      method: "DELETE",
    });
    */
    setPolls((prev) => prev.filter((poll) => poll.id !== id));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this poll?")) {
      deletePoll(id);
    }
  };

  const calculateTotalVotes = (options) =>
    options.reduce((sum, opt) => sum + opt.votes, 0);

  const filteredPolls = filterProvince
    ? polls.filter((poll) => poll.province === filterProvince)
    : polls;

  return (
    <div className="vote-container">
      <h2 className="vote-heading">All Created Polls</h2>

      <div className="filter-bar">
        <select
          value={filterProvince}
          onChange={(e) => setFilterProvince(e.target.value)}
          className="filter-select"
        >
          <option value="">All Provinces</option>
          {nepaliProvinces.map((prov, idx) => (
            <option key={idx} value={prov}>{prov}</option>
          ))}
        </select>
      </div>

      {filteredPolls.length === 0 ? (
        <p className="coming-soon">No polls found for selected province.</p>
      ) : (
        <div className="poll-list">
          {filteredPolls.map((poll) => {
            const totalVotes = calculateTotalVotes(poll.options);
            return (
              <div className="poll-card" key={poll.id}>
                {editingPollId === poll.id && poll.status === "Active" ? (
                  <>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="edit-input"
                      placeholder="Poll title"
                    />
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      className="edit-textarea"
                      placeholder="Poll description"
                    />
                    <input
                      type="number"
                      name="duration"
                      value={editForm.duration}
                      onChange={handleEditChange}
                      className="edit-input"
                      placeholder="Poll duration (hrs)"
                    />
                    <select
                      name="province"
                      value={editForm.province}
                      onChange={handleEditChange}
                      className="edit-input"
                      required
                    >
                      <option value="">Select Province</option>
                      {nepaliProvinces.map((prov, idx) => (
                        <option key={idx} value={prov}>{prov}</option>
                      ))}
                    </select>

                    <div className="edit-options">
                      {editForm.options.map((opt, idx) => (
                        <div key={idx} className="edit-option">
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                            placeholder={`Option ${idx + 1}`}
                            className="edit-input"
                          />
                          <input
                            type="file"
                            onChange={(e) => handleOptionImageChange(e, idx)}
                            className="edit-input"
                          />
                          {opt.image && <img src={opt.image} alt={`Option ${idx + 1}`} className="option-image" />}
                          <button
                            onClick={() => removeOption(idx)}
                            className="remove-btn"
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      ))}
                      <button onClick={addOption} className="action-btn save-btn">
                        <i className="fa fa-plus"></i> Add Option
                      </button>
                    </div>
                    <div className="poll-meta">
                      <span>Created: {poll.createdAt}</span>
                      <span>Duration: {poll.duration} hrs</span>
                      <span className={`poll-status ${poll.status.toLowerCase()}`}>{poll.status}</span>
                    </div>
                    <div className="poll-actions">
                      <button onClick={saveEdit} className="action-btn save-btn">
                        <i className="fa fa-floppy-disk"></i> Save
                      </button>
                      <button onClick={() => setEditingPollId(null)} className="action-btn cancel-btn">
                        <i className="fa fa-times"></i> Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="poll-title">{poll.title}</h3>
                    <p className="poll-desc">{poll.description}</p>
                    <div className="poll-meta">
                      <span>Created: {poll.createdAt}</span>
                      <span>Duration: {poll.duration} hrs</span>
                      <span className={`poll-status ${poll.status.toLowerCase()}`}>{poll.status}</span>
                    </div>
                    <ul className="poll-options">
                      {poll.options.map((opt, index) => {
                        const percentage = totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0;
                        return (
                          <li key={index} className="poll-option">
                            <span>{opt.text}</span>
                            <div className="poll-bar">
                              <div
                                className="poll-bar-fill"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="poll-percent">{percentage}%</span>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="poll-actions">
                      {poll.status === "Active" && (
                        <>
                          <button onClick={() => handleEditClick(poll)} className="action-btn edit-btn">
                            <i className="fa fa-pen-to-square"></i> Edit
                          </button>
                          <button onClick={() => manuallyClosePoll(poll.id)} className="action-btn close-btn">
                            <i className="fa fa-ban"></i> Close
                          </button>
                        </>
                      )}
                      <button id="delete-btn" onClick={() => handleDelete(poll.id)} className="action-btn delete-btn">
                        <i className="fa fa-trash"></i> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VoteList;
