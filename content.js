/*
  TUTTI I TESTI DEL SITO.
  Per aggiornare il sito si modifica solo questo file.
  Ogni testo ha la versione italiana (it) e inglese (en).
*/
window.CONTENT = {
  name: "Marco Bresciani",

  hero: {
    words: {
      it: ["Logistica", "Vendite", "Negoziazione", "Intelligenza artificiale", "Arte generativa"],
      en: ["Logistics", "Sales", "Negotiation", "Artificial intelligence", "Generative art"]
    },
    tagline: {
      it: "Pianifico, negozio, sperimento. Dalla logistica all'AI, con lo stesso spirito competitivo.",
      en: "I plan, negotiate, experiment. From logistics to AI, with the same competitive drive."
    }
  },

  titles: {
    about:     { it: "Chi sono",    en: "About" },
    numbers:   { it: "Numeri",      en: "Numbers" },
    career:    { it: "Percorso",    en: "Career" },
    earlier:   { it: "Esperienze precedenti", en: "Earlier experience" },
    education: { it: "Formazione",  en: "Education" },
    skills:    { it: "Competenze",  en: "Skills" },
    now:       { it: "Ora",         en: "Now" },
    cv:        { it: "CV",          en: "CV" },
    contact:   { it: "Contatti",    en: "Contact" }
  },

  ui: {
    close: { it: "Chiudi", en: "Close" }
  },

  about: {
    short: {
      it: "Logistic planner con una laurea in economia e marketing e la curiosità di chi vuole sempre capire come funzionano le cose. Dalla gestione dei trasporti alla strategia commerciale, fino all'intelligenza artificiale applicata al lavoro.",
      en: "Logistic planner with a degree in economics and marketing, and the curiosity of someone who always wants to understand how things work. From transport management to sales strategy, all the way to AI applied to work."
    },
    long: {
      it: [
        "Ho iniziato a lavorare durante l'università e non mi sono più fermato: dal casello autostradale alla grande distribuzione, dalla pianificazione dei trasporti alla guida di un ufficio commerciale. In Sogema sono passato da disponente al traffico a responsabile commerciale in due anni e mezzo; oggi pianifico spedizioni nazionali e internazionali e negozio con vettori su gomma, intermodale e marittimo.",
        "Sono proattivo, curioso e competitivo, in ufficio come nello sport. Fuori dal lavoro esploro l'intelligenza artificiale: progetto workflow creativi con Midjourney e studio come l'AI sta cambiando il modo di lavorare."
      ],
      en: [
        "I started working while still at university and never stopped: from a motorway toll booth to large-scale retail, from transport planning to leading a sales office. At Sogema I went from traffic coordinator to sales manager in two and a half years; today I plan domestic and international shipments and negotiate with road, intermodal and ocean carriers.",
        "I'm proactive, curious and competitive, at work as much as in sport. Outside work I explore artificial intelligence: I design creative workflows with Midjourney and study how AI is changing the way we work."
      ]
    }
  },

  numbers: [
    { value: 16, suffix: "+", it: "anni di esperienza lavorativa", en: "years of work experience" },
    { value: 8,  suffix: "+", it: "anni in trasporti e logistica", en: "years in transport & logistics" },
    { value: 3,  suffix: "",  it: "ruoli in crescita in Sogema",   en: "progressive roles at Sogema" },
    { value: 2,  suffix: "",  it: "lingue",                        en: "languages" }
  ],

  /* Dal più recente al più vecchio. current: true = ruolo attuale (pallino arancione, barra aperta).
     earlier: true = nel pannello sta sotto "Esperienze precedenti".
     start / end: date per la barra del tempo, "anno-mese" oppure solo "anno" (= gennaio).
     Il ruolo attuale non ha end: la barra arriva a oggi. seasonal: true = segmento tratteggiato. */
  career: [
    {
      current: true,
      role: { it: "Logistic Planner", en: "Logistic Planner" },
      company: "Gruppo Mauro Saviola Srl",
      date: { it: "Feb 2022 – oggi", en: "Feb 2022 – present" },
      start: "2022-02",
      points: {
        it: [
          "Pianifico ogni giorno le spedizioni degli ordini di vendita per l'Italia e l'estero, in coordinamento con il back office.",
          "Coordino e ottimizzo le tariffe dei tender marittimi.",
          "Negozio con i vettori su gomma e intermodale, gestisco i listini di riferimento e cerco nuovi partner di trasporto."
        ],
        en: [
          "I plan daily shipments of sales orders for Italy and abroad, working closely with the back office.",
          "I coordinate and optimise ocean freight tender rates.",
          "I negotiate with road and intermodal carriers, manage reference rate cards and scout new transport partners."
        ]
      }
    },
    {
      role: { it: "Responsabile commerciale", en: "Sales Manager" },
      company: "Sogema Group Srl",
      date: { it: "Gen 2021 – Gen 2022", en: "Jan 2021 – Jan 2022" },
      start: "2021-01", end: "2022-01",
      points: {
        it: [
          "Ho definito le strategie di acquisizione e fidelizzazione dei clienti coordinando il mio team.",
          "Ho gestito i rapporti con i fornitori di trasporto e i listini di riferimento, e curato la rendicontazione mensile dell'ufficio trasporti."
        ],
        en: [
          "I defined customer acquisition and retention strategies while leading my team.",
          "I managed relationships with transport suppliers and reference rate cards, and owned the monthly reporting of the transport office."
        ]
      }
    },
    {
      role: { it: "Commerciale", en: "Sales Representative" },
      company: "Sogema Group Srl",
      date: { it: "Mag 2020 – Gen 2021", en: "May 2020 – Jan 2021" },
      start: "2020-05", end: "2021-01",
      points: {
        it: ["Ho seguito la fidelizzazione dei clienti e le pratiche commerciali, sviluppato i rapporti con i fornitori e cercato nuovi clienti."],
        en: ["I handled customer retention and sales administration, developed supplier relationships and prospected new clients."]
      }
    },
    {
      role: { it: "Disponente al traffico", en: "Traffic Coordinator" },
      company: "Sogema Group Srl",
      date: { it: "Lug 2018 – Mag 2020", en: "Jul 2018 – May 2020" },
      start: "2018-07", end: "2020-05",
      points: {
        it: ["Ho coordinato la flotta e i tempi di guida e riposo degli autisti, programmato il traffico su bilico e gestito la compravendita dei viaggi."],
        en: ["I coordinated the fleet and drivers' driving and rest times, planned articulated-truck traffic and managed the buying and selling of loads."]
      }
    },
    {
      earlier: true,
      role: { it: "Impiegato commerciale", en: "Sales Clerk" },
      company: "Ditta individuale Bresciani Paolo",
      date: { it: "2016–2018", en: "2016–2018" },
      start: "2016", end: "2018",
      points: {
        it: ["Supporto commerciale con clienti e fornitori; costruzione di torce MIG raffreddate ad acqua."],
        en: ["Sales support with customers and suppliers; assembly of water-cooled MIG welding torches."]
      }
    },
    {
      earlier: true,
      role: { it: "Assistente alle vendite", en: "Sales Assistant" },
      company: "Supermercati Tosano",
      date: { it: "2013–2016", en: "2013–2016" },
      start: "2013", end: "2016",
      points: {
        it: ["Ordini e resi dei reparti, layout espositivo, cassa e chiusure."],
        en: ["Department orders and returns, product display layout, checkout and daily closing."]
      }
    },
    {
      earlier: true,
      seasonal: true,
      role: { it: "Esattore pedaggi stagionale", en: "Seasonal Toll Collector" },
      company: "Autostrade del Brennero SpA",
      date: { it: "2010–2012", en: "2010–2012" },
      start: "2010", end: "2012",
      points: {
        it: ["Lavoro estivo per mantenermi agli studi universitari."],
        en: ["Summer job to support myself through university."]
      }
    }
  ],

  education: [
    { title: { it: "Laurea in Economia e Marketing", en: "Degree in Economics and Marketing" }, school: "Università di Parma" },
    { title: { it: "Diploma di Geometra", en: "Surveying Technician Diploma" }, school: "ITG Carlo D'Arco" }
  ],

  skills: [
    {
      title: { it: "Professionali", en: "Professional" },
      items: {
        it: ["Pianificazione logistica", "Negoziazione con i fornitori", "Strategia commerciale", "Gestione e fidelizzazione clienti", "Coordinamento del team", "Reporting"],
        en: ["Logistics planning", "Supplier negotiation", "Sales strategy", "Customer management & retention", "Team coordination", "Reporting"]
      }
    },
    {
      title: { it: "Strumenti", en: "Tools" },
      items: {
        it: ["SAP", "Transporeon", "Microsoft Office"],
        en: ["SAP", "Transporeon", "Microsoft Office"]
      }
    },
    {
      title: { it: "Design", en: "Design" },
      items: {
        it: ["Adobe Photoshop", "Adobe Illustrator", "Affinity Studio"],
        en: ["Adobe Photoshop", "Adobe Illustrator", "Affinity Studio"]
      }
    },
    {
      title: { it: "AI", en: "AI" },
      items: {
        it: ["Claude", "Claude Code", "ChatGPT", "Midjourney (4 anni di esperienza)", "Higgsfield (video)"],
        en: ["Claude", "Claude Code", "ChatGPT", "Midjourney (4 years of experience)", "Higgsfield (video)"]
      }
    },
    {
      title: { it: "Lingue", en: "Languages" },
      items: {
        it: ["Italiano: madrelingua", "Inglese: B1–B2, in miglioramento"],
        en: ["Italiano: native", "English: B1–B2, improving"]
      }
    }
  ],

  now: {
    updatedLabel: { it: "Aggiornato", en: "Updated" },
    updated: { it: "novembre 2026", en: "November 2026" },
    items: [
      {
        title: { it: "Arte generativa", en: "Generative art" },
        text: {
          it: "Progetto workflow creativi con Midjourney, dall'idea alla serie finita.",
          en: "I design creative workflows with Midjourney, from idea to finished series."
        }
      },
      {
        title: { it: "AI applicata al lavoro", en: "AI at work" },
        text: {
          it: "Studio come l'intelligenza artificiale può rendere più efficaci analisi, decisioni e processi.",
          en: "I study how artificial intelligence can make analysis, decisions and processes more effective."
        }
      },
      {
        title: { it: "Questo sito", en: "This website" },
        text: {
          it: "L'ho costruito da zero con Claude Code, senza esperienza di programmazione.",
          en: "I built it from scratch with Claude Code, with no prior coding experience."
        }
      },
      {
        title: { it: "Inglese", en: "English" },
        text: {
          it: "Lo alleno ogni giorno per passare dal B1–B2 a un livello pienamente professionale.",
          en: "Training it every day to move from B1–B2 to a fully professional level."
        }
      }
    ]
  },

  cv: [
    { label: "IT", file: "cv-marco-bresciani-it.pdf" },
    { label: "EN", file: "cv-marco-bresciani-en.pdf" }
  ],

  contact: {
    /* L'email è spezzata e viene ricomposta solo nel browser, contro lo spam. */
    emailParts: ["m.bresciani.ai", "gmail.com"],
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/brescianimarco/" },
      { label: "GitHub", url: "https://github.com/MarcoBresciani-ai" }
    ]
  }
};
