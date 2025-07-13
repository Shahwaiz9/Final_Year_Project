import { BsPersonCircle } from "react-icons/bs";
import logo from "../../assets/PlantHavenLogo.png";
import { useNavigate } from "react-router-dom";

function Header({ OpenSidebar }) {
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-left">PlantHaven Admin</div>
      <div className="header-right flex items-center gap-4">
        <button
          onClick={logout}
          className="flex items-center gap-2 hover:bg-cyan-950 
                   px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm
                   border border-blue-950"
        >
          <BsPersonCircle className="text-lg" />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
