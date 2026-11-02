import { useEffect, useState } from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/v1/user/bulk?filter=" + filter, {
          headers: {
            Authorization: "Bearer " + token
          }
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    const timeout = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timeout);
  }, [filter]);

  return (
    <>
      <div className='font-bold mt-6 text-lg'>Users</div>
      <div className='my-2'>
        <input
          onChange={(e) => setFilter(e.target.value)}
          type='text'
          placeholder='Search users...'
          className='w-full px-2 py-1 border rounded border-slate-200'
        ></input>
      </div>
      <div>
        {users.map((user: any) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </>
  );
};

interface UserProps {
  user: {
    firstName: string;
    lastName: string;
    _id: string;
  };
}
function User({ user }: UserProps) {
  return (
    <div className='flex justify-between mt-2'>
      <div className='flex'>
        <div className='rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2'>
          <div className='flex flex-col justify-center h-full text-xl'>
            {user.firstName[0]}
          </div>
        </div>
        <div className='flex flex-col justify-center h-full'>
          <div>
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-center h-full'>
        <Link to={`/send?id=${user._id}&name=${user.firstName}`}>
          <Button label={"Send Money"} />
        </Link>
      </div>
    </div>
  );
}

export default Users;
