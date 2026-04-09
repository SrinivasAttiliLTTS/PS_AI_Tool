import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress
} from "@mui/material";
import API_BASE from "../config/apiConfig";

function AssessmentDialog({ open, onClose, jdText, candidate }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [assessmentId, setAssessmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 🚀 Start Assessment
  const startAssessment = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("jd_text", jdText);
    formData.append("candidate_id", candidate.Name);

    const res = await fetch(
      `${API_BASE}/start-assessment`,
       {
      method: "POST",
      body: formData
    });

    const data = await res.json();
console.log("API RESPONSE:", data);
    setQuestions(data.questions);
    setAssessmentId(data.assessment_id);
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      startAssessment();
    }
  }, [open]);

  // 🧠 Select Answer
  const handleChange = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

  // ✅ Submit
  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("assessment_id", assessmentId);
    formData.append(
      "answers",
      JSON.stringify(
        Object.keys(answers).map((qid) => ({
          question_id: parseInt(qid),
          selected: answers[qid]
        }))
      )
    );

    const res = await fetch(
            `${API_BASE}/submit-assessment`,
       {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Assessment - {candidate?.Name}
      </DialogTitle>

      <DialogContent>
        {loading && <LinearProgress />}

        {/* QUESTIONS */}
        {!result &&
          questions.map((q, index) => (
            <Box key={q.id} sx={{ mb: 3 }}>
              <Typography>
                {index + 1}. {q.question}
              </Typography>

              <RadioGroup
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              >
                {(
  Array.isArray(q.options)
    ? q.options.map((opt) => {
        // 🔥 handle {A: "..."} format
        if (typeof opt === "object") {
          return Object.values(opt)[0];
        }

        // 🔥 handle "A) text"
        if (typeof opt === "string" && opt.length > 2 && opt[1] === ")") {
          return opt.substring(2).trim();
        }

        return opt;
      })
    : []
).map((opt, i) => (
  <FormControlLabel
    key={i}
    value={["A", "B", "C", "D"][i]}
    control={<Radio />}
    label={opt}
  />
))}
              </RadioGroup>
            </Box>
          ))}

        {/* SUBMIT BUTTON */}
        {!result && questions.length > 0 && (
          <Button variant="contained" onClick={handleSubmit}>
            Submit Assessment
          </Button>
        )}

        {/* RESULT */}
        {result && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5">
              Score: {result.score}/{result.total} ({result.percentage}%)
            </Typography>

            <Typography sx={{ mt: 2 }}>Skill Breakdown:</Typography>

            {Object.entries(result.skill_breakdown).map(([skill, val]) => (
              <Typography key={skill}>
                {skill}: {val}%
              </Typography>
            ))}

            <Button sx={{ mt: 2 }} onClick={onClose}>
              Close
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AssessmentDialog;