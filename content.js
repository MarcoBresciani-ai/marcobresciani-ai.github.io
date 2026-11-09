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
      en: "I plan, negotiate and experiment. From logistics to AI, with the same competitive drive."
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
      en: "Logistics planner with a degree in Economics and Marketing and a habit of wanting to know how things really work. From moving freight to sales strategy, and now AI applied to work."
    },
    /* Riga personale sotto la bio breve, nel riquadro */
    personal: {
      it: "Sportivo da sempre, oltre 22.000 minuti di musica all'anno su Spotify.",
      en: "Into sport since I was a kid, over 22,000 minutes of music a year on Spotify."
    },
    long: {
      it: [
        "Ho iniziato a lavorare durante l'università e non mi sono più fermato: dal casello autostradale alla grande distribuzione, dalla pianificazione dei trasporti alla guida di un ufficio commerciale. In due anni e mezzo sono passato dal coordinamento dei viaggi alla responsabilità commerciale; oggi pianifico spedizioni verso l'Italia e il resto del mondo e negozio con vettori su gomma e intermodale.",
        "Sono proattivo, curioso e mi metto in gioco, nel lavoro come nella vita. Sono sportivo da quando ero bambino e ascolto moltissima musica: oltre 22.000 minuti in un anno su Spotify, con l'idea di arrivare prima o poi a farla. Fuori dal lavoro esploro anche l'intelligenza artificiale: progetto workflow creativi con Midjourney e studio come l'AI sta cambiando il modo di lavorare."
      ],
      en: [
        "I started working while I was still at university and haven't stopped since: from a motorway toll booth to supermarket retail, from planning transport to running a sales office. In two and a half years I went from planning loads to heading up sales; today I plan shipments across Italy and worldwide and negotiate with road and intermodal carriers.",
        "I'm proactive and curious, and I like to push myself, at work and in life. I've played sport since I was a kid and I listen to an enormous amount of music (over 22,000 minutes a year on Spotify); one day I'd like to make some of my own. Outside work I'm exploring AI: I design creative workflows in Midjourney and study how AI is changing the way we work."
      ]
    }
  },

  numbers: [
    { value: 16, suffix: "+", it: "anni di esperienza lavorativa", en: "years of work experience" },
    { value: 8,  suffix: "+", it: "anni in trasporti e logistica", en: "years in transport and logistics" },
    { value: 5,  suffix: "",  it: "settori attraversati, dalla grande distribuzione all'industria", en: "sectors, from retail to manufacturing" },
    { value: 20, suffix: "",  it: "rotte extra UE gestite nei tender marittimi", en: "non-EU lanes run through ocean freight tenders" }
  ],

  /* Dal più recente al più vecchio. current: true = ruolo attuale (pallino arancione, barra aperta).
     earlier: true = nel pannello sta sotto "Esperienze precedenti".
     start / end: date per la barra del tempo, "anno-mese" oppure solo "anno" (= gennaio).
     Il ruolo attuale non ha end: la barra arriva a oggi. seasonal: true = segmento tratteggiato.
     short: nomi abbreviati per la barra del tempo su desktop, dal più lungo al più corto;
     si usa il primo che entra nel segmento (prima si prova il nome intero). */
  career: [
    {
      current: true,
      role: { it: "Logistic Planner", en: "Logistics Planner" },
      short: { it: ["Log. Planner"], en: ["Log. Planner"] },
      company: "Gruppo Mauro Saviola Srl",
      date: { it: "Feb 2022 – oggi", en: "Feb 2022 – present" },
      start: "2022-02",
      points: {
        it: [
          "Pianifico ogni giorno le spedizioni di pannelli in legno riciclato per l'industria del mobile, verso l'Italia e il resto del mondo, in coordinamento con il back office.",
          "Negozio con i vettori su gomma e intermodale, gestisco i listini di riferimento e cerco nuovi partner di trasporto.",
          "Ho gestito i tender marittimi su circa 20 rotte extra UE: raccoglievo le offerte di circa sei operatori, ne valutavo con il back office la qualità del servizio e assegnavo le rotte in base al rapporto tra servizio e costo per container.",
          "Lavoro con SAP per i processi interni e con Transporeon per aste, tender e assegnazione dei viaggi."
        ],
        en: [
          "I plan daily outbound shipments of recycled wood panels for the furniture industry, to customers across Italy and worldwide, working closely with the back-office team.",
          "I negotiate rates with road and intermodal carriers, maintain benchmark rate cards and source new transport partners.",
          "I ran ocean freight tenders on around 20 non-EU lanes: I gathered bids from roughly six forwarders, assessed their service levels with the back office and awarded each lane on the balance between service and cost per container.",
          "I use SAP for internal processes and Transporeon for spot auctions, tenders and load allocation."
        ]
      }
    },
    {
      role: { it: "Responsabile commerciale", en: "Sales Manager" },
      short: { it: ["Resp. commerciale", "Resp. comm.", "Resp."], en: ["Sales Mgr", "Mgr"] },
      company: "Sogema Group Srl",
      date: { it: "Gen 2021 – Gen 2022", en: "Jan 2021 – Jan 2022" },
      start: "2021-01", end: "2022-01",
      points: {
        it: [
          "Ho definito le strategie di acquisizione e fidelizzazione dei clienti coordinando il team, ufficio traffico compreso.",
          "Seguivo un portafoglio clienti di settori diversi, per merci non deperibili e non pericolose, e ho acquisito nuovi clienti.",
          "Ogni mese rendicontavo l'attività dell'ufficio trasporti: viaggi per cliente, margini dell'agenzia, costi di mezzi propri e autisti, gestione del parco mezzi."
        ],
        en: [
          "I set the customer acquisition and retention strategy and led the team, traffic office included.",
          "I managed a multi-sector client portfolio for non-perishable, non-hazardous freight and won new accounts.",
          "Every month I produced the transport office's reporting: trips per client, brokerage margins, own-fleet and driver costs, and fleet management."
        ]
      }
    },
    {
      role: { it: "Commerciale", en: "Sales Representative" },
      short: { it: ["Comm.", "Com."], en: ["Sales Rep.", "Rep."] },
      company: "Sogema Group Srl",
      date: { it: "Mag 2020 – Gen 2021", en: "May 2020 – Jan 2021" },
      start: "2020-05", end: "2021-01",
      points: {
        it: ["Ho seguito la gestione e la fidelizzazione dei clienti, le loro richieste e le pratiche commerciali; ho sviluppato i rapporti con i fornitori di trasporto e cercato nuovi clienti."],
        en: ["I managed and retained client accounts, handled customer requests and sales administration, built relationships with transport suppliers and prospected for new business."]
      }
    },
    {
      role: { it: "Disponente al traffico", en: "Transport Planner" },
      short: { it: ["Disponente", "Disp."], en: ["Transp. Planner", "Planner"] },
      company: "Sogema Group Srl",
      date: { it: "Lug 2018 – Mag 2020", en: "Jul 2018 – May 2020" },
      start: "2018-07", end: "2020-05",
      points: {
        it: [
          "Gestivo l'attività di agenzia: acquistavo viaggi da vettori terzi e li rivendevo ai clienti, pianificando i trasporti in base alle vendite e in coordinamento con la flotta interna.",
          "Programmavo il traffico su bilico nel rispetto dei tempi di guida e riposo degli autisti."
        ],
        en: [
          "I ran the freight brokerage desk: I bought capacity from third-party hauliers and sold it on to clients, planning transport around sales and in coordination with the in-house fleet.",
          "I scheduled articulated-truck traffic in compliance with EU drivers' hours rules."
        ]
      }
    },
    {
      earlier: true,
      role: { it: "Impiegato commerciale", en: "Sales Administrator" },
      company: "Ditta individuale Bresciani Paolo",
      date: { it: "2016–2018", en: "2016–2018" },
      start: "2016", end: "2018",
      points: {
        it: ["Supporto commerciale con clienti e fornitori; costruzione di torce MIG raffreddate ad acqua."],
        en: ["I supported sales with customers and suppliers and assembled water-cooled MIG welding torches."]
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
        en: ["I handled department orders and returns, product displays, till operations and end-of-day cash-up."]
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
        en: ["Summer work to fund my university studies."]
      }
    }
  ],

  education: [
    { title: { it: "Laurea in Economia e Marketing", en: "Degree in Economics and Marketing" }, school: "Università di Parma" },
    { title: { it: "Diploma di Geometra", en: "Technical high school diploma in Surveying" }, school: "ITG Carlo D'Arco" }
  ],

  /* tile: true = il gruppo compare anche nel riquadro, non solo nel pannello */
  skills: [
    {
      tile: true,
      title: { it: "Professionali", en: "Professional" },
      items: {
        it: ["Pianificazione logistica", "Negoziazione con i fornitori", "Strategia commerciale", "Gestione e fidelizzazione clienti", "Coordinamento del team", "Reporting"],
        en: ["Logistics planning", "Carrier and supplier negotiation", "Sales strategy", "Account management & retention", "Team leadership", "Reporting"]
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
      tile: true,
      title: { it: "AI", en: "AI" },
      items: {
        it: ["Claude", "Claude Code", "ChatGPT", "Midjourney (4 anni di esperienza)", "Higgsfield (video)"],
        en: ["Claude", "Claude Code", "ChatGPT", "Midjourney (4 years)", "Higgsfield (video)"]
      }
    },
    {
      title: { it: "Lingue", en: "Languages" },
      items: {
        it: ["Italiano: madrelingua", "Inglese: B1–B2, in miglioramento"],
        en: ["Italian: native", "English: intermediate (B1–B2)"]
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
          en: "I design creative workflows in Midjourney, from first concept to finished series."
        }
      },
      {
        title: { it: "AI applicata al lavoro", en: "AI at work" },
        text: {
          it: "Studio come l'intelligenza artificiale può rendere più efficaci analisi, decisioni e processi.",
          en: "I'm exploring how AI can make analysis, decisions and processes more effective."
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
          en: "I practise every day to take my English from intermediate to fully professional."
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
