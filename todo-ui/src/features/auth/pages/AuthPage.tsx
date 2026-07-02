import { useState } from "react";
import { AuthForm } from "../components/AuthForm";

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface AuthPageProps {
  onAuthSuccess?: () => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async ({
    name,
    email,
    password,
  }: {
    name?: string;
    email: string;
    password: string;
  }) => {
    try {
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await response.json()) as AuthResponse & {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Authentication failed");
      }

      localStorage.setItem("todo_token", data.token);
      localStorage.setItem("todo_user", JSON.stringify(data.user));
      setSuccess(
        mode === "login"
          ? "Signed in successfully"
          : "Account created successfully",
      );
      onAuthSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Welcome</p>
          <h1>
            {mode === "login"
              ? "Log in to your account"
              : "Create your account"}
          </h1>
          <p>
            {mode === "login"
              ? "Access your todos anytime."
              : "Start organizing your tasks today."}
          </p>
        </div>

        {error ? <p role="alert">{error}</p> : null}
        {success ? <p>{success}</p> : null}
        <AuthForm mode={mode} onSubmit={handleSubmit} onSwitchMode={setMode} />
      </section>
    </main>
  );
}
