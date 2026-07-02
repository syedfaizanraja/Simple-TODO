import { useState, type FormEvent } from "react";

interface AuthFormProps {
  mode: "login" | "signup";
  onSubmit: (values: {
    name?: string;
    email: string;
    password: string;
  }) => void;
  onSwitchMode: (mode: "login" | "signup") => void;
}

export function AuthForm({ mode, onSubmit, onSwitchMode }: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      name: mode === "signup" ? name : undefined,
      email,
      password,
    });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {mode === "signup" && (
        <label className="auth-field">
          <span>Full name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Jane Doe"
            required
          />
        </label>
      )}

      <label className="auth-field">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>

      <label className="auth-field">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          required
        />
      </label>

      <button type="submit" className="auth-submit">
        {mode === "login" ? "Log in" : "Create account"}
      </button>

      <p className="auth-switch">
        {mode === "login"
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <button
          type="button"
          className="text-button"
          onClick={() => onSwitchMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Sign up" : "Log in"}
        </button>
      </p>
    </form>
  );
}
