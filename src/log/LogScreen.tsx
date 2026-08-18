"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  createBloodPressureAction,
  createElectrolyteAction,
  createEventAction,
  createMedicationAction,
  createMoodAction,
  createSymptomAction,
  createWaterAction,
  deleteManualLogAction,
  type LogActionResult,
} from "@/log/actions";
import {
  MEDICATION_CATALOG_NAMES,
  SYMPTOM_CATALOG_NAMES,
} from "@/log/catalogs";
import {
  formatEntriesCount,
  formatWaterTotal,
  LOG_COPY,
} from "@/log/copy";
import { getCreateActionLabel } from "@/log/form-meta";
import {
  formatEntryEyebrow,
  formatEntrySummary,
  MANUAL_TYPE_LABEL,
} from "@/log/entry-display";
import {
  LOG_BLOCKED_MESSAGE,
  LOG_BODY_PAD_BOTTOM_PX,
  LOG_CARD,
  LOG_CHIP,
  LOG_CTA,
  LOG_ENTRY_CARD,
  LOG_FIELD,
  LOG_STAT_PILL,
} from "@/log/layout";
import { LogOutlinedField } from "@/log/LogOutlinedField";
import { LogEntryCard } from "@/log/LogEntryCard";
import { TakenBadge } from "@/components/TakenBadge";
import type { ManualLogEntry, MoodValue, SymptomSeverity } from "@/log/store";
import { getManualLogTypes, type ManualLogType } from "@/log/types";
import { datetimeLocalNowInNewYork } from "@/log/timezone";
import { SHELL_CONTENT_GUTTER_PX } from "@/shell/chrome";

const TYPE_LABEL = MANUAL_TYPE_LABEL;

const SEVERITIES: { value: SymptomSeverity; label: string }[] = [
  { value: "usual", label: LOG_COPY["log.severity.usual"] },
  { value: "worse_than_usual", label: LOG_COPY["log.severity.worse_than_usual"] },
  {
    value: "better_than_usual",
    label: LOG_COPY["log.severity.better_than_usual"],
  },
];

const MOODS: { value: MoodValue; label: string }[] = [
  { value: "awful", label: LOG_COPY["log.mood.awful"] },
  { value: "not_great", label: LOG_COPY["log.mood.not_great"] },
  { value: "okay", label: LOG_COPY["log.mood.okay"] },
  { value: "good", label: LOG_COPY["log.mood.good"] },
  { value: "great", label: LOG_COPY["log.mood.great"] },
];

const formCardSx = {
  boxSizing: "border-box" as const,
  bgcolor: "#ffffff",
  borderRadius: `${LOG_CARD.radiusPx}px`,
  px: `${LOG_CARD.padXPx}px`,
  py: `${LOG_CARD.padYPx}px`,
  width: "100%",
  display: "flex",
  flexDirection: "column" as const,
  gap: `${LOG_CARD.stackGapPx}px`,
};

const todayCardSx = {
  boxSizing: "border-box" as const,
  bgcolor: "#ffffff",
  borderRadius: `${LOG_CARD.radiusPx}px`,
  px: `${LOG_CARD.padXPx}px`,
  py: `${LOG_CARD.padYPx}px`,
  width: "100%",
  display: "flex",
  flexDirection: "column" as const,
  gap: `${LOG_CARD.listGapPx}px`,
};

/** Figma row: stat pill bottom-aligned with the field beside it. */
const statRowSx = {
  display: "flex",
  gap: `${LOG_STAT_PILL.rowGapPx}px`,
  alignItems: "flex-end",
  width: "100%",
  pt: `${LOG_FIELD.topOffsetPx}px`,
};

const statPillSx = {
  boxSizing: "border-box" as const,
  flexShrink: 0,
  bgcolor: LOG_STAT_PILL.bg,
  borderRadius: `${LOG_STAT_PILL.radiusPx}px`,
  px: `${LOG_STAT_PILL.padXPx}px`,
  py: `${LOG_STAT_PILL.padYPx}px`,
  // Match the 56px field height so the row bottom-aligns cleanly.
  minHeight: LOG_FIELD.heightPx,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "flex-start",
  gap: `${LOG_STAT_PILL.gapPx}px`,
};

const statPillLabelSx = {
  m: 0,
  color: LOG_STAT_PILL.labelColor,
  fontSize: LOG_STAT_PILL.labelSizePx,
  fontWeight: 400,
  lineHeight: `${LOG_STAT_PILL.labelLineHeightPx}px`,
};

const statPillValueSx = {
  m: 0,
  color: LOG_STAT_PILL.valueColor,
  fontSize: LOG_STAT_PILL.valueSizePx,
  fontWeight: LOG_STAT_PILL.valueWeight,
  lineHeight: `${LOG_STAT_PILL.valueLineHeightPx}px`,
};

const blockedMessageSx = {
  m: 0,
  color: LOG_BLOCKED_MESSAGE.color,
  fontSize: LOG_BLOCKED_MESSAGE.sizePx,
  fontWeight: 400,
  lineHeight: `${LOG_BLOCKED_MESSAGE.lineHeightPx}px`,
};

const ctaSx = {
  position: "relative" as const,
  alignSelf: "flex-start",
  bgcolor: LOG_CTA.bg,
  color: LOG_CTA.color,
  borderRadius: `${LOG_CTA.radiusPx}px`,
  px: `${LOG_CTA.padXPx}px`,
  py: `${LOG_CTA.padYPx}px`,
  minWidth: 0,
  minHeight: LOG_CTA.visualMinHeightPx,
  height: "auto",
  fontSize: LOG_CTA.fontSizePx,
  fontWeight: LOG_CTA.fontWeight,
  lineHeight: `${LOG_CTA.lineHeightPx}px`,
  letterSpacing: `${LOG_CTA.letterSpacingPx}px`,
  textTransform: "none" as const,
  boxShadow: "none",
  fontFamily: "inherit",
  "&:hover": { bgcolor: LOG_CTA.bg, boxShadow: "none" },
  // ≥44px hit without inflating Figma visual size.
  "&::after": {
    content: '""',
    position: "absolute",
    inset: `${(LOG_CTA.visualMinHeightPx - LOG_CTA.minHitHeightPx) / 2}px -8px`,
  },
};

function FormCard({
  children,
  onSubmit,
  sx,
}: {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  sx?: typeof formCardSx;
}) {
  return (
    <Box component="form" onSubmit={onSubmit} sx={sx ?? formCardSx}>
      {children}
    </Box>
  );
}

export type LogScreenProps = {
  entries: ManualLogEntry[];
  waterTotalOz: number;
  electrolyteBlocked: boolean;
  /** Server-provided default so Date & Time does not hydrate-mismatch. */
  initialRecordedAt: string;
};

export function LogScreen({
  entries,
  waterTotalOz,
  electrolyteBlocked,
  initialRecordedAt,
}: LogScreenProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] =
    useState<ManualLogType>("symptom");
  const [recordedAt, setRecordedAt] = useState(initialRecordedAt);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [armedDeleteId, setArmedDeleteId] = useState<string | null>(null);

  const [symptomName, setSymptomName] = useState(SYMPTOM_CATALOG_NAMES[0]);
  const [severity, setSeverity] = useState<SymptomSeverity>("usual");
  const [notes, setNotes] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [medicationName, setMedicationName] = useState(
    MEDICATION_CATALOG_NAMES[0]
  );
  const [dose, setDose] = useState("");
  const [amountOz, setAmountOz] = useState("");
  const [mood, setMood] = useState<MoodValue>("okay");
  const [note, setNote] = useState("");

  async function submit(
    event: FormEvent<HTMLFormElement>,
    action: (formData: FormData) => Promise<LogActionResult>,
    reset?: () => void
  ) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    const formData = new FormData(event.currentTarget);
    const result = await action(formData);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    setRecordedAt(datetimeLocalNowInNewYork());
    reset?.();
    router.refresh();
  }

  async function onDelete(id: string) {
    if (armedDeleteId !== id) {
      setArmedDeleteId(id);
      return;
    }
    setArmedDeleteId(null);
    const result = await deleteManualLogAction(id);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  /** `inRow` drops the pt-8 wrapper so the field can flex beside a stat pill. */
  const renderDateTimeField = (inRow = false) => (
    <LogOutlinedField
      withTopOffset={!inRow}
      name="recordedAt"
      label={LOG_COPY["log.field.date_time"]}
      type="datetime-local"
      value={recordedAt}
      onChange={(e) => setRecordedAt(e.target.value)}
      required
      disabled={selectedType === "electrolyte" && electrolyteBlocked}
      sx={inRow ? { flex: 1, minWidth: 0 } : undefined}
    />
  );

  const dateTimeField = renderDateTimeField();

  const isCompactLayout = entries.length === 0;
  const mainStackGapPx = isCompactLayout
    ? LOG_CARD.compactStackGapPx
    : LOG_CARD.stackGapPx;
  const chipPadYPx = isCompactLayout
    ? LOG_CHIP.compactPadYPx
    : LOG_CHIP.padYPx;
  const todayCardLayoutSx = {
    ...todayCardSx,
    py: `${isCompactLayout ? LOG_CARD.compactPadYPx : LOG_CARD.padYPx}px`,
  };
  const symptomFormCardSx = isCompactLayout
    ? {
        ...formCardSx,
        py: "12px",
        gap: "12px",
      }
    : formCardSx;

  const submitButton = (type: ManualLogType) => (
    <Button
      type="submit"
      variant="contained"
      disableElevation
      disabled={
        submitting ||
        (type === "electrolyte" && electrolyteBlocked)
      }
      sx={{
        ...ctaSx,
        opacity:
          submitting || (type === "electrolyte" && electrolyteBlocked)
            ? 0.65
            : 1,
      }}
    >
      {getCreateActionLabel(type)}
    </Button>
  );

  return (
    <Box
      component="main"
      sx={{
        px: `${SHELL_CONTENT_GUTTER_PX}px`,
        pb: `${isCompactLayout ? 5 : LOG_BODY_PAD_BOTTOM_PX}px`,
        display: "flex",
        flexDirection: "column",
        gap: `${mainStackGapPx}px`,
        maxWidth: 430,
        mx: "auto",
        boxSizing: "border-box",
        width: "100%",
      }}
      onClick={() => {
        if (armedDeleteId) setArmedDeleteId(null);
      }}
    >
      {/* Figma chip strip: horizontal scroll, orange selected / white idle */}
      <Box
        role="group"
        aria-label="Log type"
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          gap: `${LOG_CHIP.gapPx}px`,
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          mx: `-${SHELL_CONTENT_GUTTER_PX}px`,
          px: `${LOG_CHIP.padLeftPx}px`,
          py: `${chipPadYPx}px`,
          position: "sticky",
          top: 0,
          zIndex: 2,
          bgcolor: LOG_CHIP.stripBg,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {getManualLogTypes().map((type) => {
          const selected = selectedType === type;
          return (
            <Box
              key={type}
              component="button"
              type="button"
              onClick={() => setSelectedType(type)}
              sx={{
                position: "relative",
                flex: "0 0 auto",
                boxSizing: "border-box",
                border: "none",
                borderRadius: `${LOG_CHIP.radiusPx}px`,
                bgcolor: selected
                  ? LOG_CHIP.selectedBg
                  : LOG_CHIP.unselectedBg,
                color: selected
                  ? LOG_CHIP.selectedColor
                  : LOG_CHIP.unselectedColor,
                px: `${LOG_CHIP.padXPx}px`,
                py: `${LOG_CHIP.padChipYPx}px`,
                minHeight: LOG_CHIP.visualMinHeightPx,
                fontFamily: "inherit",
                fontSize: LOG_CHIP.fontSizePx,
                fontWeight: 400,
                lineHeight: `${LOG_CHIP.lineHeightPx}px`,
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: selected ? "none" : LOG_CHIP.unselectedShadow,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: `${(LOG_CHIP.visualMinHeightPx - LOG_CHIP.minHeightPx) / 2}px -4px`,
                },
              }}
            >
              {TYPE_LABEL[type]}
            </Box>
          );
        })}
      </Box>

      {selectedType === "symptom" ? (
        <FormCard
          onSubmit={(e) =>
            submit(e, createSymptomAction, () => {
              setNotes("");
            })
          }
          sx={symptomFormCardSx}
        >
          <LogOutlinedField
            name="symptomName"
            label={LOG_COPY["log.field.symptom_name"]}
            select
            value={symptomName}
            onChange={(e) =>
              setSymptomName(e.target.value as typeof symptomName)
            }
            required
          >
            {SYMPTOM_CATALOG_NAMES.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </LogOutlinedField>
          <LogOutlinedField
            name="severity"
            label={LOG_COPY["log.field.severity"]}
            select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as SymptomSeverity)}
            required
          >
            {SEVERITIES.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </LogOutlinedField>
          {dateTimeField}
          <LogOutlinedField
            name="notes"
            label={LOG_COPY["log.field.notes"]}
            placeholder={LOG_COPY["log.field.notes_placeholder"]}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {submitButton("symptom")}
        </FormCard>
      ) : null}

      {selectedType === "blood_pressure" ? (
        <FormCard
          onSubmit={(e) =>
            submit(e, createBloodPressureAction, () => {
              setSystolic("");
              setDiastolic("");
              setHeartRate("");
            })
          }
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "flex-end",
              pt: "8px",
              width: "100%",
            }}
          >
            <LogOutlinedField
              withTopOffset={false}
              name="systolic"
              label={LOG_COPY["log.field.systolic"]}
              type="number"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              required
              sx={{ flex: 1 }}
            />
            <LogOutlinedField
              withTopOffset={false}
              name="diastolic"
              label={LOG_COPY["log.field.diastolic"]}
              type="number"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              required
              sx={{ flex: 1 }}
            />
            <Box
              aria-hidden
              sx={{
                width: 2,
                height: 40,
                bgcolor: LOG_CTA.bg,
                borderRadius: 1,
                mb: 1,
              }}
            />
            <LogOutlinedField
              withTopOffset={false}
              name="heartRate"
              label={LOG_COPY["log.field.heart_rate"]}
              type="number"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              required
              sx={{ flex: 1 }}
            />
          </Box>
          {dateTimeField}
          {submitButton("blood_pressure")}
        </FormCard>
      ) : null}

      {selectedType === "medication" ? (
        <FormCard
          onSubmit={(e) =>
            submit(e, createMedicationAction, () => {
              setDose("");
            })
          }
        >
          <Box sx={{ display: "flex", gap: 1, width: "100%", pt: "8px" }}>
            <LogOutlinedField
              withTopOffset={false}
              name="medicationName"
              label={LOG_COPY["log.field.medication_name"]}
              select
              value={medicationName}
              onChange={(e) =>
                setMedicationName(e.target.value as typeof medicationName)
              }
              required
              sx={{ flex: 2 }}
            >
              {MEDICATION_CATALOG_NAMES.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </LogOutlinedField>
            <LogOutlinedField
              withTopOffset={false}
              name="dose"
              label={LOG_COPY["log.field.dose"]}
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              required
              sx={{ flex: 1 }}
            />
          </Box>
          {dateTimeField}
          {submitButton("medication")}
        </FormCard>
      ) : null}

      {selectedType === "water" ? (
        <FormCard
          onSubmit={(e) =>
            submit(e, createWaterAction, () => {
              setAmountOz("");
            })
          }
        >
          {/* Figma Input Row `62906:2155`: Today's Total pill + Add Ounces */}
          <Box sx={statRowSx}>
            <Box sx={{ ...statPillSx, width: LOG_STAT_PILL.waterWidthPx }}>
              <Typography component="span" sx={statPillLabelSx}>
                {LOG_COPY["log.water_total_label"]}
              </Typography>
              <Typography
                component="span"
                data-testid="water-total"
                sx={statPillValueSx}
              >
                {formatWaterTotal(waterTotalOz)}
              </Typography>
            </Box>
            <LogOutlinedField
              withTopOffset={false}
              name="amountOz"
              label={LOG_COPY["log.field.amount_oz"]}
              placeholder={LOG_COPY["log.field.amount_oz_placeholder"]}
              value={amountOz}
              onChange={(e) => setAmountOz(e.target.value)}
              type="number"
              slotProps={{ htmlInput: { min: 1, step: "any" } }}
              required
              sx={{ flex: 1, minWidth: 0 }}
            />
          </Box>
          {dateTimeField}
          {/* Figma Button Row also has "Reset total" — hidden for v1 per product lock. */}
          {submitButton("water")}
        </FormCard>
      ) : null}

      {selectedType === "electrolyte" ? (
        <FormCard onSubmit={(e) => submit(e, createElectrolyteAction)}>
          {/* Figma `62907:5537` (not taken) / `62907:2282` (taken) */}
          <Box sx={statRowSx}>
            <TakenBadge
              taken={electrolyteBlocked}
              label={LOG_COPY["log.field.taken"]}
              testId="electrolyte-taken"
              alignItems="flex-start"
              minHeightPx={LOG_FIELD.heightPx}
            />
            {renderDateTimeField(true)}
          </Box>
          {electrolyteBlocked ? (
            <Typography role="status" sx={blockedMessageSx}>
              {LOG_COPY["log.electrolytes.blocked"]}
            </Typography>
          ) : (
            submitButton("electrolyte")
          )}
        </FormCard>
      ) : null}

      {selectedType === "mood" ? (
        <FormCard onSubmit={(e) => submit(e, createMoodAction)}>
          <LogOutlinedField
            name="mood"
            label={LOG_COPY["log.field.mood"]}
            select
            value={mood}
            onChange={(e) => setMood(e.target.value as MoodValue)}
            required
          >
            {MOODS.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </LogOutlinedField>
          {dateTimeField}
          {submitButton("mood")}
        </FormCard>
      ) : null}

      {selectedType === "event" ? (
        <FormCard
          onSubmit={(e) =>
            submit(e, createEventAction, () => {
              setNote("");
            })
          }
        >
          <LogOutlinedField
            name="note"
            label={LOG_COPY["log.field.note"]}
            placeholder={LOG_COPY["log.field.note_placeholder"]}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
            multiline
            minRows={3}
          />
          {dateTimeField}
          {submitButton("event")}
        </FormCard>
      ) : null}

      {success ? (
        <Typography role="status" sx={{ color: "#ffffff" }}>
          {LOG_COPY["log.save_success"]}
        </Typography>
      ) : null}
      {error ? (
        <Typography role="alert" sx={{ color: LOG_ENTRY_CARD.confirmDeleteColor }}>
          {error}
        </Typography>
      ) : null}

      {/* Today list — Figma py 18 (no form field top offset) */}
      <Box sx={todayCardLayoutSx}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <Typography
            component="h2"
            sx={{
              m: 0,
              color: LOG_CARD.titleColor,
              fontSize: LOG_CARD.titleSizePx,
              fontWeight: LOG_CARD.titleWeight,
              lineHeight: `${LOG_CARD.titleLineHeightPx}px`,
            }}
          >
            {LOG_COPY["log.today_heading"]}
          </Typography>
          <Typography
            sx={{
              m: 0,
              color: LOG_CARD.countColor,
              fontSize: LOG_CARD.countSizePx,
              fontWeight: 400,
              lineHeight: `${LOG_CARD.countLineHeightPx}px`,
            }}
          >
            {formatEntriesCount(entries.length)}
          </Typography>
        </Box>

        {entries.map((entry) => (
          <LogEntryCard
            key={entry.id}
            summary={formatEntrySummary(entry)}
            eyebrow={formatEntryEyebrow(
              TYPE_LABEL[entry.type],
              entry.recordedAt
            )}
            armed={armedDeleteId === entry.id}
            onDelete={() => onDelete(entry.id)}
          />
        ))}
      </Box>
    </Box>
  );
}
