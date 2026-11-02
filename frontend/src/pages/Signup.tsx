import BottomWarning from "../Components/BottomWarning";
import Button from "../Components/Button";
import Heading from "../Components/Heading";
import InputBox from "../Components/InputBox";
import SubHeading from "../Components/SubHeading";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const firstRef = useRef<HTMLInputElement>(null);
  const lastRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  return (
    <div className='bg-slate-300 h-screen flex justify-center'>
      <div className='flex flex-col justify-center'>
        <div className='rounded-lg bg-white w-80 text-center p-2 h-max px-4'>
          <Heading label='Sign up' />
          <SubHeading label='Enter your infromation to create an account' />
          <InputBox
            reference={firstRef}
            placeholder='John'
            label='First Name'
          />
          <InputBox reference={lastRef} placeholder='Doe' label='Last Name' />
          <InputBox
            reference={usernameRef}
            placeholder='johndoe@gmail.com'
            label='Email'
          />
          <InputBox reference={passwordRef} label='Password' type='password' />
          <div className='pt-4'>
            <Button
              label='Sign up'
              onClick={async () => {
                const firstName = firstRef.current?.value;
                const lastName = lastRef.current?.value;
                const username = usernameRef.current?.value;
                const password = passwordRef.current?.value;
                if (!firstName || !lastName || !username || !password) {
                  alert("All fields are required");
                  return;
                }
                try {
                  await axios.post("http://localhost:3000/api/v1/user/signup", {
                    firstName,
                    lastName,
                    username,
                    password,
                  });
                  console.log("Signup successful");
                  navigate("/signin");
                } catch (error) {
                  console.log(error);
                }
              }}
            />
          </div>
          <BottomWarning
            label='Already have an account?'
            buttonText='Sign in'
            to='/signin'
          />
        </div>
      </div>
    </div>
  );
};
export default Signup;
