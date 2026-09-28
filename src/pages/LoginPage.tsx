import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router";

import { useAuth } from "../features/auth/useAuth";
import { supabase } from "../lib/supabase";

import "../styles/auth.css";

function LoginPage() {
  const navigate = useNavigate();

  const { user, loading: authLoading } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/home", {
        replace: true,
      });
    }
  }, [
    authLoading,
    user,
    navigate,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    const { error: signInError } =
      await supabase.auth
        .signInWithPassword({
          email: email.trim(),
          password,
        });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    navigate("/home", {
      replace: true,
    });
  }

  async function handleGoogleSignIn() {
    setError(null);

    const { error: googleError } =
      await supabase.auth
        .signInWithOAuth({
          provider: "google",

          options: {
            redirectTo:
              `${window.location.origin}/home`,
          },
        });

    if (googleError) {
      setError(googleError.message);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>

        <p className="auth-description">
          Sign in to your Marvelist
          account.
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            className="auth-primary-button"
            disabled={loading}
            type="submit"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          className="auth-google-button"
          type="button"
          onClick={
            handleGoogleSignIn
          }
        >
          Continue with Google
        </button>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;