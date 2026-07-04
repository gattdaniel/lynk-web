import { useContext, useState } from "react";
import { MessageCircle, Building, Settings, Home, LogOut } from "lucide-react";
import InboxList from "./InboxList";
import Department from "./departement";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/context";

export default function Choice() {
  const { Logout } = useContext(AuthContext);
  const [selected, setSelected] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: "home",
      icon: Home,
      label: "Accueil",
      action: () => navigate("/room"),
    },
    {
      id: "chats",
      icon: MessageCircle,
      label: "Chats",
      action: () => setSelected("chats"),
    },
    {
      id: "departements",
      icon: Building,
      label: "Départements",
      action: () => setSelected("departements"),
    },
  ];

  return (
    <div className="flex h-screen">
      {/* SIDEBAR ICÔNES */}
      <div className="flex flex-col items-center justify-between py-4 px-2 bg-black w-16 h-full border-r border-gray-800">
        {/* Icônes du haut */}
        <ul className="flex flex-col gap-2">
          {navItems.map(({ id, icon: Icon, label, action }) => {
            const isActive =
              selected === id ||
              (id === "home" && location.pathname === "/room");
            return (
              <li key={id} className="relative group">
                <button
                  onClick={action}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#0b525b] text-white shadow-lg shadow-teal-900/40"
                        : "bg-[rgb(31,36,46)] text-gray-400 hover:bg-[#0b525b] hover:text-white"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                </button>

                {/* Tooltip */}
                <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[rgb(43,53,66)] text-white text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 border border-gray-700">
                  {label}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Bouton ⚙️ en bas */}
        <div className="relative group">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200
              ${
                settingsOpen
                  ? "bg-[#0b525b] text-white"
                  : "bg-[rgb(31,36,46)] text-gray-400 hover:bg-[rgb(43,53,66)] hover:text-white"
              }`}
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Tooltip */}
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[rgb(43,53,66)] text-white text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 border border-gray-700">
            Paramètres
          </span>

          {/* Menu déconnexion */}
          {settingsOpen && (
            <div className="absolute bottom-12 left-2 bg-[rgb(31,36,46)] border border-gray-700 rounded-xl shadow-2xl p-3 z-50 min-w-[160px]">
              <p className="text-xs text-gray-400 mb-2 px-1">Options</p>
              <button
                onClick={Logout}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-900/30 hover:text-red-300 transition text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ZONE DE CONTENU */}
      <div className="bg-[rgb(31,36,46)] border-r border-gray-800 rounded">
        {selected === "chats" && <InboxList />}
        {selected === "departements" && <Department />}
        {!selected && <InboxList />}
      </div>
    </div>
  );
}
