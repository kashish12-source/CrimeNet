import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser as loginService } from "../../Services/authService";

function Login()
{
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();
    try{
      const formData = { email, password };
      const response = await loginService(formData);

      localStorage.setItem("token",response.data.token);

      navigate("/dashboard");

    }
    catch(error)
    {
      console.log(error);
      alert("Login failed. Please check your credentials and try again.");

    }
  };
  return (
    <div>
      <h1>Login</h1>

      <form onSubmit = {loginUser}>
        <input 
        type="email"
        placeholder="Email"
        onChange={(e)=>
          setEmail(e.target.value)

        }/>

        <input 
        type="password"
        placeholder="Password"
        onChange={(e)=>
          setPassword(e.target.value)
        }/>

        <button type = "submit">Login</button>
      </form>
    </div>
  )
}
export default Login;