const STATUS_STYLES = {
  pending: "border-ink text-ink",
  accepted: "border-success text-success",
  rejected: "border-danger text-danger",
};

const StatusBadge = ({ status }) => (
  <span
    className={`stamp inline-block border px-2 py-1 ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}
  >
    {status}
  </span>
);

export default StatusBadge;