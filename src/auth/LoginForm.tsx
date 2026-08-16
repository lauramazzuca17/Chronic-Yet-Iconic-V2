"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, Box, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import {
  getLoginPageCopy,
  getLoginPageLayout,
  getSignInSubmitButtonState,
} from "@/auth/login-page";
import { loginAction } from "@/auth/actions";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function LoginForm() {
  const router = useRouter();
  const copy = getLoginPageCopy();
  const layout = getLoginPageLayout();
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
    try {
      const result = await loginAction(formData);
      if (!result.ok) {
        setError(copy.errorInvalid);
        setSubmitting(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError(copy.errorInvalid);
      setSubmitting(false);
    }
  }

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      height: layout.fieldHeightPx,
      borderRadius: `${layout.fieldBorderRadiusPx}px`,
      bgcolor: "var(--cyi-surface, #fff)",
      fontSize: layout.fieldInputSizePx,
      fontWeight: 400,
      lineHeight: "24px",
      "& fieldset": {
        borderColor: layout.fieldBorderColor,
        borderWidth: 1,
      },
      "&:hover fieldset": {
        borderColor: layout.fieldBorderColor,
      },
      "&.Mui-focused fieldset": {
        borderColor: layout.fieldBorderColor,
        borderWidth: 1,
      },
      "& .MuiOutlinedInput-input": {
        height: "100%",
        boxSizing: "border-box",
        py: 0,
        px: `${layout.fieldPaddingXPx}px`,
        fontSize: layout.fieldInputSizePx,
        lineHeight: "24px",
        fontWeight: 400,
        color: layout.fieldInputColor,
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: layout.fieldLabelSizePx,
      lineHeight: "18px",
      fontWeight: 400,
      color: layout.fieldLabelColor,
      transform: "translate(12px, 16px) scale(1)",
      "&.MuiInputLabel-shrink": {
        fontSize: layout.fieldLabelSizePx,
        lineHeight: "18px",
        // Keep label at 12px on the notch (no MUI 0.75 scale-down).
        transform: "translate(12px, -8px) scale(1)",
        color: layout.fieldLabelColor,
      },
      "&.Mui-focused": {
        color: layout.fieldLabelColor,
      },
    },
    // Notch gap for always-shrunk 12px label (MUI scales legend by default).
    "& .MuiOutlinedInput-notchedOutline legend": {
      fontSize: layout.fieldLabelSizePx,
      maxWidth: "100%",
    },
  };

  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        boxSizing: "border-box",
        height: "100dvh",
        maxHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: `${layout.koiGapFromCardPx}px`,
        px: `${layout.sideMarginPx}px`,
        pt: `max(${layout.mainPaddingTopPx}px, env(safe-area-inset-top))`,
        pb: "max(12px, env(safe-area-inset-bottom))",
        overflow: "hidden",
        backgroundColor: "#0b4041",
        backgroundImage: `var(--cyi-login-pond-image, url(${layout.pondBackgroundSrc}))`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // Visual nudge only — does not grow layout / cause scroll.
        "& > .login-stack": {
          transform: `translateY(${layout.stackOffsetYPx}px)`,
        },
      }}
    >
      <Box
        className="login-stack"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: `${layout.koiGapFromCardPx}px`,
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
        }}
      >
      <Box
        component="form"
        onSubmit={onSubmit}
        noValidate
        sx={{
          boxSizing: "border-box",
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          bgcolor: "var(--cyi-surface, #fff)",
          borderRadius: `${layout.cardBorderRadiusPx}px`,
          boxShadow: layout.cardShadow,
          pt: `${layout.cardPaddingTopPx}px`,
          pb: `${layout.cardPaddingBottomPx}px`,
          px: `${layout.cardPaddingXPx}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: `${layout.stackGapPx}px`,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          component="h1"
          sx={{
            textAlign: "center",
            fontFamily: 'var(--font-dm-sans), "DM Sans", sans-serif',
            fontWeight: layout.wordmark.chronicIconicWeight,
            fontSize: `${layout.wordmark.sizePx}px`,
            lineHeight: `${layout.wordmark.lineHeightPx}px`,
            letterSpacing: 0,
            color: layout.wordmark.chronicIconicColor,
            width: "100%",
          }}
        >
          Chronic{" "}
          <Box
            component="span"
            sx={{
              fontStyle: layout.wordmark.yetItalic ? "italic" : "normal",
              fontWeight: layout.wordmark.yetWeight,
              color: layout.wordmark.yetColor,
            }}
          >
            Yet
          </Box>{" "}
          Iconic
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: `${layout.fieldGapPx}px`,
          }}
        >
          <TextField
            name="username"
            label={copy.usernameLabel}
            autoComplete="username"
            required
            fullWidth
            variant="outlined"
            sx={fieldSx}
            slotProps={{
              htmlInput: { "data-testid": "login-username" },
              // Figma: label always on notch, no asterisk.
              inputLabel: {
                required: false,
                shrink: layout.fieldLabelAlwaysShrunk,
              },
            }}
          />
          <TextField
            name="password"
            label={copy.passwordLabel}
            type="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            sx={fieldSx}
            slotProps={{
              htmlInput: { "data-testid": "login-password" },
              inputLabel: {
                required: false,
                shrink: layout.fieldLabelAlwaysShrunk,
              },
            }}
          />
        </Box>

        <Box sx={{ pt: "5px", display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            disabled={button.disabled}
            fullWidth={layout.ctaFullWidth}
            disableElevation
            sx={{
              minWidth: 0,
              minHeight: 0,
              px: `${layout.ctaPaddingXPx}px`,
              py: `${layout.ctaPaddingYPx}px`,
              borderRadius: `${layout.ctaBorderRadiusPx}px`,
              textTransform: "none",
              fontWeight: layout.ctaFontWeight,
              fontSize: layout.ctaFontSizePx,
              lineHeight: `${layout.ctaLineHeightPx}px`,
              letterSpacing: `${layout.ctaLetterSpacingPx}px`,
              bgcolor: button.backgroundColor,
              color: "#fff",
              opacity: button.opacity,
              boxShadow: "none",
              "&:hover": {
                bgcolor: button.backgroundColor,
                opacity: button.opacity,
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                bgcolor: button.backgroundColor,
                color: "#fff",
                opacity: button.opacity,
              },
            }}
          >
            {copy.submit}
          </Button>
        </Box>

        {error ? (
          <Typography
            role="alert"
            sx={{
              textAlign: "center",
              fontSize: `${layout.errorFontSizePx}px`,
              fontWeight: 300,
              lineHeight: "18px",
              color: layout.errorColor,
              width: "100%",
            }}
          >
            {error}
          </Typography>
        ) : null}
      </Box>

      {layout.reserveKoiSlot ? (
        <Box
          sx={{
            width: layout.koiSizePx,
            height: layout.koiSizePx,
            maxWidth: "min(177px, 28dvh)",
            maxHeight: "min(177px, 28dvh)",
            flexShrink: 1,
            position: "relative",
            zIndex: 1,
            "& > div": { width: "100%", height: "100%" },
          }}
          aria-hidden
        >
          {!reduceMotion && animationData ? (
            <Lottie animationData={animationData} loop autoplay />
          ) : null}
        </Box>
      ) : null}
      </Box>
    </Box>
  );
}
