"use client";
import { useState } from "react";
import Image from "next/image";
import { Trophy, Medal, Filter } from "lucide-react";
import { StudentResult } from "@/lib/types";

const DEFAULT_RESULTS: StudentResult[] = [
  { id: "1", studentName: "Aisha Khan", class: "10th", exam: "SSC", year: "2024", percentage: "96.4%", marks: "480/500", rank: "School Topper", studentPhoto: "", resultImage: "", achievementDescription: "Scored highest in Mathematics", isActive: true, showOnHome: false },
  { id: "2", studentName: "Rohan Sharma", class: "12th", exam: "HSC", year: "2024", percentage: "94.2%", marks: "565/600", rank: "State Merit", studentPhoto: "", resultImage: "", achievementDescription: "State merit list for Mathematics", isActive: true, showOnHome: false },
  { id: "3", studentName: "Priya Deshmukh", class: "12th", exam: "MHT-CET", year: "2024", percentage: "99.1%", marks: "178/200", rank: "Top 500 State", studentPhoto: "", resultImage: "", achievementDescription: "Top 500 in MHT-CET Mathematics", isActive: true, showOnHome: false },
  { id: "4", studentName: "Vikram Patil", class: "10th", exam: "CBSE", year: "2024", percentage: "98%", marks: "98/100", rank: "District Topper", studentPhoto: "", resultImage: "", achievementDescription: "Full marks in Mathematics", isActive: true, showOnHome: false },
  { id: "5", studentName: "Sneha Joshi", class: "9th", exam: "Annual Exam", year: "2023", percentage: "95%", marks: "475/500", rank: "Class Topper", studentPhoto: "", resultImage: "", achievementDescription: "Exceptional performance in Math", isActive: true, showOnHome: false },
  { id: "6", studentName: "Arjun Mehta", class: "12th", exam: "MHT-CET", year: "2023", percentage: "97.8%", marks: "174/200", rank: "Top 200 State", studentPhoto: "", resultImage: "", achievementDescription: "Outstanding MHT-CET result", isActive: true, showOnHome: false },
];

function ResultCard({ result }: { result: StudentResult }) {
  return (
    <div className="card-glass p-5 flex gap-4 items-start group">
      {/* Photo */}
      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[var(--bg-surface)] border-2 border-primary/30 overflow-hidden">
        {result.studentPhoto ? (
          <Image src={result.studentPhoto} alt={result.studentName} width={56} height={56} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xl font-800 text-primary">{result.studentName.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h3 className="font-display font-700 text-base text-white">{result.studentName}</h3>
          <span className="badge badge-yellow shrink-0">{result.percentage}</span>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {result.class} • {result.exam} • {result.year}
        </p>
        {result.rank && (
          <div className="flex items-center gap-1 mt-1.5">
            <Trophy size={12} className="text-primary" />
            <span className="text-xs text-primary font-600">{result.rank}</span>
          </div>
        )}
        {result.achievementDescription && (
          <p className="text-xs text-[var(--text-secondary)] mt-1.5">{result.achievementDescription}</p>
        )}
      </div>
    </div>
  );
}

export default function Results({ results }: { results: StudentResult[] }) {
  const items = results.length > 0 ? results : DEFAULT_RESULTS;
  const [filterYear, setFilterYear] = useState("All");
  const [filterClass, setFilterClass] = useState("All");
  const [filterExam, setFilterExam] = useState("All");

  const years = ["All", ...Array.from(new Set(items.map((r) => r.year))).sort().reverse()];
  const classes = ["All", ...Array.from(new Set(items.map((r) => r.class)))];
  const exams = ["All", ...Array.from(new Set(items.map((r) => r.exam)))];

  const filtered = items.filter((r) => {
    if (filterYear !== "All" && r.year !== filterYear) return false;
    if (filterClass !== "All" && r.class !== filterClass) return false;
    if (filterExam !== "All" && r.exam !== filterExam) return false;
    return true;
  });

  return (
    <section id="results" className="section-padding bg-[var(--bg-dark)]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <span className="section-badge">
            <Medal size={14} />
            Student Results
          </span>
          <h2 className="section-title">
            Our <span className="gradient-text">Achievers</span>
          </h2>
          <p className="section-subtitle">
            Proud of our students who have consistently achieved exceptional marks in board exams and competitive tests.
          </p>
          <div className="gold-divider" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Filter size={15} />
            Filter:
          </div>
          <select
            id="result-year-filter"
            className="form-select !w-auto text-sm py-2"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            {years.map((y) => <option key={y} value={y}>Year: {y}</option>)}
          </select>
          <select
            id="result-class-filter"
            className="form-select !w-auto text-sm py-2"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            {classes.map((c) => <option key={c} value={c}>Class: {c}</option>)}
          </select>
          <select
            id="result-exam-filter"
            className="form-select !w-auto text-sm py-2"
            value={filterExam}
            onChange={(e) => setFilterExam(e.target.value)}
          >
            {exams.map((e) => <option key={e} value={e}>Exam: {e}</option>)}
          </select>
          {(filterYear !== "All" || filterClass !== "All" || filterExam !== "All") && (
            <button onClick={() => { setFilterYear("All"); setFilterClass("All"); setFilterExam("All"); }} className="text-sm text-primary hover:text-primary-light transition-colors">
              Clear
            </button>
          )}
        </div>

        {/* Results Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-muted)]">No results found for selected filters.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
