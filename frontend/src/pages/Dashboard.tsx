import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Appbar from "../Components/Appbar";
import Balance from "../Components/Balance";
import Users from "../Components/Users";

const Dashboard = () => {
  const [balance, setBalance] = useState<string>("Loading...");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    axios.get("http://localhost:3000/api/v1/account/balance", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    .then(response => {
      setBalance(response.data.balance.toString());
    })
    .catch(error => {
      console.error("Error fetching balance:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem("token");
        navigate("/signin");
      }
    });
  }, [navigate]);

  return (
    <div>
      <Appbar />
      <div className='m-8'>
        <Balance value={balance} />
        <Users />
      </div>
    </div>
  );
};

export default Dashboard;
