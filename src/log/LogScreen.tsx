"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  MenuItem,
  TextField,
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
import type { ManualLogEntry, MoodValue, SymptomSeverity } from "@/log/store";
import { getManualLogTypes, type ManualLogType } from "@/log/types";
import { datetimeLocalNowInNewYork } from "@/log/timezone";

const CONFIRM_DELETE_COLOR = "#d95c1c";
const ACCENT = "#f08429";
const TEAL = "#0B4041";

const TYPE_LABEL: Record<ManualLogType, string> = {
  symptom: LOG_COPY["log.type.symptom"],
  blood_pressure: LOG_COPY["log.type.blood_pressure"],
  medication: LOG_COPY["log.type.medication"],
  water: LOG_COPY["log.type.water"],
  electrolyte: LOG_COPY["log.type.electrolyte"],
  mood: LOG_COPY["log.type.mood"],
  event: LOG_COPY["log.type.event"],
};

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

function entrySummary(entry: ManualLogEntry): string {
  switch (entry.type) {
    case "water":
      return `${entry.amountOz} oz`;
    case "blood_pressure":
      return `${entry.systolic}/${entry.diastolic} · HR ${entry.heartRate}`;
    case "symptom":
      return entry.symptomName;
    case "medication":
      return `${entry.medicationName} · ${entry.dose}`;
    case "electrolyte":
      return LOG_COPY["log.field.taken"];
    case "mood": {
      const mood = MOODS.find((m) => m.value === entry.mood);
      return mood?.label ?? entry.mood;
    }
    case "event":
      return entry.note;
  }
}

function entryTimeLabel(recordedAt: string): string {
  return recordedAt.slice(11, 16);
}

const submitSx = {
  bgcolor: ACCENT,
  minHeight: 44,
  "&:hover": { bgcolor: ACCENT },
};

export type LogScreenProps = {
  entries: ManualLogEntry[];
  waterTotalOz: number;
  electrolyteBlocked: boolean;
};

export function LogScreen({
  entries,
  waterTotalOz,
  electrolyteBlocked,
}: LogScreenProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] =
    useState<ManualLogType>("symptom");
  const [recordedAt, setRecordedAt] = useState(datetimeLocalNowInNewYork);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [armedDeleteId, setArmedDeleteId] = useState<string | null>(null);

  // Controlled fields
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

  const dateTimeField = (
    <TextField
      name="recordedAt"
      label={LOG_COPY["log.field.date_time"]}
      type="datetime-local"
      value={recordedAt}
      onChange={(e) => setRecordedAt(e.target.value)}
      required
      InputLabelProps={{ shrink: true }}
      disabled={selectedType === "electrolyte" && electrolyteBlocked}
    />
  );

  return (
    <Box
      component="main"
      sx={{
        px: 2,
        pb: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 430,
        mx: "auto",
      }}
      onClick={() => {
        if (armedDeleteId) setArmedDeleteId(null);
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          position: "sticky",
          top: 0,
          zIndex: 1,
          py: 1,
          bgcolor: "rgba(255,255,255,0.92)",
        }}
        role="group"
        aria-label="Log type"
      >
        {getManualLogTypes().map((type) => (
          <Chip
            key={type}
            label={TYPE_LABEL[type]}
            clickable
            color={selectedType === type ? "primary" : "default"}
            onClick={() => setSelectedType(type)}
            sx={{ minHeight: 44 }}
          />
        ))}
      </Box>

      {selectedType === "symptom" ? (
        <Box
          component="form"
          onSubmit={(e) =>
            submit(e, createSymptomAction, () => {
              setNotes("");
            })
          }
          sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          <TextField
            name="symptomName"
            label={LOG_COPY["log.field.symptom_name"]}
            select
            value={symptomName}
            onChange={(e) => setSymptomName(e.target.value as typeof symptomName)}
            required
          >
            {SYMPTOM_CATALOG_NAMES.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
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
          </TextField>
          {dateTimeField}
          <TextField
            name="notes"
            label={LOG_COPY["log.field.notes"]}
            placeholder={LOG_COPY["log.field.notes_placeholder"]}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            minRows={2}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ ...submitSx, opacity: submitting ? 0.65 : 1 }}
          >
            {getCreateActionLabel("symptom")}
          </Button>
        </Box>
      ) : null}

      {selectedType === "blood_pressure" ? (
        <Box
          component="form"
          onSubmit={(e) =>
            submit(e, createBloodPressureAction, () => {
              setSystolic("");
              setDiastolic("");
              setHeartRate("");
            })
          }
          sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              name="systolic"
              label={LOG_COPY["log.field.systolic"]}
              type="number"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              required
              sx={{ flex: 1 }}
            />
            <TextField
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
              sx={{ width: 2, height: 40, bgcolor: ACCENT, borderRadius: 1 }}
            />
            <TextField
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
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ ...submitSx, opacity: submitting ? 0.65 : 1 }}
          >
            {getCreateActionLabel("blood_pressure")}
          </Button>
        </Box>
      ) : null}

      {selectedType === "medication" ? (
        <Box
          component="form"
          onSubmit={(e) =>
            submit(e, createMedicationAction, () => {
              setDose("");
            })
          }
          sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
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
            </TextField>
            <TextField
              name="dose"
              label={LOG_COPY["log.field.dose"]}
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              required
              sx={{ flex: 1 }}
            />
          </Box>
          {dateTimeField}
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ ...submitSx, opacity: submitting ? 0.65 : 1 }}
          >
            {getCreateActionLabel("medication")}
          </Button>
        </Box>
      ) : null}

      {selectedType === "water" ? (
        <Box
          component="form"
          onSubmit={(e) =>
            submit(e, createWaterAction, () => {
              setAmountOz("");
            })
          }
          sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {LOG_COPY["log.water_total_label"]}
              </Typography>
              <Typography
                data-testid="water-total"
                variant="h6"
                sx={{ color: TEAL, fontWeight: 600 }}
              >
                {formatWaterTotal(waterTotalOz)}
              </Typography>
            </Box>
            <TextField
              name="amountOz"
              label={LOG_COPY["log.field.amount_oz"]}
              placeholder={LOG_COPY["log.field.amount_oz_placeholder"]}
              value={amountOz}
              onChange={(e) => setAmountOz(e.target.value)}
              type="number"
              inputProps={{ min: 1, step: "any" }}
              required
              sx={{ flex: 1 }}
            />
          </Box>
          {dateTimeField}
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ ...submitSx, opacity: submitting ? 0.65 : 1 }}
          >
            {getCreateActionLabel("water")}
          </Button>
        </Box>
      ) : null}

      {selectedType === "electrolyte" ? (
        <Box
          component="form"
          onSubmit={(e) => submit(e, createElectrolyteAction)}
          sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          <Chip
            label={LOG_COPY["log.field.taken"]}
            color="primary"
            data-testid="electrolyte-taken"
            sx={{ alignSelf: "flex-start", minHeight: 44 }}
          />
          {dateTimeField}
          {electrolyteBlocked ? (
            <Typography role="status" color="text.secondary">
              {LOG_COPY["log.electrolytes.blocked"]}
            </Typography>
          ) : null}
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || electrolyteBlocked}
            sx={{
              ...submitSx,
              opacity: submitting || electrolyteBlocked ? 0.65 : 1,
            }}
          >
            {getCreateActionLabel("electrolyte")}
          </Button>
        </Box>
      ) : null}

      {selectedType === "mood" ? (
        <Box
          component="form"
          onSubmit={(e) => submit(e, createMoodAction)}
          sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          <TextField
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
          </TextField>
          {dateTimeField}
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ ...submitSx, opacity: submitting ? 0.65 : 1 }}
          >
            {getCreateActionLabel("mood")}
          </Button>
        </Box>
      ) : null}

      {selectedType === "event" ? (
        <Box
          component="form"
          onSubmit={(e) =>
            submit(e, createEventAction, () => {
              setNote("");
            })
          }
          sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          <TextField
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
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ ...submitSx, opacity: submitting ? 0.65 : 1 }}
          >
            {getCreateActionLabel("event")}
          </Button>
        </Box>
      ) : null}

      {success ? (
        <Typography role="status">{LOG_COPY["log.save_success"]}</Typography>
      ) : null}
      {error ? (
        <Typography role="alert" color="error">
          {error}
        </Typography>
      ) : null}

      <Box>
        <Typography variant="h6" component="h2" sx={{ color: TEAL }}>
          {LOG_COPY["log.today_heading"]}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {formatEntriesCount(entries.length)}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {entries.map((entry) => {
            const armed = armedDeleteId === entry.id;
            return (
              <Box
                key={entry.id}
                data-testid="log-entry"
                sx={{
                  py: 1.5,
                  borderBottom: "1px solid rgba(11,64,65,0.15)",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                  alignItems: "flex-start",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ color: TEAL, letterSpacing: 0.6 }}
                  >
                    {TYPE_LABEL[entry.type]} ·{" "}
                    {entryTimeLabel(entry.recordedAt)}
                  </Typography>
                  <Typography>{entrySummary(entry)}</Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => onDelete(entry.id)}
                  sx={{
                    minHeight: 44,
                    color: armed ? CONFIRM_DELETE_COLOR : "text.secondary",
                    fontWeight: armed ? 700 : 500,
                  }}
                >
                  {armed
                    ? LOG_COPY["log.entry.confirm_delete"]
                    : LOG_COPY["log.entry.delete"]}
                </Button>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
