"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import {
  getLoginPageCopy,
  getSignInSubmitButtonState,
} from "@/auth/login-page";
import { loginAction } from "@/auth/actions";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function LoginForm() {
  const copy = getLoginPageCopy();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(null);
  const button = getSignInSubmitButtonState(submitting);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    let cancelled = false;
    fetch("/lottie/koi-fish-color-v2.json")
      .then((res) => res.json())
      .then((data: object) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {
        /* koi is decorative */
      });
    return () => {
      cancelled = true;
    };
  }, [reduceMotion]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const result = await loginAction(formData);
    if (result && !result.ok) {
      setError(copy.errorInvalid);
      setSubmitting(false);
    }
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        pt: 6,
        pb: 4,
        background:
          "radial-gradient(ellipse at 30% 20%, #4a8f7a 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #2d6b5a 0%, transparent 45%), linear-gradient(160deg, #1a4a42 0%, #0b4041 45%, #163a36 100%)",
      }}
    >
      <Box
        component="form"
        onSubmit={onSubmit}
        noValidate
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "#ffffff",
          borderRadius: "22px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          component="h1"
          sx={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: "1.5rem",
            letterSpacing: "-0.02em",
            color: "#1a1a1a",
          }}
        >
          Chronic{" "}
          <Box component="span" sx={{ fontStyle: "italic", color: "#367057" }}>
            Yet
          </Box>{" "}
          Iconic
        </Typography>

        <TextField
          name="username"
          label={copy.usernameLabel}
          autoComplete="username"
          required
          fullWidth
          variant="outlined"
          slotProps={{ htmlInput: { "data-testid": "login-username" } }}
        />
        <TextField
          name="password"
          label={copy.passwordLabel}
          type="password"
          autoComplete="current-password"
          required
          fullWidth
          variant="outlined"
          slotProps={{ htmlInput: { "data-testid": "login-password" } }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={button.disabled}
          fullWidth
          sx={{
            mt: 1,
            py: 1.25,
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 600,
            bgcolor: button.backgroundColor,
            opacity: button.opacity,
            "&:hover": { bgcolor: button.backgroundColor, opacity: button.opacity },
            "&.Mui-disabled": {
              bgcolor: button.backgroundColor,
              color: "#fff",
              opacity: button.opacity,
            },
          }}
        >
          {copy.submit}
        </Button>

        {error ? (
          <Typography
            role="alert"
            sx={{
              textAlign: "center",
              fontSize: "0.75rem",
              fontWeight: 300,
              color: "#d95c1c",
            }}
          >
            {error}
          </Typography>
        ) : null}
      </Box>

      {!reduceMotion && animationData ? (
        <Box sx={{ width: 220, mt: 2 }} aria-hidden>
          <Lottie animationData={animationData} loop autoplay />
        </Box>
      ) : null}
    </Box>
  );
}
