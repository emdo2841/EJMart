import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode"; // Update this line

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token); // No change here
        setUser({
          id: decoded.id,
          role: decoded.role,
        });
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("accessToken");
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (  
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
