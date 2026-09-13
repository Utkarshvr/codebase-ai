"use client";

import { useState } from "react";
import styles from "./page.module.css";

type AskResponse = {
  answer?: string;
  error?: string;
  repo?: string;
  fromCache?: boolean;
  indexStats?: {
    files: number;
    chunks: number;
  };
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [meta, setMeta] = useState<
    Pick<AskResponse, "repo" | "fromCache" | "indexStats"> | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Replace this later with the repository selected
  // from your GitHub repo selector.
  const owner = "Utkarshvr";
  const repo = "shipment-rate-api";

  const fullRepo = `${owner}/${repo}`;

  const canSubmit = question.trim() && !loading;

  async function askQuestion() {
    if (!canSubmit) return;

    setLoading(true);
    setAnswer("");
    setError("");
    setMeta(null);
    setStatus("Preparing your answer…");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          owner,
          repo,
        }),
      });

      const data: AskResponse = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setAnswer(data.answer || "");

      setMeta({
        repo: data.repo,
        fromCache: data.fromCache,
        indexStats: data.indexStats,
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setStatus(null);
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.logo}>CODEBASE AI</div>

          <h1 className={styles.title}>Ask your codebase.</h1>

          <p className={styles.subtitle}>
            Understand your repository using natural language.
          </p>

          <div className={styles.repo}>
            <span className={styles.repoDot} />
            <span>github.com/{fullRepo}</span>
          </div>
        </header>

        <section className={styles.inputCard}>
          <label className={styles.fieldLabel} htmlFor="question">
            Your question
          </label>

          <textarea
            id="question"
            className={styles.textarea}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="How is the shipping rate calculated?"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                askQuestion();
              }
            }}
          />

          <div className={styles.inputFooter}>
            <span className={styles.hint}>Ctrl + Enter to submit</span>

            <button
              className={styles.button}
              onClick={askQuestion}
              disabled={!canSubmit}
            >
              {loading ? "Thinking..." : "Ask →"}
            </button>
          </div>
        </section>

        {loading && status && (
          <div className={styles.statusBanner}>
            <span className={styles.spinner} />
            {status}
          </div>
        )}

        {error && (
          <section className={styles.errorCard}>
            <div className={styles.errorHeader}>Error</div>
            <div className={styles.errorBody}>{error}</div>
          </section>
        )}

        {answer && !error && (
          <section className={styles.answer}>
            <div className={styles.answerHeader}>
              <span>AI RESPONSE</span>

              {meta && (
                <span className={styles.answerMeta}>
                  {meta.fromCache
                    ? `Using existing index · ${meta.repo}`
                    : `Indexed ${meta.indexStats?.files ?? 0} files · ${
                        meta.indexStats?.chunks ?? 0
                      } chunks · ${meta.repo}`}
                </span>
              )}
            </div>

            <div className={styles.answerBody}>{answer}</div>
          </section>
        )}

        {!answer && !error && !loading && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⌘</div>
            <p>Ask anything about your repository.</p>
            <p className={styles.emptyHint}>
              Codebase AI will search the source code and generate an
              answer grounded in your repository.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}