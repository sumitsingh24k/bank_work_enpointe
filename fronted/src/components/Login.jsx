import React from 'react'
const LoginOrSignups = () => {
    const [login, setlogin] = React.useState(true);
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [role, setRole] = React.useState("customer");
    const [error, setError] = React.useState("");
    
    const toggle = () => {
        setlogin(!login);
        setError("");
    };

    const validateform = () => {
        if (!email || !password) {
            setError("Please fill all the fields");
            return false;
        }
        if (!login && !name) {
            setError("Please fill your name");
            return false;
        }
        return true;
    };

    const handleSignup = async () => {
        if (!validateform()) return;

        const data = { name, email, password, role };

        try {
            const res = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (result.success) {
                alert("Signup successful! Please login.");
                setlogin(true);
                setName("");
                setEmail("");
                setPassword("");
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Server error");
        }
    };

    const handleLogin = async () => {
        if (!validateform()) return;

        const data = { email, password, role };

        try {
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (result.success) {
                localStorage.setItem("token", result.token);
                localStorage.setItem("role", result.role);

                if (result.role === "customer") {
                    window.location.href = "/customer/dashboard";
                } else {
                    window.location.href = "/banker/dashboard";
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Server error");
        }
    };

    return (
    <div className="min-h-screen w-full flex items-center justify-center 
                    bg-linear-to-br from-gray-900 via-gray-800 to-black px-4">

        {/* CARD */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl 
                        rounded-3xl shadow-2xl p-8 border border-white/20">

            {/* Heading */}
            <h2 className="text-3xl font-bold text-center text-white drop-shadow-md">
                {login ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="text-center text-gray-300 text-sm mb-6">
                {login ? "Sign in to continue" : "Join us and get started"}
            </p>

            {/* ERROR */}
            {error && (
                <div className="bg-red-500/20 border-l-4 border-red-400 text-red-300 
                                px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            {/* FORM */}
            <form className="space-y-4">

                {!login && (
                    <div>
                        <label className="text-gray-200 text-sm mb-1 block">Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white
                                       placeholder-gray-300 border border-white/30 
                                       focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>
                )}

                <div>
                    <label className="text-gray-200 text-sm mb-1 block">Email Address</label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/20 text-white
                                   placeholder-gray-300 border border-white/30 
                                   focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                </div>

                <div>
                    <label className="text-gray-200 text-sm mb-1 block">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/20 text-white
                                   placeholder-gray-300 border border-white/30 
                                   focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                </div>

                <div>
                    <label className="text-gray-200 text-sm mb-1 block">Account Type</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/20 text-white
                                   border border-white/30 focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="customer" className="text-black">Customer</option>
                        <option value="banker" className="text-black">Banker</option>
                    </select>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                    type="button"
                    onClick={login ? handleLogin : handleSignup}
                    className="w-full py-3 rounded-xl bg-linear-to-r 
                               from-indigo-500 to-purple-600 text-white font-semibold
                               hover:scale-[1.03] active:scale-95 transition-all
                               shadow-lg mt-4"
                >
                    {login ? "Sign In" : "Create Account"}
                </button>
            </form>

            {/* OR DIVIDER */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-gray-400">or</span>
                </div>
            </div>

            {/* TOGGLE LOGIN/SIGNUP */}
            <div className="text-center">
                <p className="text-gray-300 text-sm">
                    {login ? "Don't have an account?" : "Already have an account?"}
                </p>

                <button
                    onClick={toggle}
                    className="text-indigo-400 font-semibold hover:underline hover:text-indigo-300"
                >
                    {login ? "Sign Up Now" : "Sign In Now"}
                </button>
            </div>
        </div>
    </div>
    );
};

export default LoginOrSignups;