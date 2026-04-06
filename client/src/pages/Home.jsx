import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mt-10">
        Welcome to the Home Page
      </h1>

      <div className="mt-6">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default Home;
