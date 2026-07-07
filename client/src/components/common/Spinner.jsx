const Spinner = ({ size = 32, className = "" }) => (
  <div
    className={`flex items-center justify-center ${className}`}
    role="status"
    aria-label="Loading"
  >
    <div
      style={{ width: size, height: size }}
      className="border-2 border-line border-t-ink rounded-full animate-spin"
    />
  </div>
);

export default Spinner;