interface Action {
  label: string;
  icon: string;
  onClick: () => void;
}

interface QuickActionsProps {
  onTransferClick: () => void;
}

function QuickActions({ onTransferClick }: QuickActionsProps) {
  const actions: Action[] = [
    { label: "Transfer", icon: "↔", onClick: onTransferClick },
    { label: "Pay Bills", icon: "🧾", onClick: () => alert("Coming soon") },
    { label: "Deposit", icon: "⬇", onClick: () => alert("Coming soon") },
    { label: "Cards", icon: "💳", onClick: () => alert("Coming soon") },
  ];

  return (
    <div className="quick-actions">
      {actions.map((action) => (
        <button key={action.label} className="quick-action" onClick={action.onClick}>
          <span className="quick-action-icon">{action.icon}</span>
          <span className="quick-action-label">{action.label}</span>
        </button>
      ))}
    </div>
  );
}

export default QuickActions;