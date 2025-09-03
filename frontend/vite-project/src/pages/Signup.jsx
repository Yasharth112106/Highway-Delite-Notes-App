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

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/send-otp", {
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

  // Step 2: Verify OTP and Signup
  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
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
    <div style={{ padding: "20px" }}>
      <h2>Signup</h2>

      {!otpSent ? (
        <>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP & Signup</button>
        </>
      )}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
      <button>Signup with Google</button>
    </div>
  );
}
