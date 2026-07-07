const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-line">
    {Icon && <Icon size={36} className="text-gray-soft mb-4" />}
    <h3 className="font-display text-lg mb-1">{title}</h3>
    {description && (
      <p className="text-gray-mid text-sm max-w-sm mb-4">{description}</p>
    )}
    {action}
  </div>
);

export default EmptyState;
