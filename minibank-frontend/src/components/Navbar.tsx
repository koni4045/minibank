import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  ownerName?: string;
}

function Navbar({ ownerName }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = ownerName
    ? ownerName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <nav className="navbar">
      <div className="navbar-brand">MiniBank</div>

      <div className="navbar-menu" ref={menuRef}>
        <button className="avatar-btn" onClick={() => setMenuOpen((v) => !v)}>
          {initials}
        </button>

        {menuOpen && (
          <div className="dropdown">
            <p className="dropdown-name">{ownerName || "Account"}</p>
            <button className="dropdown-item" onClick={() => setMenuOpen(false)}>
              Profile
            </button>
            <button className="dropdown-item" onClick={() => setMenuOpen(false)}>
              Settings
            </button>
            <button className="dropdown-item dropdown-danger" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;