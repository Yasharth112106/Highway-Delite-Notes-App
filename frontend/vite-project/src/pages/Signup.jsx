// import React, { useState } from "react";
// import { signup } from "../services/api";
// import { useNavigate } from "react-router-dom";

// function Signup() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || !password) return setError("All fields required");

//     const res = await signup(email, password);
//     if (res.error) return setError(res.error);

//     navigate("/login");
//   };

//   return (
//     <div className="container">
//       <h2>Signup</h2>
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
//         <button type="submit">Signup</button>
//       </form>
//       {error && <p className="error">{error}</p>}
//     </div>
//   );
// }

// export default Signup;

import { useState ,useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: import.meta.env.GOOGLE_CLIENT_ID,  // 🔹 replace with real client ID
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignupDiv"),
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
      const res = await fetch("http://localhost:5000/signup/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob, email }), // ✅ send all fields
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

  // Step 2: Verify OTP and Signup
  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/signup/verify-otp", {
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
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      {/* Logo + Title */}
      <div className="flex items-center justify-center mb-4">
        {/* <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div> */}
        <span className="text-lg font-bold">HD</span>
      </div>

      <h2 className="text-2xl font-semibold text-center mb-1">Sign up</h2>
      <p className="text-gray-500 text-center mb-6 text-sm">
        Sign up to enjoy the feature of HD
      </p>

      {!otpSent ? (
        <>
          <label className="block text-sm text-gray-600 mb-1">Your Name</label>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block text-sm text-gray-600 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full border px-3 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handleSendOtp}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Get OTP
          </button>
        </>
      ) : (
        <>
          <label className="block text-sm text-gray-600 mb-1">OTP</label>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border px-3 py-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            onClick={handleVerifyOtp}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Verify OTP & Signup
          </button>
        </>
      )}

      {/* Divider */}
      <p className="text-sm text-center mt-4 text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Sign in
        </Link>
      </p>

      <div className="flex justify-center mt-4" id="googleSignupDiv"></div>
    </div>
  </div>
);

}
