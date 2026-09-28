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

function SignupPage() {
  const navigate = useNavigate();

  const { user, loading: authLoading } =
    useAuth();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
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
    setSuccess(null);

    const normalizedUsername =
      username.trim().toLowerCase();

    const usernameRegex =
      /^[a-z0-9_]{3,30}$/;

    if (
      !usernameRegex.test(
        normalizedUsername,
      )
    ) {
      setError(
        "Username must contain 3 to 30 lowercase letters, numbers or underscores.",
      );

      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters.",
      );

      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match.",
      );

      return;
    }

    setLoading(true);

    const {
      data: existingProfile,
      error: usernameError,
    } = await supabase
      .from("profiles")
      .select("id")
      .eq(
        "username",
        normalizedUsername,
      )
      .maybeSingle();

    if (usernameError) {
      setError(
        "Unable to check username availability.",
      );

      setLoading(false);
      return;
    }

    if (existingProfile) {
      setError(
        "This username is already taken.",
      );

      setLoading(false);
      return;
    }

    const { data, error: signUpError } =
      await supabase.auth.signUp({
        email: email.trim(),
        password,

        options: {
          data: {
            username:
              normalizedUsername,
          },

          emailRedirectTo:
            `${window.location.origin}/home`,
        },
      });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      navigate("/home", {
        replace: true,
      });

      return;
    }

    setSuccess(
      "Account created. Check your email to confirm your account.",
    );

    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setError(null);

    const { error: googleError } =
      await supabase.auth.signInWithOAuth({
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
        <h1>Create account</h1>

        <p className="auth-description">
          Join Marvelist and start
          tracking your Marvel journey.
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value.toLowerCase(),
                )
              }
              autoComplete="username"
              required
            />
          </label>

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
              autoComplete="new-password"
              required
            />
          </label>

          <label>
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              autoComplete="new-password"
              required
            />
          </label>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          {success && (
            <p className="auth-success">
              {success}
            </p>
          )}

          <button
            className="auth-primary-button"
            disabled={loading}
            type="submit"
          >
            {loading
              ? "Creating account..."
              : "Sign Up"}
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
          Already have an account?{" "}
          <Link to="/login">
            Sign In
          </Link>
        </p>
      </div>
    </section>
  );
}

export default SignupPage;