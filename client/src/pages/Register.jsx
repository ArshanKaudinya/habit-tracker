import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(email, password);
            toast.success("Registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
            <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-800">
                <h2 className="text-3xl font-bold text-sky-400 mb-6 text-center">Register</h2>
                <div className="space-y-4">
                    <input
                        className="w-full bg-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 outline-none transition"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="w-full bg-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 outline-none transition"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]">
                        Register
                    </button>
                </div>
                <p className="mt-4 text-center text-slate-400">
                    Already have an account? <Link to="/login" className="text-sky-400 hover:underline">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
