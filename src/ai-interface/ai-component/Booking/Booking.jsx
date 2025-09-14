// Booking.jsx
import React, { useState, useEffect, useCallback } from "react";
import "./Booking.css";

const doctors = [
  { 
    name: "Dr. Arvind Sametha", 
    specialization: "Psychiatrist", 
    rating: 4.8,
    bio: "Certified psychiatrist with 8 years of experience in treating anxiety, depression, and adolescent stress disorders."
  },
  { 
    name: "Dr. Riya Verma", 
    specialization: "Neurologist", 
    rating: 4.6,
    bio: "Neurologist specializing in cognitive assessments, migraine management, and neurological wellness programs."
  },
  { 
    name: "Dr. Kabir Singh", 
    specialization: "Psychologist", 
    rating: 4.7,
    bio: "Clinical psychologist helping patients with emotional regulation, coping strategies, and mental resilience."
  },
  { 
    name: "Dr. Nisha Patel", 
    specialization: "Counselor", 
    rating: 4.5,
    bio: "Professional counselor focusing on stress management, relationship guidance, and personal development."
  },
  { 
    name: "Dr. Ishan Rao", 
    specialization: "Adolescent Psych", 
    rating: 4.4,
    bio: "Adolescent psychologist experienced in teenage mental health, anxiety, and school-related stress support."
  }
];

const therapists = [
  { 
    name: "Anika Mehta", 
    specialization: "Cognitive Therapy", 
    rating: 4.6,
    bio: "Cognitive therapist helping clients improve thought patterns, emotional well-being, and behavioral change."
  },
  { 
    name: "Raj Malhotra", 
    specialization: "Behavioral Therapy", 
    rating: 4.7,
    bio: "Behavioral therapist focusing on habit control, emotional regulation, and stress reduction techniques."
  },
  { 
    name: "Meera Joshi", 
    specialization: "Mindfulness", 
    rating: 4.5,
    bio: "Mindfulness coach guiding clients on meditation, self-awareness, and emotional balance practices."
  },
  { 
    name: "Aman Singh", 
    specialization: "Stress Management", 
    rating: 4.8,
    bio: "Therapist specializing in stress management, relaxation techniques, and work-life balance strategies."
  },
  { 
    name: "Priya Kapoor", 
    specialization: "Art Therapy", 
    rating: 4.6,
    bio: "Art therapist using creative expression to enhance emotional well-being, reduce anxiety, and foster healing."
  }
];

export default function Booking() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewPerson, setViewPerson] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");


  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [notes, setNotes] = useState("");

  const openModal = (person) => {
    setSelectedPerson(person);
    setModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedPerson(null);
    setNotes("");
    setFirstName("");
    setLastName("");
    setAge("");
  }, []);

  const openViewModal = (person) => {
    setViewPerson(person);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewPerson(null);
    setViewModalOpen(false);
  };

  useEffect(() => {
    if (!modalOpen) return;
    const modalEl = document.querySelector(".modal");
    if (!modalEl) return;
    const prevFocused = document.activeElement;
    const focusable = modalEl.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (focusable || modalEl).focus();

    function handleKey(e) {
      if (e.key === "Escape") {
        closeModal();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = modalEl.querySelectorAll(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      prevFocused?.focus();
    };
  }, [modalOpen, closeModal]);

  const handleConfirm = (e) => {
    e.preventDefault();
    alert(
      `Booking confirmed:
    Name: ${firstName} ${lastName}
    Age: ${age}
    With: ${selectedPerson.name} (${selectedPerson.specialization})
    Date: ${selectedDate} @ ${selectedTime}
    Notes: ${notes}`
    );
    closeModal();
  };

  const renderCard = (person) => (
    <div className="card">
      <div className="avatar">
        <span className="avatar-initial">
          {person.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </span>
      </div>

      <div className="card-body">
        <h3 className="card-title">{person.name}</h3>
        <p className="card-sub">{person.specialization}</p>
        <div className="card-meta">
          <p className="card-ratings"><strong>Ratings:</strong> ★ {person.rating}</p>
          <p className="card-duration"><strong>Duration:</strong> 30–60 min</p>
        </div>
      </div>

      <div className="card-footer">
        <button
          className="btn btn-primary"
          onClick={() => openModal(person)}
          aria-label={`Book ${person.name}`}
        >
          Book Now
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => openViewModal(person)}
        >
          View
        </button>
      </div>
    </div>
  );

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>Book a Session</h1>
        <p className="subtitle">
          Choose a doctor or therapist and schedule a confidential session.
        </p>
      </div>

      <section className="section">
        <h2 className="section-title">Doctors</h2>
        <div className="grid">
          {doctors.map((d) => (
            <React.Fragment key={d.name}>{renderCard(d)}</React.Fragment>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Therapists</h2>
        <div className="grid">
          {therapists.map((t) => (
            <React.Fragment key={t.name}>{renderCard(t)}</React.Fragment>
          ))}
        </div>
      </section>

      {/* View Modal */}
      {viewModalOpen && (
        <div className="modal-overlay">
          <div className="modal" role="dialog" aria-modal="true">
            <button className="modal-close" onClick={closeViewModal}>
              ✕
            </button>

            <div className="modal-header">
              <h3>{viewPerson?.name}</h3>
              <p className="muted">{viewPerson?.specialization}</p>
            </div>

            <div className="modal-form">
              <p><strong>Rating:</strong> {viewPerson?.rating} ★</p>
              <p><strong>Experience:</strong> 5+ years</p>
              <p><strong>Specialties / Methods:</strong></p>
              <ul>
                <li>Cognitive Behavioral Therapy</li>
                <li>Mindfulness</li>
                <li>Stress Management</li>
              </ul>
              <p><strong>Session Duration:</strong> 30–60 min</p>
              <p><strong>Bio:</strong> {viewPerson?.bio}</p>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
          >
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="modal-header">
              <h3 id="modal-title">Booking: {selectedPerson?.name}</h3>
              <p className="muted">{selectedPerson?.specialization}</p>
            </div>

            <form className="modal-form" onSubmit={handleConfirm}>
                {/* First Name */}
                <label className="field">
                    <span className="field-label">First Name</span>
                    <input 
                        type="text" 
                        placeholder="Enter your first name" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required 
                    />
                </label>

                {/* Last Name */}
                <label className="field">
                    <span className="field-label">Last Name</span>
                    <input 
                        type="text" 
                        placeholder="Enter your last name" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required 
                    />
                </label>

                {/* Age */}
                <label className="field">
                    <span className="field-label">Age</span>
                    <input 
                        type="number" 
                        min="1" 
                        placeholder="Enter your age" 
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required 
                    />
                </label>

                {/* Existing Date field */}
                <label className="field">
                    <span className="field-label">Date</span>
                    <input
                        type="date"
                        required
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </label>

                {/* Existing Time field */}
                <label className="field">
                    <span className="field-label">Time</span>
                    <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    >
                        <option>09:00</option>
                        <option>10:00</option>
                        <option>11:00</option>
                        <option>14:00</option>
                        <option>15:00</option>
                    </select>
                </label>

                {/* Existing Notes field */}
                <label className="field">
                    <span className="field-label">Notes / Concerns</span>
                    <textarea
                        placeholder="Briefly describe what you'd like help with (optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </label>

                <div className="modal-actions">
                    <button type="submit" className="btn btn-success">
                        Confirm Booking
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
