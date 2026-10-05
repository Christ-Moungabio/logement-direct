import Link from "next/link";
import { buildTodos } from "../todo";
import styles from "./Dashboard.module.css";

export default function Todos({ listings }) {
  const todos = buildTodos(listings);

  return (
    <section className={styles.card} aria-labelledby="todo-title">
      <h2 id="todo-title" className="text-heading-md">
        À faire
      </h2>

      {todos.length === 0 ? (
        <p className="text-body-md">Rien à faire pour le moment, tout est à jour.</p>
      ) : (
        <ul className={styles.todos}>
          {todos.map((todo) => (
            <li key={todo.key} className={`${styles.todo} ${styles[todo.tone]}`}>
              <div>
                <p className="text-heading-sm">{todo.title}</p>
                <p className="text-body-sm">{todo.text}</p>
              </div>
              <Link href={todo.href} className={styles.link}>
                {todo.action}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
