import Link from "next/link";
import styles from "./PlaceholderPage.module.css";

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  note: string;
};

export default function PlaceholderPage({ eyebrow, title, description, note }: PlaceholderPageProps) {
  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>thirdplace<span>.</span></Link>
        <Link href="/" className={styles.back}>Back to home <span aria-hidden="true">&larr;</span></Link>
      </header>
      <section className={styles.content}>
        <p className={styles.eyebrow}><span />{eyebrow}</p>
        <h1>{title}</h1>
        <p className={styles.description}>{description}</p>
        <p className={styles.note}>{note}</p>
        <Link href="/world" className={styles.action}>Explore as a guest <span aria-hidden="true">&rarr;</span></Link>
      </section>
      <footer className={styles.footer}>MADE FOR THE MOMENTS IN BETWEEN <span /> LOCAL PROTOTYPE</footer>
    </main>
  );
}
