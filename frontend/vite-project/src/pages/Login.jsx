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
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

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
    <div >
      <h2>Login</h2>

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
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}

      <p>
        Don’t have an account? <Link to="/signup">Create Account</Link>
      </p>
      <button>Login with Google</button>
    </div>
  );
}
