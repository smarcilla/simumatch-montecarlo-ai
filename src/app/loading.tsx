export default function Loading() {
  return (
    <div className="main-content">
      <div className="info-banner">
        <h2>SimuMatch AI</h2>
        <p className="text-muted">...</p>
      </div>

      <div className="matches-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="match-card skeleton skeleton-card">
            <div className="skeleton-card-body" />
          </div>
        ))}
      </div>
    </div>
  );
}
