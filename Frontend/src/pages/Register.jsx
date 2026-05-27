import { useState } from "react";
import { registerUser as registerService } from "../../Services/authService";

function Register()
{
  const [formData , setFormData]=useState({
    username:"",
    email:"",
    password:"",
    role:"",
    address:"",
    phone_number:"",

  });

  const registerUser = async (e) => {
    e.preventDefault();
    try{
      await registerService(formData);
      alert("Registration successful! Please login.");

    }
    catch(error)
    {
      console.log(error);

    }
  };
  return (
    <form onSubmit= {registerUser}>
      <input 
      type="text"
      placeholder="Username"
      onChange={(e)=>
        setFormData({
          ...formData,username:e.target.value
        })

      }/>
      <input 
      type="email"
      placeholder="Email"
      onChange={(e)=>
        setFormData({
          ...formData,email:e.target.value
        })

      }/>
      <input 
      type="password"
      placeholder="Password"
      onChange={(e)=>
        setFormData({
          ...formData,password:e.target.value
        })

      }/>
      <input 
      type="text"
      placeholder="Role"
      onChange={(e)=>
        setFormData({
          ...formData,role:e.target.value
        })

      }/>
      <input 
      type="text"
      placeholder="Address"
      onChange={(e)=>
        setFormData({
          ...formData,address:e.target.value
        })

      }/>
      <input 
      type="text"
      placeholder="Phone Number"
      onChange={(e)=>
        setFormData({
          ...formData,phone_number:e.target.value
        })

      }/>
      <button type= "submit">Register</button>

    </form>
  );
}

export default Register;
