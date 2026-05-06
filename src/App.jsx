import { useState } from "react";

const lineProducts = [
  {
    name: "AURUM",
    type: "Eau de Parfum",
    mood: "Radiant, warm, elegant",
    notes: "Bergamot, saffron, amberwood",
    best: "Daily luxury, formal evenings",
    lead: true,
  },
  {
    name: "AURUM NOIR",
    type: "Parfum Intense",
    mood: "Dark, sensual, powerful",
    notes: "Incense, leather, smoked vanilla",
    best: "Night, colder weather",
  },
  {
    name: "AURUM BLANC",
    type: "Future Expression",
    mood: "Fresh, bright, refined",
    notes: "Mandarin, white tea, musk",
    best: "Daytime, warm light",
  },
];

const sensoryMoments = [
  {
    title: "Radiant Opening",
    copy: "Bergamot, mandarin zest, and pink pepper create a bright first impression.",
  },
  {
    title: "Textured Heart",
    copy: "Saffron, iris, and lavender add elegance, softness, and modern refinement.",
  },
  {
    title: "Warm Signature Trail",
    copy: "Amberwood, vetiver, tonka bean, and white musk leave a smooth, magnetic dry-down.",
  },
];

const notes = [
  {
    label: "Top Notes",
    title: "Light",
    items: ["Bergamot", "Mandarin Zest", "Pink Pepper"],
    copy: "A bright opening that feels crisp, golden, and immediately alive.",
  },
  {
    label: "Heart Notes",
    title: "Texture",
    items: ["Saffron", "Iris", "Lavender Absolute"],
    copy: "A smooth heart of spice, softness, and aromatic elegance.",
  },
  {
    label: "Base Notes",
    title: "Depth",
    items: ["Amberwood", "Vetiver", "Tonka Bean", "White Musk"],
    copy: "A warm signature trail that stays close, refined, and memorable.",
  },
];

const bottleDetails = [
  "Thick architectural glass",
  "Warm amber gradient",
  "Brushed gold magnetic cap",
  "Gold-stamped label",
  "Refillable collectible design",
  "Optional launch engraving",
];

const impressions = [
  {
    quote: "Elegant without being loud. It feels expensive from the first spray.",
    source: "Early Preview Panel",
  },
  {
    quote: "The dry-down is warm, smooth, and quietly powerful.",
    source: "Private Launch Guest",
  },
  {
    quote: "AURUM smells like a black-tie evening in golden light.",
    source: "Fragrance Collector",
  },
];

const rituals = [
  "Spray once at the chest for a close, warm trail.",
  "Add one spray behind the neck for movement.",
  "Wear 20 minutes before leaving, once the amberwood has settled.",
  "Use lighter sprays by day and fuller application for evening.",
];

function BottleVisual({ variant = "gold", label = "AURUM", concentration = "Eau de Parfum" }) {
  return (
    <div className={`bottle-scene bottle-scene--${variant}`} aria-label={`${label} bottle visual`} role="img">
      <div className="bottle-glow" />
      <div className="bottle-shadow" />
      <div className="bottle">
        <div className="bottle-cap" />
        <div className="bottle-neck" />
        <div className="bottle-body">
          <div className="bottle-label">
            <span>ELYR</span>
            <strong>{label}</strong>
            <small>{concentration}</small>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button({ children, href = "#launch-offer", variant = "primary" }) {
  return (
    <a className={`button button--${variant}`} href={href}>
      <span>{children}</span>
    </a>
  );
}

function SectionKicker({ children }) {
  return <p className="kicker">{children}</p>;
}

function Hero() {
  return (
    <section className="hero hero-scroll" id="top" aria-label="AURUM NOIR launch film" data-scroll-hero>
      <div className="hero-sticky">
        <header className="site-nav" aria-label="Primary navigation">
          <a className="brand-mark" href="#top" aria-label="ELYR home">
            <img src="assets/logo-mark-black.png" alt="ELYR" />
          </a>
          <nav>
            <a href="#product">AURUM</a>
            <a href="#notes">Notes</a>
            <a href="#line">The Trilogy</a>
            <a href="#noir">Noire</a>
            <a href="#line">Tenebre</a>
            <a href="#line">Aubre</a>
            <a href="#footer">Contact</a>
          </nav>
        </header>

        <video
          className="hero-video"
            src="assets/hero-scroll-new.mp4?v=20260502"
          poster="assets/noire-hero.jpg"
          muted
          playsInline
          preload="auto"
        />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-frame-copy" aria-hidden="true">
          <p className="hero-frame-title">
            AURUM NOIR
            <br />
            PARFUM
          </p>
          <p className="hero-frame-line">
            When the light fades,
            <br />
            presence remains.
          </p>
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="section story noire-reveal" id="noire-reveal" aria-label="AURUM NOIRE introduction">
      <div className="container noire-intro reveal">
        <p>
          AURUM NOIRE interprets masculinity through depth, restraint, and nocturnal warmth. Created for formal
          evenings and close encounters, it is a fragrance that does not seek attention, but leaves an impression with
          quiet authority.
        </p>
        <p>
          Its composition unfolds like black fabric catching amber light: spiced at the opening, polished through the
          heart, and enveloping in the drydown. A scent of contrast—dark yet smooth, intense yet controlled, sensual yet
          undeniably elegant.
        </p>
      </div>
    </section>
  );
}

function ProductLine() {
  return (
    <section className="section line-section trilogy-film-section" id="line" aria-label="The Trilogy film">
      <video className="trilogy-film" src="assets/trilogy-final.mp4?v=final-1" muted playsInline preload="metadata" data-center-play />
      <button className="trilogy-replay" type="button" aria-label="Replay The Trilogy film" data-replay-video>
        <span aria-hidden="true" />
      </button>
    </section>
  );
}

function MainProduct() {
  return (
    <section className="section product-section ingredient-section" id="product" aria-labelledby="ingredient-title">
      <div className="ingredient-copy">
        <h2 id="ingredient-title">A Study in Controlled Intensity</h2>
        <p>
          From the cool elegance of iris and neroli to the textured warmth of tonka, vanilla, and labdanum, AURUM NOIRE
          is shaped like a structure: clear, masculine, and enduring.
        </p>
      </div>
      <div className="ingredient-stage">
        <div className="ingredient-gallery">
          <figure
            className="ingredient-panel ingredient-panel--interactive"
            style={{ "--i": 0 }}
            role="button"
            tabIndex="0"
            aria-label="Open top notes detail"
            aria-controls="top-notes-popup"
            data-note-popup-open="top-notes-popup"
          >
            <img
              src="assets/note-iris.jpg"
              alt="Macro iris petals for the heart of AURUM NOIRE"
              width="479"
              height="786"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <figure
            className="ingredient-panel ingredient-panel--interactive"
            style={{ "--i": 1 }}
            role="button"
            tabIndex="0"
            aria-label="Open heart notes detail"
            aria-controls="heart-notes-popup"
            data-note-popup-open="heart-notes-popup"
          >
            <img
              src="assets/note-cardamom.jpg"
              alt="Macro cardamom pods for the spiced opening of AURUM NOIRE"
              width="479"
              height="786"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <figure
            className="ingredient-panel ingredient-panel--interactive"
            style={{ "--i": 2 }}
            role="button"
            tabIndex="0"
            aria-label="Open base notes detail"
            aria-controls="base-notes-popup"
            data-note-popup-open="base-notes-popup"
          >
            <img
              src="assets/note-tonka-bean.jpg"
              alt="Macro tonka bean and vanilla for the warm drydown of AURUM NOIRE"
              width="479"
              height="786"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
        <div
          className="note-popup note-popup--top"
          id="top-notes-popup"
          role="dialog"
          aria-modal="false"
          aria-hidden="true"
          aria-labelledby="top-notes-title"
          data-note-popup
        >
          <div className="note-popup-copy">
            <p>Top Notes</p>
            <h3 id="top-notes-title">First Contact</h3>
            <span>
              The moment skin meets air. Iris opens cold and powdery-dry — almost severe — before neroli cuts through
              with a flash of white heat, like candlelight catching in a dark room. It does not ease you in. It
              announces.
            </span>
            <strong>Iris, Neroli</strong>
          </div>
          <button className="note-popup-close" type="button" aria-label="Close top notes detail" data-note-popup-close>
            <span />
          </button>
        </div>
        <div
          className="note-popup note-popup--heart"
          id="heart-notes-popup"
          role="dialog"
          aria-modal="false"
          aria-hidden="true"
          aria-labelledby="heart-notes-title"
          data-note-popup
        >
          <div className="note-popup-copy">
            <p>Heart Notes</p>
            <h3 id="heart-notes-title">Inner Structure</h3>
            <span>
              Where the fragrance finds its form. Cardamom adds a spiced, almost ceremonial tension — dry and precise.
              Cedarwood rises beneath it like the frame of a building: structural, quiet, unmovable. This is the part of
              NOIRE that people lean closer for.
            </span>
            <strong>Cardamom, Cedarwood</strong>
          </div>
          <button className="note-popup-close" type="button" aria-label="Close heart notes detail" data-note-popup-close>
            <span />
          </button>
        </div>
        <div
          className="note-popup note-popup--base"
          id="base-notes-popup"
          role="dialog"
          aria-modal="false"
          aria-hidden="true"
          aria-labelledby="base-notes-title"
          data-note-popup
        >
          <div className="note-popup-copy">
            <p>Base Notes</p>
            <h3 id="base-notes-title">Lasting Trace</h3>
            <span>
              The truest version of the fragrance — and the truest version of the man wearing it. Tonka bean brings a
              warm, almond-dark softness. Vanilla, used with restraint, deepens it without sweetening it. Labdanum
              anchors everything: resinous, animalic, skin-close. Hours after application, this is what stays on the
              collar.
            </span>
            <strong>Tonka Bean, Vanilla, Labdanum</strong>
          </div>
          <button className="note-popup-close" type="button" aria-label="Close base notes detail" data-note-popup-close>
            <span />
          </button>
        </div>
      </div>
    </section>
  );
}

function Notes() {
  return (
    <section className="section notes-section presence-section" id="notes" aria-labelledby="presence-title">
      <div className="presence-copy reveal">
        <h2 id="presence-title">An Object of Presence</h2>
        <p>
          AURUM NOIRE embodies a new language of masculine luxury: precise, sensual, and composed. Every detail — from
          the amber liquid to the dark cap and clean silhouette — reflects a fragrance built on restraint, depth, and
          desire.
        </p>
        <a className="gallery-cta" href="#product">
          <span>Discover AURUM</span>
        </a>
      </div>
      <div className="presence-gallery" data-presence-gallery>
        <div className="presence-slides" aria-live="polite">
          {[
            ["gallery-1.jpg", "AURUM NOIRE campaign portrait in dark tailoring", "893"],
            ["gallery-2.jpg", "AURUM NOIRE campaign detail with black shirt and watch", "893"],
            ["gallery-3.jpg", "AURUM NOIRE sprayed at the neck", "893"],
            ["gallery-4.jpg", "AURUM NOIRE bottle in dark amber liquid", "893"],
            ["gallery-5.jpg", "AURUM NOIRE bottle on polished dark wood", "893"],
            ["gallery-6.jpg", "Close view of the AURUM NOIRE glass bottle", "893"],
            ["gallery-7.jpg", "AURUM NOIRE bottle resting on charred wood", "893"],
            ["gallery-8.jpg", "Black and white portrait holding AURUM NOIRE", "900"],
          ].map(([image, alt, height], index) => (
            <figure className={`presence-fade-slide${index === 0 ? " is-current" : ""}`} data-gallery-slide key={image}>
              <img src={`assets/${image}`} alt={alt} width="1600" height={height} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
        <button className="gallery-nav gallery-nav--prev" type="button" aria-label="Previous gallery image" data-gallery-prev>
          <span aria-hidden="true" />
        </button>
        <button className="gallery-nav gallery-nav--next" type="button" aria-label="Next gallery image" data-gallery-next>
          <span aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function BottleDesign() {
  return (
    <>
      <section className="collection-section" id="collection" aria-labelledby="collection-title">
        <figure className="collection-visual" aria-hidden="true">
          <img
            className="collection-image"
            src="assets/collection-group.jpg"
            alt=""
            width="1918"
            height="992"
            loading="lazy"
            decoding="async"
            data-rise-on-view
          />
        </figure>
        <div className="collection-copy">
          <h2 id="collection-title">More than one signature.</h2>
          <SectionKicker>The AURUM Collection</SectionKicker>
          <p>
            Not a single expression, but a study in contrast.
            <br />
            Each composition explores a different shade of presence — from light to depth, restraint to intensity.
          </p>
          <a className="collection-cta" href="#noir">
            <span>View All Expressions</span>
          </a>
        </div>
      </section>
      <section className="tenebre-showcase" aria-label="TENEBRE fragrance expression">
        <img
          src="assets/tenebre-fullwidth.jpg"
          alt="TENEBRE Eau de Parfum bottle on charred wood"
          width="1920"
          height="1101"
          loading="lazy"
          decoding="async"
        />
        <a className="tenebre-cta" href="#noir">
          <span>A darker expression awaits</span>
        </a>
      </section>
    </>
  );
}

function ExploreNoire() {
  return (
    <section className="explore-section" id="noir" aria-labelledby="explore-title">
      <div className="explore-intro">
        <h2 id="explore-title">Beyond the Fragrance</h2>
        <p>AURUM NOIRE extends from scent into skin, water, and touch — a darker ritual of modern refinement.</p>
      </div>
      <div className="explore-grid" aria-label="AURUM NOIRE collection products">
        {[
          ["collection-perf.jpg", "AURUM NOIRE Parfum bottle", 454, "Parfum", "100ml"],
          ["collection-gel.jpg", "AURUM NOIRE shower gel", 452, "Shower Gel", "300 mL / 10.1 FL. OZ."],
          ["collection-balm.jpg", "AURUM NOIRE aftershave balm", 454, "Aftershave Balm", "100 mL / 3.4 FL. OZ."],
          ["collection-lotion.jpg", "AURUM NOIRE body lotion", 453, "Body Lotion", "250 mL / 8.4 FL. OZ."],
        ].map(([image, alt, width, product, size]) => (
          <figure key={image}>
            <img src={`assets/${image}`} alt={alt} width={width} height="561" loading="lazy" decoding="async" />
            <figcaption className="product-caption">
              <strong>AURUM NOIRE</strong>
              <span>{product}</span>
              <small>{size}</small>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  function handleSubmit(event) {
    event.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!isValid) {
      setStatus("error");
      return;
    }

    setStatus("success");
  }

  return (
    <form className={`newsletter footer-newsletter newsletter--${status}`} action="#" onSubmit={handleSubmit} noValidate>
      <label htmlFor="email">Enter the World of ÉLYR</label>
      <p>Receive private access to new releases.</p>
      <div>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          aria-describedby="newsletter-note"
          aria-invalid={status === "error"}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle") setStatus("idle");
          }}
        />
        <button type="submit">{status === "success" ? "Joined" : "Join the List"}</button>
      </div>
      <small id="newsletter-note">
        {status === "error"
          ? "Enter a valid email address."
          : status === "success"
            ? "You are on the private launch list."
            : "Receive private access to new releases."}
      </small>
    </form>
  );
}

function Footer() {
  return (
    <footer className="footer" id="footer">
      <NewsletterForm />
      <div className="footer-links">
        <nav aria-label="Fragrance links">
          <a href="#collection">The Aurum Line</a>
          <a href="#noir">Noire Parfum</a>
          <a href="#collection">Tenebre Eau de Parfum</a>
          <a href="#collection">Aube Eau de Toilette</a>
        </nav>
        <nav aria-label="Company links">
          <a href="#top">The House of ÉLYR</a>
          <a href="#product">Our Craft</a>
          <a href="#product">Ingredients</a>
          <a href="#footer">Rituals</a>
        </nav>
        <nav aria-label="Stockist and shipping links">
          <a href="#footer">Contact</a>
          <a href="#footer">Shipping & Returns</a>
          <a href="#footer">Stockists</a>
          <a href="#footer">FAQ</a>
        </nav>
        <nav aria-label="Policy links">
          <a href="#footer">Privacy Policy</a>
          <a href="#footer">Terms of Service</a>
          <a href="#footer">Accessibility</a>
        </nav>
      </div>
      <div className="footer-bottom footer-bottom--collection">
        <p>© 2026 ÉLYR. The House of AURUM. All rights reserved.</p>
        <a className="footer-logo footer-logo--center" href="#top" aria-label="ELYR home">
          <img src="assets/logo-gold.png" alt="" />
        </a>
        <nav aria-label="Social links">
          <span>Follow Us</span>
          <a href="#footer">Facebook</a>
          <a href="#footer">Instagram</a>
          <a href="#footer">TikTok</a>
          <a href="#footer">YouTube</a>
        </nav>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Hero />
      <main>
        <Story />
        <ProductLine />
        <MainProduct />
        <Notes />
        <BottleDesign />
        <ExploreNoire />
      </main>
      <Footer />
    </>
  );
}
