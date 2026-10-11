"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";
import styles from "./WelcomeScreen.module.css";

const neighborhoods = [
  { id: "wuse-2", number: "01", name: "WUSE 2", image: "/images/neighbourhood-wuse2.webp", playable: true },
  { id: "jabi", number: "02", name: "JABI", image: "/images/neighbourhood-jabi.webp", playable: false },
  { id: "maitama", number: "03", name: "MAITAMA", image: "/images/neighbourhood-maitama.webp", playable: false },
];

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "The World", href: "/world" },
  { label: "Community", href: "/community" },
];

export default function WelcomeScreen() {
  const [selected, setSelected] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const currentNeighborhood = neighborhoods[selected];

  const selectNext = () => setSelected((index) => (index + 1) % neighborhoods.length);
  const closeMenu = () => setMenuOpen(false);

  return (
    <main className={styles.screen}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.shade} aria-hidden="true" />

      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="thirdplace. home">
          thirdplace<span>.</span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.label}>{item.label}</Link>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <Link href="/sign-in" className={styles.signIn}>Sign In</Link>
          <Link href="/world" className={styles.getStarted}>Get Started <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>

        <button
          className={styles.menuToggle}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
        {menuOpen && (
          <nav className={styles.mobileNav} id="mobile-navigation" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link href={item.href} key={item.label} onClick={closeMenu}>{item.label}</Link>
            ))}
            <Link href="/sign-in" onClick={closeMenu}>Sign In</Link>
            <Link href="/world" className={styles.mobileStart} onClick={closeMenu}>Get Started <ArrowRight size={17} aria-hidden="true" /></Link>
          </nav>
        )}
      </header>

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>ABUJA, NIGERIA <span>/</span> NEIGHBOURHOOD 01</p>
          <h1 id="hero-title">A place to<br />just <em>be.</em></h1>
          <p className={styles.description}>Take a breath. Take a walk.<br />Find your own little corner of the neighbourhood.</p>

          <div className={styles.actions}>
            <Link href="/world" className={styles.primaryAction}>
              <span>Step into the neighbourhood</span>
              <ArrowRight size={19} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <span className={styles.actionNote}>Your walk is ready when you are.</span>
          </div>

          <p className={styles.keyboardHint}>
            <span className={styles.keys} aria-hidden="true"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span>
            <span>or arrow keys to walk.</span>
          </p>
          <p className={styles.touchHint}>Touch controls are ready inside the world.</p>
        </div>

        <div className={styles.locationNote}>
          <p>9&deg;04&apos;N 7&deg;29&apos;E</p>
          <span />
          <em>A place between places.</em>
        </div>
      </section>

      <section className={styles.bottomArea} aria-label="Neighbourhood previews and project status">
        <div className={styles.neighborhoodArea}>
          <div className={styles.neighborhoodCards} role="group" aria-label="Choose a neighbourhood preview">
            {neighborhoods.map((neighborhood, index) => (
              <button
                type="button"
                key={neighborhood.id}
                className={`${styles.neighborhoodCard} ${selected === index ? styles.selectedCard : ""}`}
                aria-pressed={selected === index}
                aria-label={`${neighborhood.number} ${neighborhood.name}${neighborhood.playable ? ", playable now" : ", preview only"}`}
                onClick={() => setSelected(index)}
              >
                <Image src={neighborhood.image} alt="" fill sizes="(max-width: 700px) 68vw, 205px" />
                <span className={styles.cardShade} aria-hidden="true" />
                <span className={styles.cardCopy}>
                  <span className={styles.cardNumber}>{neighborhood.number}</span>
                  <strong>{neighborhood.name}</strong>
                </span>
                {!neighborhood.playable && <span className={styles.previewTag}>PREVIEW</span>}
              </button>
            ))}
            <button type="button" className={styles.nextNeighborhood} onClick={selectNext} aria-label="Select next neighbourhood preview">
              <ChevronRight size={23} strokeWidth={1.4} aria-hidden="true" />
            </button>
          </div>
          <p className={styles.selectionNote} aria-live="polite">
            {currentNeighborhood.playable
              ? "WUSE 2 is ready to explore."
              : `${currentNeighborhood.name} is a preview. WUSE 2 is playable now.`}
          </p>
        </div>

        <footer className={styles.footer}>
          <span>MADE FOR THE MOMENTS IN BETWEEN</span>
          <i aria-hidden="true" />
          <span>LOCAL PROTOTYPE</span>
          <i aria-hidden="true" />
          <span>TAKE YOUR TIME</span>
        </footer>
      </section>
    </main>
  );
}
