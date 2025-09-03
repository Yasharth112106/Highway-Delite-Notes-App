// import React, { useState } from "react";
// import { login } from "../services/api";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || !password) return setError("All fields required");

//     const res = await login(email, password);
//     if (res.error) return setError(res.error);

//     localStorage.setItem("token", res.token);
//     navigate("/notes");
//   };

//   return (
//     <div className="container">
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Enter Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Enter Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="submit">Login</button>
//       </form>
//       {error && <p className="error">{error}</p>}
//     </div>
//   );
// }

// export default Login;

//changign to passwordLess login wiht OTP acc to the figma design
//2nd draft
import { useState , useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
// import {dotenv} from "dotenv";
// dotenv.config();

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    /* global google */
   google.accounts.id.initialize({
  client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  callback: handleCredentialResponse,
});

    google.accounts.id.renderButton(
      document.getElementById("googleLoginDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);

  
  const handleCredentialResponse = async (response) => {
    const res = await fetch("http://localhost:5000/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: response.credential }),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } else {
      alert("Google login failed");
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/login/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        alert("OTP sent to email!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying OTP");
    }
  };

  


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-6 w-80">
        {/* Logo + Title */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-2">
            <span className="text-3xl">HD</span>
          </div>
          <h2 className="text-xl font-bold">Sign In</h2>
          <p className="text-sm text-gray-500">
            Please login to continue to your account.
          </p>
        </div>

        {/* Form */}
        {!otpSent ? (
          <>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <label className="text-sm font-medium text-gray-600">OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              Verify OTP
            </button>
            <p className="text-xs text-blue-500 mt-2 cursor-pointer hover:underline">
              Resend OTP
            </p>
          </>
        )}

        {/* Divider */}
        <div className="my-4 text-center text-sm text-gray-400">or</div>

        {/* Google Button */}
        <div id="googleLoginDiv" className="flex justify-center"></div>

        {/* Bottom Link */}
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

