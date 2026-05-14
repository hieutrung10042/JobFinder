import { Outlet } from "react-router-dom";
import Navbar from "./components/shared/Navbar";

function App() {
  return (
    <div className="app-container">
      {/* Navbar nằm ở đây sẽ nhận được Context từ RouterProvider trong main.tsx */}
      <Navbar />
      <main>
        <Outlet /> 
      </main>
    </div>
  );
}

export default App;