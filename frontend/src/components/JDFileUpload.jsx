// src/components/JDFileUpload.jsx

import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";
import JSZip from "jszip";
import mammoth from "mammoth"; // for DOCX

export default function JDFileUpload({ onSkillsExtracted }) {
  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // Read TXT file
  // -----------------------------------------
  const readTxt = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsText(file);
    });
  };

  // -----------------------------------------
  // Read PDF file
  // -----------------------------------------
  const readPdf = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      text += strings.join(" ") + "\n";
    }
    return text;
  };

  // -----------------------------------------
  // Read DOCX file
  // -----------------------------------------
  const readDocx = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  // -----------------------------------------
  // Skill Classification Logic
  // -----------------------------------------
  const classifySkills = (jdText) => {
    const primaryKeywords = [
      "react", "angular", "typescript", ".net", "dotnet", "full stack",
      "api", "graphql", "grpc", "rest", "microservices"
    ];

    const secondaryKeywords = [
      "ci/cd", "unit testing", "redis", "azure", "postgres", "performance",
      "real time", "large data", "blobs", "ux"
    ];

    const otherKeywords = [
      "communication", "team", "debugging", "problem solving",
      "collaboration", "agile"
    ];

    const text = jdText.toLowerCase();

    const primary = primaryKeywords.filter(k => text.includes(k));
    const secondary = secondaryKeywords.filter(k => text.includes(k));
    const other = otherKeywords.filter(k => text.includes(k));

    return {
      primarySkills: [...new Set(primary)],
      secondarySkills: [...new Set(secondary)],
      otherSkills: [...new Set(other)]
    };
  };

  // -----------------------------------------
  // Handle Upload
  // -----------------------------------------
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      let jdText = "";

      if (file.name.endsWith(".txt")) jdText = await readTxt(file);
      else if (file.name.endsWith(".pdf")) jdText = await readPdf(file);
      else if (file.name.endsWith(".docx")) jdText = await readDocx(file);
      else {
        alert("Unsupported file type");
        return;
      }

      // Convert JD → Skill categories
      const skills = classifySkills(jdText);

      // Send result to parent component
      onSkillsExtracted(skills);

    } catch (err) {
      console.error(err);
      alert("Error reading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 border rounded-xl bg-gray-50">
      <h3 className="font-semibold mb-2">Upload JD File (txt, pdf, docx)</h3>

      <input type="file" accept=".txt,.pdf,.docx" onChange={handleFileUpload} />

      {loading && <p className="text-blue-600 mt-2">Extracting...</p>}
    </div>
  );
}
