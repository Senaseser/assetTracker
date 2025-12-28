import { useAuthStore } from "./stores/authStore";
import DashboardPage from "./components/DashboardPage";
import LoginPage from "./components/LoginPage";

function App() {
  const { username, login, logout } = useAuthStore();

  if (!username) {
    return <LoginPage onLogin={login} />;
  }

  return <DashboardPage loggedInUser={username} onLogout={logout} />;
}

export default App;
