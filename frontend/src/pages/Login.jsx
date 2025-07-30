import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ExpenseContext } from "../context/ExpenseContext";


function Login() {
  const [currentState, setCurrentState] = useState("Sign up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { BackendUrl, token, setToken } = useContext(ExpenseContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (currentState === "Sign up") {
        const response = await axios.post(`${BackendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Registered successfully");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${BackendUrl}/api/user/login`, {
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Logged in successfully");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/app");
    }
  }, [token, navigate]);

  return (
    <div className="w-[100vw] bg-purple-500 h-[100vh] flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="p-2 bg-white w-[90%] sm:max-w-96 flex flex-col items-center pb-4"
      >
        <div className="flex items-center mb-4">
          <p className="font-bold text-3xl prata-regular">{currentState}</p>
        </div>

        <div className="flex flex-col gap-4 items-center w-[90%] sm:max-w-96 m-auto text-gray-800">
          {currentState === "Sign up" && (
            <input
              placeholder="Name"
              className="w-full px-3 py-2 border border-gray-800"
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
              value={name}
            />
          )}

          <input
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-800"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            value={email}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-800"
            required
          />
        </div>

        <div className="flex justify-between w-full px-2 mt-2 mb-2 text-gray-600 text-sm">
          <p className="cursor-pointer hover:font-bold">Forgot password?</p>
          {currentState === "Login" ? (
            <p
              onClick={() => setCurrentState("Sign up")}
              className="cursor-pointer hover:font-bold"
            >
              Create account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer hover:font-bold"
            >
              Login here
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-purple-700 px-4 py-1 text-md hover:bg-purple-900 text-white rounded"
        >
          {currentState === "Login" ? "Sign in" : "Sign up"}
        </button>
      </form>
    </div>
  );
}

export default Login;
