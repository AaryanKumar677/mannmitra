import React from "react";
import "./Resources.css";

const videoResources = [
  {
    id: 1,
    title: "Time Management Tips for Students",
    description:
      "Watch this video to learn practical time management strategies for college students.",
    link: "#",
  },
  {
    id: 2,
    title: "Mindfulness for Stress Relief",
    description:
      "A short video guide to practicing mindfulness and reducing stress effectively.",
    link: "#",
  },
];

export default function Resources() {
  return (
    <div className="booking-page resources-page">
      <div className="booking-header">
        <h1>Resources</h1>
        <p className="subtitle">
          Learn, listen, and watch to improve your mental health and wellbeing.
        </p>
      </div>

      {/* Video Section */}
      <section className="section resource-section">
        <h2 className="section-title">Videos</h2>
        <div className="video-grid">
          {videoResources.map((video) => (
            <div key={video.id} className="video-card card">
              <div className="video-thumb">🎬</div>
              <h3 className="card-title">{video.title}</h3>
              <p className="card-desc">{video.description}</p>
              <a href={video.link} className="btn btn-primary">
                Watch
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Audio Section */}
      <section className="section resource-section">
        <h2 className="section-title">Audio</h2>
        <div className="coming-soon">Coming Soon 🎧</div>
      </section>

      {/* Podcast Section */}
      <section className="section resource-section">
        <h2 className="section-title">Podcasts</h2>
        <div className="coming-soon">Coming Soon 🎙️</div>
      </section>
    </div>
  );
}
