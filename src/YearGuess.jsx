// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// ===================== Yearious — full app =====================
// Flip reveal with 0.20s stagger, confetti after reveal, cursor-delete-in-place (no shifting)

// 10 items per category (90 total)
const EVENTS = [
  // ===== Music (10)
  { year: "1964", event: "The Beatles debut on The Ed Sullivan Show (U.S.)", info: "Over 70 million viewers watch the Beatles' first U.S. TV appearance, igniting Beatlemania across America.", category: "music" },
  { year: "1969", event: "Woodstock Festival", info: "Three days of peace and music in upstate New York with Hendrix, Joplin, The Who, and more; the emblem of counterculture.", category: "music" },
  { year: "1973", event: "Pink Floyd releases *The Dark Side of the Moon*", info: "An audiophile landmark; it spent a record 900+ weeks on the Billboard 200 and redefined concept albums.", category: "music" },
  { year: "1982", event: "Michael Jackson releases *Thriller*", info: "The best‑selling album in history; groundbreaking music videos and Quincy Jones production set a new pop standard.", category: "music" },
  { year: "1984", event: "Prince releases *Purple Rain*", info: "A fusion of rock, funk, and pop tied to the hit film; widely cited among the greatest albums of all time.", category: "music" },
  { year: "1985", event: "Live Aid global concert", info: "Twin concerts in London and Philadelphia raise funds for Ethiopian famine relief and pioneer global live broadcasts.", category: "music" },
  { year: "1991", event: "Nirvana releases *Nevermind*", info: "Grunge explodes into the mainstream; the single 'Smells Like Teen Spirit' becomes a generational anthem.", category: "music" },
  { year: "1994", event: "Green Day releases *Dookie*", info: "Pop‑punk breaks big, bringing punk energy to Top 40 radio and MTV for a new generation.", category: "music" },
  { year: "2000", event: "Radiohead releases *Kid A*", info: "A bold electronic turn that influenced 2000s alternative music, blending glitch, ambient, and art rock.", category: "music" },
  { year: "2016", event: "Beyoncé releases *Lemonade*", info: "A visual album mixing R&B, rock, and country with a narrative of resilience and cultural history.", category: "music" },

  // ===== Movies (10)
  { year: "1939", event: "*Gone with the Wind* premieres", info: "One of the most‑watched films of the classic era; known for its scale and complicated legacy.", category: "movies" },
  { year: "1941", event: "*Citizen Kane* released", info: "Orson Welles' debut innovates deep focus, non‑linear narrative, and sound design; a perennial 'greatest film'.", category: "movies" },
  { year: "1972", event: "*The Godfather* is released", info: "Coppola's mafia saga raises the bar for character‑driven epics and modern American cinema.", category: "movies" },
  { year: "1977", event: "*Star Wars: A New Hope* releases", info: "George Lucas brings space opera to blockbuster status, transforming visual effects and merchandising.", category: "movies" },
  { year: "1980", event: "*The Empire Strikes Back* premieres", info: "Darker middle chapter with iconic reveals; often ranked the best *Star Wars* film.", category: "movies" },
  { year: "1994", event: "*Pulp Fiction* released", info: "Quentin Tarantino mainstreams non‑linear storytelling and postmodern pop‑culture dialogue.", category: "movies" },
  { year: "1997", event: "*Titanic* is released", info: "James Cameron's historical romance sets box‑office records and wins 11 Oscars.", category: "movies" },
  { year: "2003", event: "*The Return of the King* releases", info: "LOTR trilogy finale sweeps 11 Oscars, tying the all‑time record and redefining fantasy epics.", category: "movies" },
  { year: "2008", event: "*The Dark Knight* premieres", info: "Heath Ledger's Joker and grounded superhero tone influence comic‑book films for years.", category: "movies" },
  { year: "2010", event: "*Inception* released", info: "A mind‑bending heist through dreams; popularizes the blockbuster puzzle‑film with practical effects.", category: "movies" },

  // ===== Tech (10)
  { year: "1969", event: "ARPANET sends its first message", info: "A 'LO' from UCLA to Stanford crashes after two letters—yet it marks the dawn of internetworking.", category: "tech" },
  { year: "1971", event: "Intel introduces the 4004 microprocessor", info: "The first commercially available CPU on a chip; a foundation for modern computing.", category: "tech" },
  { year: "1983", event: "Domain Name System (DNS) introduced", info: "Human‑readable domains replace numeric IP addresses, making the internet far more usable.", category: "tech" },
  { year: "1989", event: "Tim Berners‑Lee proposes the World Wide Web", info: "HTTP, HTML, and URLs are conceived at CERN—blueprints for the web as we know it.", category: "tech" },
  { year: "1995", event: "JavaScript created at Netscape", info: "Brendan Eich designs JS in 10 days, enabling interactive web pages and modern front‑end apps.", category: "tech" },
  { year: "2001", event: "Wikipedia launches", info: "A free, open encyclopedia that grows into one of the web’s most visited information sources.", category: "tech" },
  { year: "2004", event: "Facebook founded", info: "Social networking surges, reshaping online identity, advertising, and communication.", category: "tech" },
  { year: "2007", event: "Apple unveils the iPhone", info: "Multi‑touch UI and an all‑screen smartphone kickstart the mobile computing era.", category: "tech" },
  { year: "2010", event: "Apple releases the iPad", info: "A tablet for media and apps that normalizes touch‑first computing beyond phones.", category: "tech" },
  { year: "2016", event: "AlphaGo defeats Lee Sedol", info: "DeepMind’s AI beats a Go world champion, showcasing breakthroughs in deep reinforcement learning.", category: "tech" },

  // ===== Sports (10)
  { year: "1903", event: "First Tour de France held", info: "The inaugural multi‑stage cycling race establishes a template for grand tours.", category: "sports" },
  { year: "1936", event: "First Olympic basketball tournament", info: "Berlin Olympics introduce basketball; the U.S. wins gold in the outdoor final played in rain.", category: "sports" },
  { year: "1954", event: "Roger Bannister runs sub‑4 minute mile", info: "Breaking the 4‑minute barrier changes perceptions of human speed in middle‑distance running.", category: "sports" },
  { year: "1966", event: "England wins the FIFA World Cup", info: "A home victory at Wembley; Geoff Hurst scores a historic hat trick in the final.", category: "sports" },
  { year: "1980", event: "Miracle on Ice", info: "Underdog U.S. hockey team defeats the USSR at the Lake Placid Winter Olympics.", category: "sports" },
  { year: "1996", event: "Atlanta hosts the Summer Olympics", info: "Centennial Games highlight global athleticism and a new era of corporate sponsorships.", category: "sports" },
  { year: "2008", event: "Usain Bolt sets 100m world record", info: "Bolt runs 9.69 in Beijing (later 9.58 in 2009), redefining sprinting dominance.", category: "sports" },
  { year: "2016", event: "Chicago Cubs win the World Series", info: "The Cubs end a 108‑year championship drought in a dramatic Game 7.", category: "sports" },
  { year: "2018", event: "France wins the FIFA World Cup", info: "A youthful French team led by Mbappé defeats Croatia 4‑2 in Moscow.", category: "sports" },
  { year: "2021", event: "Tokyo Olympics held (delayed)", info: "The 2020 Games are postponed due to COVID‑19 and staged without normal crowds.", category: "sports" },

  // ===== History (10)
  { year: "1776", event: "U.S. Declaration of Independence", info: "Thirteen colonies declare independence from Britain, forming a new nation.", category: "history" },
  { year: "1789", event: "French Revolution begins", info: "The storming of the Bastille becomes a symbol of revolutionary change in France.", category: "history" },
  { year: "1865", event: "American Civil War ends", info: "Confederate surrender at Appomattox ushers in Reconstruction.", category: "history" },
  { year: "1914", event: "World War I begins", info: "Austro‑Hungarian declaration on Serbia triggers alliances into global conflict.", category: "history" },
  { year: "1918", event: "World War I ends", info: "Armistice signed on November 11; later formalized by the Treaty of Versailles (1919).", category: "history" },
  { year: "1945", event: "World War II ends", info: "Victory in Europe in May and Japan’s surrender in August/September end global war.", category: "history" },
  { year: "1963", event: "Assassination of John F. Kennedy", info: "The U.S. president is assassinated in Dallas, profoundly impacting American politics.", category: "history" },
  { year: "1969", event: "Apollo 11 Moon landing", info: "Neil Armstrong and Buzz Aldrin walk on the Moon; millions watch the live broadcast.", category: "history" },
  { year: "1989", event: "Fall of the Berlin Wall", info: "Borders open between East and West Berlin, signaling the Cold War’s approaching end.", category: "history" },
  { year: "2001", event: "September 11 attacks", info: "Coordinated terrorist attacks in the U.S. reshape global security and foreign policy.", category: "history" },

  // ===== Inventions (10)
  { year: "1440", event: "Gutenberg invents the printing press", info: "Movable‑type printing enables mass literacy and rapid spread of ideas across Europe.", category: "inventions" },
  { year: "1769", event: "James Watt patents improved steam engine", info: "Efficient steam power fuels factories and transportation in the Industrial Revolution.", category: "inventions" },
  { year: "1876", event: "Alexander Graham Bell patents the telephone", info: "Long‑distance voice communication begins, transforming business and daily life.", category: "inventions" },
  { year: "1903", event: "Wright brothers achieve first powered flight", info: "Orville and Wilbur’s Flyer ushers in the aviation age at Kitty Hawk.", category: "inventions" },
  { year: "1928", event: "Discovery of penicillin", info: "Alexander Fleming’s observation leads to antibiotics that revolutionize medicine.", category: "inventions" },
  { year: "1947", event: "Transistor invented at Bell Labs", info: "Bardeen, Brattain, and Shockley create a device that replaces vacuum tubes and enables modern electronics.", category: "inventions" },
  { year: "1958", event: "First integrated circuit", info: "Jack Kilby’s IC demonstrates multiple components on a single chip, shrinking electronics.", category: "inventions" },
  { year: "1971", event: "Microprocessor commercialized (Intel 4004)", info: "A CPU on a chip allows general‑purpose computing in small devices.", category: "inventions" },
  { year: "1973", event: "First handheld mobile phone call", info: "Motorola’s Martin Cooper places a call on the DynaTAC prototype in New York City.", category: "inventions" },
  { year: "2007", event: "First iPhone", info: "A phone, an iPod, and an internet communicator—Apple combines them into a single device.", category: "inventions" },

  // ===== Math (10)
  { year: "1637", event: "Descartes publishes analytic geometry", info: "Coordinate geometry links algebra with geometry, enabling calculus and modern physics.", category: "math" },
  { year: "1687", event: "Newton publishes *Principia*", info: "Laws of motion and universal gravitation formalize classical mechanics.", category: "math" },
  { year: "1735", event: "Euler solves the Basel problem", info: "Euler finds the exact sum of reciprocal squares as π²/6, stunning the math world.", category: "math" },
  { year: "1821", event: "Cauchy’s *Cours d’Analyse*", info: "Introduces rigor to calculus with limits, continuity, and convergence definitions.", category: "math" },
  { year: "1859", event: "Riemann publishes on prime distribution", info: "The paper introduces the Riemann Hypothesis, central to number theory.", category: "math" },
  { year: "1900", event: "Hilbert’s 23 problems", info: "A famous list that guided much of 20th‑century mathematical research.", category: "math" },
  { year: "1931", event: "Gödel’s incompleteness theorems", info: "Shows inherent limits of formal axiomatic systems—some truths are unprovable.", category: "math" },
  { year: "1976", event: "Four Color Theorem proved (computer‑assisted)", info: "Appel and Haken use computer checking to prove every map can be colored with four colors.", category: "math" },
  { year: "1994", event: "Wiles proves Fermat’s Last Theorem", info: "A 350‑year‑old puzzle solved using elliptic curves and modular forms.", category: "math" },
  { year: "2006", event: "Poincaré Conjecture resolved", info: "Perelman’s work on Ricci flow leads to the first Clay Millennium Prize problem solved.", category: "math" },

  // ===== Animals (10)
  { year: "1859", event: "Darwin publishes *On the Origin of Species*", info: "Proposes natural selection as the mechanism of evolution, transforming biology.", category: "animals" },
  { year: "1905", event: "National Audubon Society founded", info: "A major U.S. conservation organization focused on birds and habitats.", category: "animals" },
  { year: "1918", event: "Migratory Bird Treaty Act (U.S.)", info: "Protects migratory birds across North America, a cornerstone of wildlife law.", category: "animals" },
  { year: "1960", event: "Jane Goodall begins chimp research", info: "Long‑term study at Gombe reveals tool use and complex social behavior in chimpanzees.", category: "animals" },
  { year: "1973", event: "U.S. Endangered Species Act", info: "A powerful law to prevent extinction and recover imperiled species.", category: "animals" },
  { year: "1986", event: "International Whaling Moratorium begins", info: "Commercial whaling largely halts under IWC rules, aiding whale recovery.", category: "animals" },
  { year: "1996", event: "Dolly the sheep cloned", info: "First mammal cloned from an adult somatic cell, sparking bioethics debates.", category: "animals" },
  { year: "2000", event: "Census of Marine Life launched", info: "A decade‑long global effort to catalog ocean biodiversity, concluding in 2010.", category: "animals" },
  { year: "2012", event: "Snow leopard conservation gains", info: "A range‑wide initiative expands protections across Central Asia for elusive big cats.", category: "animals" },
  { year: "2016", event: "Giant panda downlisted to Vulnerable", info: "IUCN reclassifies the giant panda after notable habitat restoration and conservation.", category: "animals" },

  // ===== Architecture (10)
  { year: "1653", event: "Taj Mahal completed", info: "Mughal emperor Shah Jahan’s mausoleum in Agra becomes a masterpiece of Indo‑Islamic architecture.", category: "architecture" },
  { year: "1889", event: "Eiffel Tower completed", info: "Gustave Eiffel’s iron lattice tower becomes the Paris skyline’s icon.", category: "architecture" },
  { year: "1931", event: "Empire State Building completed", info: "An Art Deco skyscraper that held the world’s height record for nearly 40 years.", category: "architecture" },
  { year: "1959", event: "Solomon R. Guggenheim Museum opens (NYC)", info: "Frank Lloyd Wright’s spiral design challenges traditional museum layouts.", category: "architecture" },
  { year: "1973", event: "Sears Tower (Willis Tower) completed", info: "A bundled‑tube design makes it the world’s tallest for decades.", category: "architecture" },
  { year: "1989", event: "Louvre Pyramid inaugurated", info: "I. M. Pei’s glass pyramid modernizes the Louvre’s entrance and identity.", category: "architecture" },
  { year: "2000", event: "Tate Modern opens (London)", info: "A power‑station conversion by Herzog & de Meuron that reshaped museum reuse projects.", category: "architecture" },
  { year: "2004", event: "Taipei 101 opens", info: "A supertall with tuned mass damper engineering to withstand typhoons and quakes.", category: "architecture" },
  { year: "2008", event: "Beijing National Stadium (Bird’s Nest) opens", info: "Herzog & de Meuron and Ai Weiwei create a striking Olympic symbol.", category: "architecture" },
  { year: "2010", event: "Burj Khalifa opens", info: "Dubai’s supertall skyscraper becomes the tallest building in the world.", category: "architecture" },
];

const ONLY_DIGITS = /[0-9]/;
const isValidGuess = (s, target) => s.length === target.length && /^[0-9]+$/.test(s);

// Score per digit: green=exact, low=your digit too low, high=too high
function scoreGuess(guess, target) {
  return guess.split("").map((d, i) => {
    const td = target[i];
    if (d === td) return "green";
    if (+d < +td) return "low";   // shown as yellow
    if (+d > +td) return "high";  // shown as orange
    return "empty";
  });
}

// ===================== UI: Tile with flip reveal =====================
function Tile({ ch, status, isActive, onClick, theme, revealed = false, revealDelay = 0 }) {
  const sizeCls = "w-14 h-14 sm:w-12 sm:h-12";
  const base = `relative ${sizeCls} rounded-2xl select-none transition-all`;
  const isLight = theme === "light";

  // Colors
  const neutralBg = isLight ? "#e5e7eb" : "#18181b"; // zinc-200 / zinc-900
  const neutralText = isLight ? "#111827" : "#ffffff";
  const borderColor = isLight ? "#d1d5db" : "#3f3f46"; // zinc-300 / zinc-700
  const colorMap = { green: "#22c55e", low: "#facc15", high: "#f97316", empty: neutralBg };
  const targetBg = colorMap[status] || neutralBg;
  const revealText = status === "low" ? "#111827" : "#ffffff";

  return (
    <div onClick={onClick} className={`${base} shadow-sm`} style={{ perspective: 800 }}>
      {isActive && (
        <motion.div
          layoutId="selector"
          className={`absolute inset-0 rounded-2xl pointer-events-none ${
            isLight ? "bg-zinc-300/40 ring-2 ring-zinc-400/60" : "bg-white/10 ring-2 ring-white/30"
          }`}
        />
      )}
      {/* Flip wrapper */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        initial={{ rotateX: 0 }}
        animate={{ rotateX: revealed ? 180 : 0 }}
        transition={{ delay: revealDelay, duration: 0.8, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front face (neutral before reveal) */}
        <div
          className="absolute inset-0 rounded-2xl border flex items-center justify-center font-extrabold text-xl"
          style={{ backfaceVisibility: "hidden", background: neutralBg, color: neutralText, borderColor }}
        >
          {ch || "\u00A0"}
        </div>
        {/* Back face (colored after reveal) */}
        <div
          className="absolute inset-0 rounded-2xl border flex items-center justify-center font-extrabold text-xl"
          style={{
            transform: "rotateX(180deg)",
            backfaceVisibility: "hidden",
            background: targetBg,
            color: revealText,
            borderColor,
          }}
        >
          {ch || "\u00A0"}
        </div>
      </motion.div>
    </div>
  );
}

// Row that can reveal instantly or in a staggered way after submit
function GuessRow({ guess, pattern, length, activeIndex, setActiveIndex, active, theme, revealMode }) {
  const slots = Array.from({ length }, (_, i) => guess[i] ?? "");
  const revealed = !!pattern;
  return (
    <div className="flex gap-2 justify-center my-1">
      {slots.map((ch, i) => (
        <Tile
          key={i + "-" + (pattern ? pattern[i] : "p") + "-" + (ch || "_")}
          ch={ch}
          status={pattern ? pattern[i] : "empty"}
          isActive={active && i === activeIndex}
          onClick={() => active && setActiveIndex(i)}
          theme={theme}
          revealed={revealed}
          revealDelay={revealed ? (revealMode === "stagger" ? i * 0.2 : 0) : 0}
        />
      ))}
    </div>
  );
}

function MobileKeyboard({ onDigit, onBackspace, onEnter, theme }) {
  const keys = useMemo(() => [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["⌫", "0", "Enter"]], []);
  const baseBtn = theme === "light" ? "bg-transparent border border-zinc-300 hover:bg-black/5 text-zinc-900" : "bg-white/5 border border-white/10 hover:bg-white/10 text-white";
  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {keys.flat().map((k, idx) => (
        <button
          key={idx}
          onClick={() => { if (k === "⌫") onBackspace(); else if (k === "Enter") onEnter(); else onDigit(k); }}
          className={`py-3 rounded-xl font-semibold active:scale-95 ${baseBtn}`}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

export default function Yearious() {
  // ====== Category selection ======
  const categories = ["music", "movies", "tech", "sports", "history", "inventions", "math", "animals", "architecture"];
  const [selectedCats, setSelectedCats] = useState(categories);

  // ====== Game state ======
  const [puzzle, setPuzzle] = useState(null); // {year,event,info,category}
  const [inputArr, setInputArr] = useState([]); // array of digits/empties, fixed length = year len
  const [cursor, setCursor] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [status, setStatus] = useState("playing"); // playing | won | lost
  const [message, setMessage] = useState("");
  const [revealInfo, setRevealInfo] = useState("");
  const [revealing, setRevealing] = useState(false); // true while the latest row is flipping

  // ====== Streaks ======
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // ====== Modals ======
  const [showHowTo, setShowHowTo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // ====== Theme ======
  const [theme, setTheme] = useState(() => (typeof localStorage !== "undefined" ? localStorage.getItem("yg_theme") || "dark" : "dark"));
  useEffect(() => { try { localStorage.setItem("yg_theme", theme); } catch {} }, [theme]);
  const isLight = theme === "light";
  const bgClass = isLight ? "bg-gradient-to-b from-zinc-100 to-white text-zinc-900" : "bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-100";
  const cardClass = isLight ? "bg-white/70 backdrop-blur rounded-2xl p-5 border border-zinc-200 shadow-lg" : "bg-white/5 backdrop-blur rounded-2xl p-5 border border-white/10 shadow-lg shadow-black/20";
  const ghostBtn = isLight ? "bg-transparent border border-zinc-300 hover:bg-black/5 text-zinc-900" : "bg-transparent border border-white/10 hover:bg-white/5 text-zinc-100";
  const primaryBtn = "bg-emerald-600 hover:bg-emerald-500 text-white";
  const pillSelected = isLight ? "bg-zinc-200 border border-zinc-300 text-zinc-900" : "bg-white/10 border border-white/15 text-white";
  const pillUnselected = isLight ? "bg-transparent border border-zinc-300 text-zinc-700 hover:bg-black/5" : "bg-transparent border border-white/10 text-zinc-300 hover:bg-white/5";

  // ====== Mobile detection ======
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(pointer: coarse)");
    setIsMobile(mq ? mq.matches : /Mobi|Android/i.test(navigator.userAgent));
  }, []);

  // ====== Load streaks ======
  useEffect(() => {
    try {
      const c = parseInt(localStorage.getItem("yg_currentStreak") || "0", 10);
      const b = parseInt(localStorage.getItem("yg_bestStreak") || "0", 10);
      if (!Number.isNaN(c)) setCurrentStreak(c);
      if (!Number.isNaN(b)) setBestStreak(b);
    } catch {}
  }, []);
  function persistStreaks(c, b) {
    try { localStorage.setItem("yg_currentStreak", String(c)); localStorage.setItem("yg_bestStreak", String(b)); } catch {}
  }

  // ====== Pool + random pick ======
  const pool = selectedCats && selectedCats.length ? EVENTS.filter((e) => selectedCats.includes(e.category)) : EVENTS;
  function pickRandom() { return pool[Math.floor(Math.random() * pool.length)] || EVENTS[0]; }

  // Init puzzle
  useEffect(() => { setPuzzle(pickRandom()); }, []);

  // Reset input array when puzzle changes
  useEffect(() => {
    if (puzzle) {
      setInputArr(Array(puzzle.year.length).fill(""));
      setCursor(0);
    }
  }, [puzzle]);

  // When categories change, reset the game with a new event and clear board
  useEffect(() => {
    newEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCats]);

  // ====== Desktop typing ======
  useEffect(() => {
    if (isMobile) return;
    function onKeyDown(e) {
      if (status !== "playing" || !puzzle || revealing) return;
      const k = e.key;
      const tag = (e.target?.tagName || "").toLowerCase();
      const isEd = e.target?.isContentEditable || ["input","textarea","select"].includes(tag);
      if (isEd) return;
      if (k === "Enter") { e.preventDefault(); trySubmit(); return; }
      if (k === "Backspace") { e.preventDefault(); backspace(); return; }
      if (k === "ArrowLeft") { e.preventDefault(); setCursor(c => Math.max(0, c - 1)); return; }
      if (k === "ArrowRight") { e.preventDefault(); setCursor(c => Math.min((puzzle?.year?.length || 4) - 1, c + 1)); return; }
      if (ONLY_DIGITS.test(k)) { e.preventDefault(); insertDigit(k); return; }
    }
    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobile, status, puzzle, revealing, cursor, inputArr]);

  if (!puzzle) return <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4`}>Loading…</div>;

  const len = puzzle.year.length;
  const inputStr = (inputArr || []).map(ch => ch || "").join(""); // for validation/submit (no spaces)
  const inputDisplayStr = (inputArr || []).map(ch => (ch === "" ? " " : ch)).join(""); // keep visual gaps for active row

  // ====== Input ops (no shifting) ======
  function insertDigit(d) {
    setInputArr(arr => {
      const next = [...arr];
      next[cursor] = d;
      setCursor(Math.min(cursor + 1, len - 1));
      return next;
    });
  }
  function backspace() {
    // Delete at the selector first; if already empty, delete to the left and move left
    setInputArr(prev => {
      const next = [...prev];
      if (next[cursor]) {
        // Current slot has a digit: clear it, stay on this slot
        next[cursor] = "";
        return next;
      }
      // Current is empty: a second press deletes left and moves left
      if (cursor > 0) {
        if (next[cursor - 1]) next[cursor - 1] = "";
        setCursor(cursor - 1);
      }
      return next;
    });
  }

  // ====== Submit ======
  function trySubmit() {
    if (revealing) return; // ignore while revealing
    if (inputStr.length !== len) { setMessage(`Enter a ${len}-digit year.`); return; }
    if (!isValidGuess(inputStr, puzzle.year)) { setMessage(`Enter a ${len}-digit year.`); return; }

    const pat = scoreGuess(inputStr, puzzle.year);
    const newGuesses = [...guesses, inputStr];
    const correct = inputStr === puzzle.year;

    setGuesses(newGuesses);
    setPatterns(prev => [...prev, pat]);
    setInputArr(Array(len).fill(""));
    setCursor(0);
    setRevealing(true);

    // Total reveal time = flip duration (0.8s) + stagger (0.2s * (len-1))
    const totalMs = Math.round((0.8 + 0.2 * (len - 1)) * 1000) + 100;

    setTimeout(() => {
      setRevealing(false);
      if (correct) {
        const nextCurrent = currentStreak + 1;
        const nextBest = Math.max(bestStreak, nextCurrent);
        setCurrentStreak(nextCurrent);
        setBestStreak(nextBest);
        persistStreaks(nextCurrent, nextBest);
        setStatus("won");
        setMessage("Correct!");
        setRevealInfo(`${puzzle.year}: ${puzzle.info}`);
        confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
      } else if (newGuesses.length >= 4) {
        if (currentStreak !== 0) { setCurrentStreak(0); persistStreaks(0, bestStreak); }
        setStatus("lost");
        setMessage("Out of tries.");
        setRevealInfo(`It was ${puzzle.year}: ${puzzle.info}`);
      } else {
        setMessage("");
      }
    }, totalMs);
  }

  // ====== Controls ======
  function newEvent() {
    setPuzzle(pickRandom());
    setGuesses([]);
    setPatterns([]);
    setStatus("playing");
    setMessage("");
    setRevealInfo("");
    setRevealing(false);
  }
  function toggleCategory(cat) { setSelectedCats(prev => (prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])); }

  return (
    <div className={`app-root min-h-screen ${bgClass} flex items-center justify-center p-4`}>
      <div className="yg-shell w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Yearious</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 text-sm opacity-80">
              <div>Streak <span className="font-bold">{currentStreak}</span></div>
              <div>Best <span className="font-bold">{bestStreak}</span></div>
            </div>
            <button onClick={() => setShowHowTo(true)} className={`px-3 py-1 rounded-xl ${ghostBtn} font-semibold text-sm`} title="How to play">?</button>
            <button onClick={() => setShowSettings(true)} className={`px-3 py-1 rounded-xl ${ghostBtn} font-semibold text-sm`} title="Settings">⚙️</button>
            <button onClick={newEvent} className={`px-3 py-1 rounded-xl ${primaryBtn} font-semibold text-sm`}>New Event</button>
          </div>
        </div>

        {/* Category selector */}
        <div className="mb-3 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`${selectedCats.includes(cat) ? pillSelected : pillUnselected} px-3 py-1 rounded-xl text-sm font-semibold`}
            >
              {cat}
            </button>
          ))}
          <button onClick={() => setSelectedCats(categories)} className={`px-3 py-1 rounded-xl ${ghostBtn} font-semibold text-sm`}>All</button>
          <button onClick={() => setSelectedCats([])} className={`px-3 py-1 rounded-xl ${ghostBtn} font-semibold text-sm`}>Clear</button>
        </div>

        {/* Game panel */}
  <div className={`yg-card ${cardClass}`}>
          <div className="text-lg md:text-xl font-semibold mb-3 text-center">{puzzle.event}</div>

          <AnimatePresence>
            {message && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-sm mb-2 text-center opacity-80">{message}</motion.div>
            )}
          </AnimatePresence>

          {/* Board (4 rows) */}
          <div className="my-4">
            {Array.from({ length: 4 }, (_, row) => {
              const isActiveRow = row === guesses.length && status === "playing" && !revealing;
              const hasPattern = !!patterns[row];
              const revealMode = hasPattern && row === guesses.length - 1 ? "stagger" : hasPattern ? "instant" : "none";
              const activeGuessStr = inputDisplayStr; // preserve visual gaps on active row
              return (
                <div key={row} className="flex justify-center">
                  <GuessRow
                    guess={guesses[row] ?? (isActiveRow ? activeGuessStr : "")}
                    pattern={patterns[row]}
                    length={len}
                    activeIndex={isActiveRow ? cursor : -1}
                    setActiveIndex={(i) => { if (isActiveRow) setCursor(i); }}
                    active={isActiveRow}
                    theme={theme}
                    revealMode={revealMode}
                  />
                </div>
              );
            })}
          </div>

          {isMobile && status === "playing" && (
            <MobileKeyboard onDigit={insertDigit} onBackspace={backspace} onEnter={trySubmit} theme={theme} />
          )}

          {revealInfo && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 rounded-xl text-center text-sm border" style={{ background: isLight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.05)", borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)" }}>
              {revealInfo}
            </motion.div>
          )}

          {(status === "won" || status === "lost") && (
            <div className="flex justify-center mt-4">
              <button onClick={newEvent} className={`px-4 py-2 rounded-xl yg-btn ${ghostBtn} transition-all`}>Play Another</button>
            </div>
          )}
        </div>
      </div>

      {/* How To Play (modal) */}
      {showHowTo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 w-full max-w-md rounded-2xl p-5 border border-zinc-700 text-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">How to Play</h2>
              <button onClick={() => setShowHowTo(false)} className="px-2 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600">✖</button>
            </div>
            <ul className="list-disc ml-5 space-y-2 text-sm opacity-90">
              <li>Guess the year of the event. You have 4 guesses.</li>
              <li>Type digits directly into the tiles (desktop) or use the keypad (mobile).</li>
              <li><span className="text-green-500 font-semibold">Green</span> = exact digit, <span className="text-yellow-400 font-semibold">Yellow</span> = too low, <span className="text-orange-500 font-semibold">Orange</span> = too high.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Settings */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 w-full max-w-md rounded-2xl p-5 border border-zinc-700 text-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="px-2 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600">✖</button>
            </div>
            <div className="text-sm space-y-3 mb-3">
              <div className="flex items-center justify-between"><span>Current streak:</span><span className="font-bold">{currentStreak}</span></div>
              <div className="flex items-center justify-between"><span>Best streak:</span><span className="font-bold">{bestStreak}</span></div>
              <div className="flex items-center justify-between">
                <span>Theme</span>
                <button onClick={() => setTheme(prev => (prev === "dark" ? "light" : "dark"))} className="px-3 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600">{theme === "dark" ? "Switch to Light" : "Switch to Dark"}</button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCurrentStreak(0);
                  setBestStreak(0);
                  try {
                    localStorage.setItem("yg_currentStreak", "0");
                    localStorage.setItem("yg_bestStreak", "0");
                  } catch {}
                }}
                className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 font-semibold text-sm"
              >
                Clear streak
              </button>
              <button onClick={() => setShowSettings(false)} className="px-3 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 font-semibold text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
