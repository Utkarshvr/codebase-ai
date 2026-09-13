"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askQuestion() {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          repo: "Utkarshvr/shipment-rate-api",
        }),
      });

      const data = await response.json();

      setAnswer(data.answer || data.error);
    } catch {
      setAnswer("Something went wrong.");
    } finally {
      setLoading(false);
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
            Utkarshvr/shipment-rate-api
          </div>
        </header>

        <section className={styles.inputCard}>
          <textarea
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
            <button
              className={styles.button}
              onClick={askQuestion}
              disabled={loading || !question.trim()}
            >
              {loading ? "Thinking..." : "Ask →"}
            </button>
          </div>
        </section>

        {answer ? (
          <section className={styles.answer}>
            <div className={styles.answerHeader}>AI RESPONSE</div>

            <div className={styles.answerBody}>{answer}</div>
          </section>
        ) : (
          <div className={styles.empty}>
            Ask a question about the repository to get started.
          </div>
        )}
      </div>
    </main>
  );
}
