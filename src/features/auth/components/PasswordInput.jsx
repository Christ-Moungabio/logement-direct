"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./AuthForm.module.css";

export default function PasswordInput(props) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className={styles.password}>
      <input {...props} type={visible ? "text" : "password"} className={styles.input} />
      <button
        type="button"
        className={styles.reveal}
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={visible}
      >
        <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </div>
  );
}
