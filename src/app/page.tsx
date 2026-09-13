"use client";

import { useState } from "react";
import styles from "./page.module.css";

type AskResponse = {
  answer?: string;
  error?: string;
  repo?: string;
  fromCache?: boolean;
  indexStats?: { files: number; chunks: number };
};

export default function Home() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [meta, setMeta] = useState<Pick<
    AskResponse,
    "repo" | "fromCache" | "indexStats"
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fullRepo =
    owner.trim() && repo.trim() ? `${owner.trim()}/${repo.trim()}` : null;

  const canSubmit =
    owner.trim() && repo.trim() && question.trim() && !loading;

  async function askQuestion() {
    if (!canSubmit) return;

    setLoading(true);
    setAnswer("");
    setError("");
    setMeta(null);
    setStatus("Checking repository and preparing your answer…");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          owner: owner.trim(),
          repo: repo.trim(),
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
          <div className={styles.badge}>Codebase AI</div>
          <h1 className={styles.title}>Ask any public repository</h1>
          <p className={styles.subtitle}>
            Enter a GitHub repo, ask a question, and get answers grounded in
            the source code. New repos are indexed automatically.
          </p>
        </header>

        <section className={styles.repoCard}>
          <div className={styles.repoCardHeader}>
            <span className={styles.repoLabel}>Repository</span>
            {fullRepo && (
              <span className={styles.repoPreview}>
                <span className={styles.repoDot} />
                github.com/{fullRepo}
              </span>
            )}
          </div>

          <div className={styles.repoInputs}>
            <div className={styles.inputGroup}>
              <label className={styles.fieldLabel} htmlFor="owner">
                Owner
              </label>
              <input
                id="owner"
                className={styles.input}
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="facebook"
                spellCheck={false}
                autoComplete="off"
              />
            </div>

            <span className={styles.repoSlash}>/</span>

            <div className={styles.inputGroup}>
              <label className={styles.fieldLabel} htmlFor="repo">
                Repository
              </label>
              <input
                id="repo"
                className={styles.input}
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="react"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>
        </section>

        <section className={styles.inputCard}>
          <label className={styles.fieldLabel} htmlFor="question">
            Your question
          </label>

          <textarea
            id="question"
            className={styles.textarea}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="How does the virtual DOM reconciliation work?"
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
              {loading ? "Working…" : "Ask →"}
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
              <span>Answer</span>
              {meta && (
                <span className={styles.answerMeta}>
                  {meta.fromCache ? (
                    <>Used existing index for {meta.repo}</>
                  ) : (
                    <>
                      Indexed {meta.indexStats?.files ?? 0} files (
                      {meta.indexStats?.chunks ?? 0} chunks) · {meta.repo}
                    </>
                  )}
                </span>
              )}
            </div>
            <div className={styles.answerBody}>{answer}</div>
          </section>
        )}

        {!answer && !error && !loading && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⌘</div>
            <p>Pick a public repo and ask anything about its codebase.</p>
            <p className={styles.emptyHint}>
              First-time repos are fetched from GitHub, chunked, and stored in
              the vector index before answering.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
