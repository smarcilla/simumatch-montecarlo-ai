export default function Loading() {
  return (
    <div className="main-content">
      <div
        style={{
          marginBottom: "var(--spacing-xl)",
          padding: "var(--spacing-lg)",
          background: "var(--primary-alpha)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--primary)",
        }}
      >
        <h2 style={{ marginBottom: "var(--spacing-sm)" }}>
          Listado de Partidos
        </h2>
        <p
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--text-secondary)",
          }}
        >
          Cargando...
        </p>
      </div>

      <div className="matches-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="match-card skeleton"
            style={{
              animation: "pulse 1.5s ease-in-out infinite",
              background: "var(--surface-secondary)",
            }}
          >
            <div style={{ height: "120px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
