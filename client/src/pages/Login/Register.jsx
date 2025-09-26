import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://herbsphereproject-3.onrender.com/register', { name, email, password })
            .then(result => {
                if (result.data === "Success") {
                    navigate('/login');
                } else {
                    alert(result.data);  
                } 
            })
            .catch(err => {
                console.log('Frontend Error:', err);
                alert("Email already existed.");
            });
    }

    return (
        <div className="container-register">
            <div className="box-register">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <label htmlFor="name">
                            <strong>Name</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            autoComplete="off"
                            name="name"
                            className="form-control"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="form-control"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            className="form-control"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="sub-btn">
                        Register
                    </button>
                </form>
                <p>Already Have an Account?</p>
                <Link to="/login" className="next-btn">
                    Signin
                </Link>
            </div>
        </div>
    )
}

export default Register;
