import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import PromoCarousel from "./PromoCarousel";
import QuickActions from "./QuickActions";

interface Account {
  accountId: string;
  balance: number;
  currency: string;
  ownerName?: string;
}

interface AccountOption {
  accountId: string;
  ownerName?: string;
}

const ACCOUNT_URL = "https://j432m5qthj.execute-api.us-east-1.amazonaws.com/dev/account";
const ACCOUNTS_LIST_URL = "https://j432m5qthj.execute-api.us-east-1.amazonaws.com/dev/accounts";
const TRANSFER_URL = "https://j432m5qthj.execute-api.us-east-1.amazonaws.com/dev/transfer";

function Dashboard() {
  const { accountId, logout } = useAuth();
  const navigate = useNavigate();

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [accountOptions, setAccountOptions] = useState<AccountOption[]>([]);
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [transferStatus, setTransferStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAccount = () => {
    setLoading(true);
    fetch(`${ACCOUNT_URL}?accountId=${accountId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch account");
        return res.json();
      })
      .then((data: Account) => setAccount(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const fetchAccountOptions = () => {
    fetch(ACCOUNTS_LIST_URL)
      .then((res) => res.json())
      .then((data: AccountOption[]) => {
        // Exclude the logged-in user's own account from the list
        setAccountOptions(data.filter((a) => a.accountId !== accountId));
      })
      .catch(() => {
        // Non-critical if this fails — form still works with manual entry fallback
      });
  };

  useEffect(() => {
    if (accountId) {
      fetchAccount();
      fetchAccountOptions();
    }
  }, [accountId]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTransferStatus(null);

    try {
      const res = await fetch(TRANSFER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAccountId: accountId,
          toAccountId,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setTransferStatus(data.error || "Transfer failed");
      } else {
        setTransferStatus("Transfer successful!");
        setAmount("");
        setToAccountId("");
        fetchAccount();
      }
    } catch {
      setTransferStatus("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <p className="status">Loading...</p>;
  if (error) return <p className="status error">Error: {error}</p>;
  if (!account) return null;

  return (
    <div className="dashboard">
      <Navbar ownerName={account.ownerName} />
      <PromoCarousel />
      <QuickActions onTransferClick={() => setShowForm(true)} />
      <section className="balance-card">
        <p className="label">
          {account.ownerName ? `Welcome, ${account.ownerName}` : "Current Balance"}
        </p>
        <h2>
          ${account.balance.toFixed(2)} {account.currency}
        </h2>
        <p className="account-id">Account: {account.accountId}</p>
      </section>

      {!showForm && (
        <button className="transfer-btn" onClick={() => setShowForm(true)}>
          Transfer Money
        </button>
      )}

      {showForm && (
        <form className="transfer-form" onSubmit={handleTransfer}>
          <label>
            To Account
            <select
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select an account
              </option>
              {accountOptions.map((opt) => (
                <option key={opt.accountId} value={opt.accountId}>
                  {opt.ownerName ? `${opt.ownerName} (${opt.accountId})` : opt.accountId}
                </option>
              ))}
            </select>
          </label>

          <label>
            Amount
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="transfer-btn" disabled={submitting}>
            {submitting ? "Sending..." : "Send"}
          </button>

          {transferStatus && (
            <p className={transferStatus.includes("successful") ? "status success" : "status error"}>
              {transferStatus}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

export default Dashboard;