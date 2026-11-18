// Single source of truth for every word, number and link on the site.
// Sources: Resume_EY.pdf, GCP_Data_Analyst_no_photo.pdf, LinkedIn Profile.pdf, and the owner's brief.
// Rule: a link that is `null` is not rendered anywhere. Never invent a URL.

export const profile = {
  name: "Firas Djebbi",
  arabic: "فراس الدجبي",
  role: "Enterprise data engineer",
  location: "Riyadh, Saudi Arabia",
  timeZone: "Asia/Riyadh",
  siteTitle: "Firas Djebbi: enterprise data engineer",
  siteDescription:
    "Enterprise data engineer in Riyadh. I move legacy data platforms to BigQuery. Google Cloud Professional Data Engineer, SnowPro Core and SnowPro Advanced: Data Engineer.",
  links: {
    email: "djebbifiras89@gmail.com",
    linkedin: "https://www.linkedin.com/in/djebbi-firas" as string | null,
    github: null as string | null, // not supplied yet
    cv: "/Firas-Djebbi-CV.pdf" as string | null,
  },
};

export const ui = {
  skip: "Skip to content",
  emailMe: "Email me",
  copyEmail: "Copy email",
  emailCopied: "Email copied",
  downloadCv: "Download CV (PDF)",
  linkedin: "LinkedIn",
  github: "GitHub",
  openCase: "Open case study",
  closeCase: "Close case study",
  verify: "Verify",
  newTab: "(opens in new tab)",
  dagHint: "Hover or focus a system to trace its lineage.",
  dagTitle: "Data platform architecture, from sources to BI",
  pauseMotion: "Pause stack animation",
  playMotion: "Play stack animation",
  openPalette: "Open command palette",
  paletteHint: "Jump to a section, copy my email, open a case study",
  paletteGroupSections: "Sections",
  paletteGroupActions: "Actions",
  consoleLabel: "Run a query",
  consoleRun: "Run",
  consolePlaceholder: "help",
  consoleTitle: "Query my data",
};

export const hero = {
  lines: ["Legacy data", "platforms, rebuilt", "on Google Cloud."],
  lede: "I'm Firas, an enterprise data engineer in Riyadh. I trace the lineage of legacy BI and move it to BigQuery for a national utility.",
};

export const certs = [
  { name: "Professional Data Engineer", issuer: "Google Cloud", short: "Google Cloud Professional Data Engineer", url: null as string | null },
  { name: "SnowPro Core", issuer: "Snowflake", short: "SnowPro Core", url: null as string | null },
  { name: "SnowPro Advanced: Data Engineer", issuer: "Snowflake", short: "SnowPro Advanced: Data Engineer", url: null as string | null },
];

// ---- Architecture (NWC). Source-to-ingestion routing is pending the owner's confirmation. ----
export type GraphNode = { id: string; label: string; sub?: string; col: number; t: number };
export const graph: { nodes: GraphNode[]; edges: [string, string][]; stageNames: string[] } = {
  stageNames: ["Sources", "Ingestion", "Warehouse", "Transform", "Semantic layer", "BI"],
  nodes: [
    { id: "ora", label: "Oracle", col: 0, t: 0 },
    { id: "pg", label: "PostgreSQL", col: 0, t: 0.5 },
    { id: "ssis", label: "SQL Server / SSIS", col: 0, t: 1 },
    { id: "ds", label: "Datastream", sub: "CDC", col: 1, t: 0.25 },
    { id: "df", label: "Cloud Data Fusion", col: 1, t: 0.85 },
    { id: "bq", label: "BigQuery", sub: "bronze, silver", col: 2, t: 0.5 },
    { id: "dfm", label: "Dataform", col: 3, t: 0.5 },
    { id: "at", label: "AtScale", sub: "semantic layer", col: 4, t: 0.5 },
    { id: "lk", label: "Looker", col: 5, t: 0.2 },
    { id: "pbi", label: "Power BI", col: 5, t: 0.8 },
  ],
  edges: [
    ["ora", "ds"], ["pg", "ds"], ["ssis", "df"], ["ds", "bq"], ["df", "bq"],
    ["bq", "dfm"], ["dfm", "at"], ["at", "lk"], ["at", "pbi"],
  ],
};

// ---- Bento cards ----
export const cardA = {
  title: "Moving a legacy BI estate to BigQuery",
  body: [
    "A multi-year enterprise data transformation at National Water Company, through Devoteam. I trace the SSIS lineage behind legacy business reports and write source-to-target mappings between SQL Server and BigQuery types.",
    "I also land legacy XML and Oracle sources in BigQuery through SQL staging, reconciling row counts and values against the source.",
  ],
  mini: ["Oracle, XML", "SQL staging", "BigQuery", "Looker"],
};

export const cardB = {
  title: "Autobiz: faster production pipelines",
  metric: { value: 40, suffix: "%", label: "higher processing throughput" },
  body: "Python, SQL and PySpark on GCP. 15+ source systems unified under standard schemas, which raised acquisition speed by 30%. Runtime cut by 20% with no loss of accuracy.",
  stages: ["Extract", "Clean", "Transform", "Load", "Validate"],
  stagesNote: "Pipeline stages, simplified",
};

export const cardC = { title: "Certifications" };

export const stack = [
  { name: "BigQuery", layer: "warehouse" }, { name: "Dataflow", layer: "process" },
  { name: "Datastream", layer: "ingest" }, { name: "Dataform", layer: "transform" },
  { name: "Cloud Data Fusion", layer: "ingest" }, { name: "Snowflake", layer: "warehouse" },
  { name: "Airflow", layer: "orchestrate" }, { name: "PySpark", layer: "process" },
  { name: "Python", layer: "language" }, { name: "SQL", layer: "language" },
  { name: "Talend DI", layer: "ingest" }, { name: "SSIS", layer: "legacy" },
  { name: "SQL Server", layer: "legacy" }, { name: "Looker", layer: "serve" },
  { name: "Power BI", layer: "serve" }, { name: "Docker", layer: "delivery" },
];
export const cardD = { title: "Stack", sub: "By pipeline layer" };

export const experience = [
  {
    id: "devoteam", role: "Data engineer", org: "Devoteam", place: "Riyadh, Saudi Arabia",
    start: "Feb 2026", end: "Present",
    points: [
      "On-site consultant for National Water Company, on a large-scale digital transformation programme.",
      "BigQuery bronze and silver layers, dimensional models and reporting marts feeding Looker and Looker Studio.",
      "Cloud Dataflow pipelines for “AI Employee Helper”, an internal AI initiative.",
    ],
  },
  {
    id: "autobiz", role: "Big data developer", org: "Autobiz", place: "Tunis, Tunisia",
    start: "Jun 2023", end: "Jan 2026",
    points: [
      "Production pipelines in Python, SQL and PySpark on GCP: 40% higher processing throughput.",
      "15+ source systems integrated into one analytics layer: 30% faster acquisition.",
      "Data quality controls: integrity rules, reconciliation and failure alerting.",
    ],
  },
  {
    id: "gomycode-ds", role: "Junior data scientist", org: "Gomycode", place: "Tunis, Tunisia",
    start: "Jan 2023", end: "Jun 2023",
    points: ["ETL pipelines for high-volume datasets loaded into data warehouses; automated recurring analysis with Python and SQL."],
  },
  {
    id: "gomycode-i", role: "Data science instructor", org: "Gomycode", place: "Tunis, Tunisia",
    start: "Jun 2022", end: "Dec 2022",
    points: ["20+ workshops on SQL, Python, data modelling and analysis, with 90% participant satisfaction, in French and English."],
  },
  {
    id: "iset", role: "BSc, Mechatronics, Robotics and Automation Engineering", org: "ISET Radès", place: "Tunisia",
    start: "Sep 2017", end: "Jun 2021", points: [],
  },
];
export const cardE = { title: "Experience" };

export const riyadh = {
  title: "Riyadh",
  languages: ["Arabic", "French", "English"],
  from: "Tunis",
  // Real coordinates (lon, lat) used only to place the two dots.
  riyadh: [46.72, 24.71] as [number, number],
  tunis: [10.18, 36.81] as [number, number],
};

// ---- Method (pinned scroll story) ----
export const method = {
  title: "How I move a legacy platform to the cloud",
  steps: [
    { title: "Map the legacy lineage", body: "Read the stored procedures behind each legacy report and trace the SSIS packages that feed every table. The output is a source-to-target mapping between SQL Server and BigQuery types.", systems: ["Stored procedures", "SSIS", "SQL Server"] },
    { title: "Land the sources with CDC", body: "Datastream change data capture and Cloud Data Fusion bring Oracle, PostgreSQL and SQL Server data into BigQuery.", systems: ["Oracle", "PostgreSQL", "Datastream", "Cloud Data Fusion"] },
    { title: "Model and transform in BigQuery", body: "Raw tables land in bronze, cleaned tables in silver, and Dataform manages the transformations. Row counts and values are reconciled against the source.", systems: ["BigQuery bronze", "BigQuery silver", "Dataform"] },
    { title: "Serve through a semantic layer", body: "An AtScale semantic layer sits between BigQuery and the BI tools.", systems: ["AtScale", "Looker", "Power BI"] },
  ],
};

export const contact = {
  title: "Moving a data platform, or hiring for one?",
  body: "Send me a note.",
};

// ---- Case studies ----
export type CaseId = "nwc" | "autobiz";
export const cases: Record<CaseId, {
  id: CaseId; eyebrow: string; title: string; summary: string;
  sections: { heading: string; points: string[] }[];
  facts?: { value: string; label: string }[];
}> = {
  nwc: {
    id: "nwc", eyebrow: "Devoteam for National Water Company, 2026 to now",
    title: "Moving a legacy BI estate to BigQuery",
    summary: "A multi-year enterprise data transformation. I work on-site as the data engineer, between the legacy SQL Server estate and the new BigQuery platform.",
    sections: [
      { heading: "What I do", points: [
        "Analyse the stored procedures behind legacy business reports and trace the SSIS lineage feeding each table.",
        "Write source-to-target mappings between SQL Server and BigQuery data types.",
        "Migrate legacy XML and Oracle sources into BigQuery through SQL staging layers, parsing semi-structured payloads.",
        "Reconcile row counts and values against the source before anything is served.",
      ]},
      { heading: "What I build", points: [
        "BigQuery bronze and silver layers for extraction, transformation and serving of operational data.",
        "Dimensional models and reporting marts feeding Looker and Looker Studio dashboards.",
        "Cloud Dataflow ETL/ELT for “AI Employee Helper”, an internal AI initiative.",
      ]},
      { heading: "How I work", points: [
        "Requirements sessions with client teams, and root-cause analysis when data issues surface.",
      ]},
    ],
  },
  autobiz: {
    id: "autobiz", eyebrow: "Autobiz, Tunis, 2023 to 2026",
    title: "Faster production pipelines",
    summary: "Production pipelines that extract, clean and transform automotive market data for analytics.",
    facts: [
      { value: "40%", label: "higher processing throughput" },
      { value: "30%", label: "faster data acquisition" },
      { value: "15+", label: "source systems unified" },
      { value: "20%", label: "less runtime, no loss of accuracy" },
    ],
    sections: [
      { heading: "What I built", points: [
        "Pipelines in Python, SQL and PySpark on GCP.",
        "A unified analytics layer over 15+ heterogeneous sources, with standardised schemas.",
        "Data quality controls: integrity rules, reconciliation and failure alerting, so anomalies surface before they reach reports.",
      ]},
      { heading: "How it shipped", points: [
        "Containerised with Docker and deployed through Git and GitHub CI/CD.",
        "Optimised SQL and Python processing logic.",
      ]},
    ],
  },
};

// ---- Query console data ----
export const consoleTables: Record<string, Record<string, string>[]> = {
  certifications: certs.map((c) => ({ name: c.name, issuer: c.issuer })),
  experience: experience.filter((e) => e.id !== "iset").map((e) => ({ role: e.role, org: e.org, start: e.start, end: e.end })),
  stack: stack.map((s) => ({ tool: s.name, layer: s.layer })),
  contact: [
    { channel: "email", value: profile.links.email },
    ...(profile.links.linkedin ? [{ channel: "linkedin", value: profile.links.linkedin.replace("https://www.", "") }] : []),
    ...(profile.links.github ? [{ channel: "github", value: profile.links.github.replace("https://", "") }] : []),
  ],
};
export const consoleSuggestions = [
  "SELECT * FROM certifications;",
  "SELECT role, org, start FROM experience;",
  "SELECT tool FROM stack WHERE layer = 'ingest';",
  "SELECT * FROM contact;",
  "help",
];

export const nav = [
  { id: "work", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "method", label: "Method" },
  { id: "contact", label: "Contact" },
] as const;
