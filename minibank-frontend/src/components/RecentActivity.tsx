interface Activity {
  id: string;
  type: "sent" | "received";
  counterparty: string;
  amount: number;
  date: string;
}

const mockActivity: Activity[] = [
  { id: "1", type: "sent", counterparty: "Jane Doe", amount: 50, date: "Today" },
  { id: "2", type: "received", counterparty: "Zeshan", amount: 120, date: "Yesterday" },
  { id: "3", type: "sent", counterparty: "acc_002", amount: 25.5, date: "2 days ago" },
];

function RecentActivity() {
  return (
    <div className="activity-card">
      <h3 className="activity-title">Recent Activity</h3>

      {mockActivity.length === 0 ? (
        <p className="status">No recent activity</p>
      ) : (
        <ul className="activity-list">
          {mockActivity.map((item) => (
            <li key={item.id} className="activity-item">
              <div className={`activity-icon ${item.type}`}>
                {item.type === "sent" ? "↑" : "↓"}
              </div>

              <div className="activity-details">
                <p className="activity-party">{item.counterparty}</p>
                <p className="activity-date">{item.date}</p>
              </div>

              <p className={`activity-amount ${item.type}`}>
                {item.type === "sent" ? "-" : "+"}${item.amount.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecentActivity;