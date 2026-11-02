import BottomWarning from "../Components/BottomWarning";
import Button from "../Components/Button";
import Heading from "../Components/Heading";
import InputBox from "../Components/InputBox";
import SubHeading from "../Components/SubHeading";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  return (
    <div className='bg-slate-300 h-screen flex justify-center'>
      <div className='flex flex-col justify-center'>
        <div className='rounded-lg bg-white w-80 text-center p-2 h-max px-4'>
          <Heading label='Sign In' />
          <SubHeading label='Enter your credentials to access your account' />
          <InputBox reference={usernameRef} placeholder='johndoe@gmail.com' label='Email' />
          <InputBox reference={passwordRef} label='Password' type='password' />
          <div className='pt-4'>
            <Button
              label='Sign In'
              onClick={async () => {
                const username = usernameRef.current?.value;
                const password = passwordRef.current?.value;

                if (!username || !password) {
                  alert("Both fields are required");
                  return;
                }

                try {
                  const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
                    username,
                    password,
                  });
                  localStorage.setItem("token", response.data.token);
                  navigate("/dashboard");
                } catch (error) {
                  console.error(error);
                  alert("Invalid credentials. Please try again.");
                }
              }}
            />
          </div>
          <BottomWarning
            label='Dont have an account?'
            buttonText='Sign Up'
            to='/signup'
          />
        </div>
      </div>
    </div>
  );
};
export default Signin;
