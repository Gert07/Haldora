const today = "2026-05-08";

const users = [
  { id: "user-mari", name: "Mari Mägi", accent: "blue" },
  { id: "user-juri", name: "Jüri Tamm", accent: "green" },
  { id: "user-kadi", name: "Kadi Sepp", accent: "sand" },
];

const templates = [
  {
    id: "template-weekly",
    title: "Iganädalased ülesanded",
    description:
      "Kooli juhtkonna rutiinsed iganädalased tegevused, et info liiguks, tabelid oleksid ajakohased ja nädal saaks nähtavalt käima.",
    category: "Vastavalt vajadusele",
    currentVersion: "v3",
    lastSavedAt: "2026-05-06",
    versions: [
      { version: "v1", date: "2026-03-18", summary: "Mall loodud." },
      { version: "v2", date: "2026-04-15", summary: "Lisatud meili- ja menüüsammud." },
      { version: "v3", date: "2026-05-06", summary: "Täpsustatud töökoormuse kontrolli." },
    ],
    steps: [
      {
        id: "weekly-step-mail",
        title: "Vaata üle üldmeil ja suuna kirjad edasi",
        required: true,
        blocks: [
          {
            id: "block-weekly-mail-text",
            type: "paragraph",
            text: "Jälgi kooli üldmeili ja suuna olulised kirjad kiiresti õigetele inimestele.",
          },
          {
            id: "block-weekly-mail-list",
            type: "checklist",
            items: [
              { id: "check-weekly-mail-1", text: "Edasta hm.ee kirjad õppejuhile" },
              { id: "check-weekly-mail-2", text: "Edasta ARNO e-kirjad direktorile" },
              { id: "check-weekly-mail-3", text: "Märgi kiiret reageerimist vajavad teemad" },
            ],
          },
          {
            id: "block-weekly-mail-link",
            type: "link",
            label: "Haridus- ja Teadusministeeriumi leht",
            url: "https://www.hm.ee",
          },
        ],
      },
      {
        id: "weekly-step-workload",
        title: "Kontrolli töövõimetus- ja hoolduslehti",
        required: true,
        blocks: [
          {
            id: "block-weekly-workload-text",
            type: "paragraph",
            text: "Kontrolli igal esmaspäeval eesti.ee keskkonnast hooldus- ja haiguslehti ning märgista need töökoormuste tabelisse.",
          },
          {
            id: "block-weekly-workload-list",
            type: "checklist",
            items: [
              { id: "check-weekly-workload-1", text: "Vaata üle uued haiguslehed" },
              { id: "check-weekly-workload-2", text: "Vaata üle hoolduslehed" },
              { id: "check-weekly-workload-3", text: "Lisa uuendused tööaja tabelisse" },
            ],
          },
        ],
      },
      {
        id: "weekly-step-leave",
        title: "Töötle puhkused ja õppepuhkused",
        required: true,
        blocks: [
          {
            id: "block-weekly-leave-text",
            type: "paragraph",
            text: "Lisa õppepuhkused ja puhkuseavaldused tööajatabelisse ning koosta käskkiri direktorile ülevaatamiseks ja allkirjastamiseks.",
          },
        ],
      },
      {
        id: "weekly-step-menu",
        title: "Uuenda nädala menüü ja koduleht",
        required: false,
        blocks: [
          {
            id: "block-weekly-menu-list",
            type: "checklist",
            items: [
              { id: "check-weekly-menu-1", text: "Uuenda stendil nädalamenüü" },
              { id: "check-weekly-menu-2", text: "Uuenda kodulehel nädalamenüü" },
              { id: "check-weekly-menu-3", text: "Teavita õppejuhti teisipäevaste infominutite teemadest" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "template-monthly",
    title: "Igakuised ülesanded",
    description:
      "Kuu jooksul korduvad haldustegevused EHISest raamatupidamise ja dokumendihalduseni.",
    category: "Igakuine",
    currentVersion: "v4",
    lastSavedAt: "2026-05-02",
    versions: [
      { version: "v1", date: "2026-02-02", summary: "Mall loodud." },
      { version: "v2", date: "2026-03-02", summary: "Lisatud tasustamise arvestus." },
      { version: "v3", date: "2026-04-02", summary: "Lisatud arvete haldus." },
      { version: "v4", date: "2026-05-02", summary: "Lisatud lahkunud töötaja kontroll." },
    ],
    steps: [
      {
        id: "monthly-step-ehis",
        title: "Kontrolli ja kinnita EHIS andmed",
        required: true,
        blocks: [
          {
            id: "block-monthly-ehis-text",
            type: "paragraph",
            text: "Kontrolli EHIS andmed üle ja kinnita hiljemalt 5. kuupäevaks.",
          },
        ],
      },
      {
        id: "monthly-step-tables",
        title: "Saada tabelid ja käskkirjad raamatupidamisse",
        required: true,
        blocks: [
          {
            id: "block-monthly-tables-list",
            type: "checklist",
            items: [
              { id: "check-monthly-tables-1", text: "Saada töökoormuste tabelid valda" },
              { id: "check-monthly-tables-2", text: "Saada söökla tabel raamatupidamisse" },
              { id: "check-monthly-tables-3", text: "Edasta 3-1 käskkirjad jooksvalt" },
            ],
          },
        ],
      },
      {
        id: "monthly-step-pay",
        title: "Koosta tasustamise arvestus",
        required: true,
        blocks: [
          {
            id: "block-monthly-pay-text",
            type: "paragraph",
            text: "Loe Studiumist kokku PPR-i ja ringitundide mahud perioodil 26.–25. kuupäev ning arvuta välja riikliku õpiabi tunnid.",
          },
        ],
      },
      {
        id: "monthly-step-docs",
        title: "Hoia dokumendihaldus jooksvalt korras",
        required: false,
        blocks: [
          {
            id: "block-monthly-docs-list",
            type: "checklist",
            items: [
              { id: "check-monthly-docs-1", text: "Sisesta Amphorasse käskkirjad" },
              { id: "check-monthly-docs-2", text: "Sisesta Amphorasse õppepuhkused" },
              { id: "check-monthly-docs-3", text: "Vaata üle seotud lisadokumendid" },
            ],
          },
        ],
      },
      {
        id: "monthly-step-invoices",
        title: "Sisesta ostuarved Amphorasse",
        required: true,
        blocks: [
          {
            id: "block-monthly-invoices-text",
            type: "paragraph",
            text: "Sisesta jooksvad ostuarved Amphora süsteemi ning kontrolli, et viited oleksid korrektsed.",
          },
        ],
      },
      {
        id: "monthly-step-leavers",
        title: "Kontrolli lahkunud töötajate ligipääsud",
        required: true,
        blocks: [
          {
            id: "block-monthly-leavers-list",
            type: "checklist",
            items: [
              { id: "check-monthly-leavers-1", text: "Teavita kaughaldust e-maili sulgemiseks" },
              { id: "check-monthly-leavers-2", text: "Kustuta info kooli lehelt" },
              { id: "check-monthly-leavers-3", text: "Uuenda kooli intranetti" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "template-substitute",
    title: "Asenduses",
    description:
      "Samm-sammuline protsess õpetaja puudumise katmiseks, et asendused jõuaksid õigesse tabelisse ja Studiumisse.",
    category: "Personal",
    currentVersion: "v2",
    lastSavedAt: "2026-05-01",
    versions: [
      { version: "v1", date: "2026-04-01", summary: "Mall loodud." },
      { version: "v2", date: "2026-05-01", summary: "Lisatud Studiumi detailid ja märkused." },
    ],
    steps: [
      {
        id: "substitute-step-table",
        title: "Kontrolli asenduste tabelit",
        required: true,
        blocks: [
          {
            id: "block-substitute-table-text",
            type: "paragraph",
            text: "Kui rida on punane, tähendab see, et asendust on vaja leida.",
          },
        ],
      },
      {
        id: "substitute-step-free",
        title: "Leia vaba asendaja",
        required: true,
        blocks: [
          {
            id: "block-substitute-free-list",
            type: "checklist",
            items: [
              { id: "check-substitute-free-1", text: "Ava tunniplaan või Summary Timetable" },
              { id: "check-substitute-free-2", text: "Vaata, kellel on sel ajal vaba tund" },
              { id: "check-substitute-free-3", text: "Märgi sobivad kandidaadid üles" },
            ],
          },
        ],
      },
      {
        id: "substitute-step-calendar",
        title: "Lisa või uuenda puudumine Studiumis",
        required: true,
        blocks: [
          {
            id: "block-substitute-calendar-text",
            type: "paragraph",
            text: "Mine Studiumis jaotisse Suhtlus -> Kalender. Lisa puudumine või ava olemasolev asendus ja muuda seda.",
          },
          {
            id: "block-substitute-calendar-list",
            type: "checklist",
            items: [
              { id: "check-substitute-calendar-1", text: "Vali puuduv nimi, klass, asendaja ja kuupäev" },
              { id: "check-substitute-calendar-2", text: "Lisa õpetajatele vajalik lisainfo" },
              { id: "check-substitute-calendar-3", text: "Kirjuta kommentaaridesse, mitmenda tunniga on tegemist" },
            ],
          },
        ],
      },
      {
        id: "substitute-step-long",
        title: "Sisesta pikemad puudumised päevade kaupa",
        required: false,
        blocks: [
          {
            id: "block-substitute-long-text",
            type: "paragraph",
            text: "Pikemate puudumiste puhul lisa read päevade kaupa, et muudatusi oleks Studiumis lihtsam hallata.",
          },
        ],
      },
      {
        id: "substitute-step-tag",
        title: "Tagi asendajad tabelis",
        required: true,
        blocks: [
          {
            id: "block-substitute-tag-text",
            type: "paragraph",
            text: "Märgi leitud asendajad asenduste tabelis, et ülevaade jääks kõigile nähtav.",
          },
        ],
      },
    ],
  },
];

const cloneBlocks = (blocks) =>
  blocks.map((block) => {
    if (block.type === "checklist") {
      return {
        ...block,
        items: block.items.map((item) => ({
          ...item,
          checked: false,
        })),
      };
    }

    return { ...block };
  });

const cloneSteps = (steps, overrides = {}) =>
  steps.map((step) => ({
    id: `${step.id}-${overrides.suffix ?? "instance"}`,
    templateStepId: step.id,
    title: step.title,
    required: step.required,
    done: false,
    comments: [],
    blocks: cloneBlocks(step.blocks),
  }));

const initialInstances = [
  {
    id: "instance-ehis-may",
    templateId: "template-monthly",
    templateName: "Igakuised ülesanded",
    templateVersion: "v4",
    name: "Mai 2026 EHIS",
    assignedUserId: "user-mari",
    startedAt: "2026-05-02",
    dueDate: "2026-05-25",
    finishedAt: null,
    steps: (() => {
      const steps = cloneSteps(
        templates.find((template) => template.id === "template-monthly").steps,
        { suffix: "ehis-may" },
      );

      steps[0].done = true;
      steps[1].blocks[0].items[0].checked = true;
      steps[1].blocks[0].items[1].checked = true;
      steps[1].comments = [
        {
          id: "comment-ehis-1",
          userId: "user-kadi",
          timestamp: "2026-05-03T09:20:00",
          text: "@Mari Mägi vallale saadetavad tabelid on mustandina valmis.",
        },
      ];
      steps[2].comments = [
        {
          id: "comment-ehis-2",
          userId: "user-juri",
          timestamp: "2026-05-04T13:35:00",
          text: "PPR tunnid on Studiumist kokku loetud, jään ringitundide kontrolli ootama.",
        },
      ];

      return steps;
    })(),
  },
  {
    id: "instance-weekly-19",
    templateId: "template-weekly",
    templateName: "Iganädalased ülesanded",
    templateVersion: "v3",
    name: "Nädal 19 juhtkonna rutiin",
    assignedUserId: "user-juri",
    startedAt: "2026-05-05",
    dueDate: "2026-05-12",
    finishedAt: null,
    steps: (() => {
      const steps = cloneSteps(
        templates.find((template) => template.id === "template-weekly").steps,
        { suffix: "weekly-19" },
      );

      steps[0].done = true;
      steps[0].blocks[1].items[0].checked = true;
      steps[0].blocks[1].items[1].checked = true;
      steps[3].comments = [
        {
          id: "comment-weekly-1",
          userId: "user-mari",
          timestamp: "2026-05-06T08:45:00",
          text: "Kodulehe menüü ootab veel köögi kinnitust.",
        },
      ];

      return steps;
    })(),
  },
  {
    id: "instance-substitute-kask",
    templateId: "template-substitute",
    templateName: "Asenduses",
    templateVersion: "v2",
    name: "Õpetaja Kase puudumise asendus",
    assignedUserId: "user-kadi",
    startedAt: "2026-05-07",
    dueDate: "2026-05-08",
    finishedAt: null,
    steps: (() => {
      const steps = cloneSteps(
        templates.find((template) => template.id === "template-substitute").steps,
        { suffix: "substitute-kask" },
      );

      steps[0].done = true;
      steps[1].blocks[0].items[0].checked = true;
      steps[1].comments = [
        {
          id: "comment-substitute-1",
          userId: "user-juri",
          timestamp: "2026-05-07T11:15:00",
          text: "@Kadi Sepp 4. tunni jaoks sobib Mariann Vaher, tal on vaba aken.",
        },
        {
          id: "comment-substitute-2",
          userId: "user-mari",
          timestamp: "2026-05-07T11:40:00",
          text: "Lisainfo õpetajatele on tabelis olemas, saab kopeerida Studiumisse.",
        },
      ];

      return steps;
    })(),
  },
  {
    id: "instance-monthly-april-close",
    templateId: "template-monthly",
    templateName: "Igakuised ülesanded",
    templateVersion: "v4",
    name: "Aprilli lõpu tabelid",
    assignedUserId: "user-mari",
    startedAt: "2026-05-01",
    dueDate: "2026-05-25",
    finishedAt: null,
    steps: (() => {
      const steps = cloneSteps(
        templates.find((template) => template.id === "template-monthly").steps,
        { suffix: "monthly-april-close" },
      );

      steps[0].done = true;
      steps[1].done = true;
      steps[1].blocks[0].items = steps[1].blocks[0].items.map((item) => ({
        ...item,
        checked: true,
      }));
      steps[4].comments = [
        {
          id: "comment-monthly-1",
          userId: "user-kadi",
          timestamp: "2026-05-02T15:10:00",
          text: "Kõik ostuarved on olemas, ainult ühe viite kontrollin veel üle.",
        },
      ];

      return steps;
    })(),
  },
];

const archivedInstances = [
  {
    id: "instance-ehis-april",
    templateId: "template-monthly",
    templateName: "Igakuised ülesanded",
    templateVersion: "v3",
    name: "Aprill 2026 EHIS",
    assignedUserId: "user-mari",
    startedAt: "2026-04-02",
    dueDate: "2026-04-25",
    finishedAt: "2026-04-24",
    steps: (() => {
      const steps = cloneSteps(
        templates.find((template) => template.id === "template-monthly").steps,
        { suffix: "ehis-april" },
      );

      steps.forEach((step) => {
        step.done = true;
        step.blocks = step.blocks.map((block) => {
          if (block.type === "checklist") {
            return {
              ...block,
              items: block.items.map((item) => ({ ...item, checked: true })),
            };
          }

          return block;
        });
      });

      steps[2].comments = [
        {
          id: "comment-archive-1",
          userId: "user-juri",
          timestamp: "2026-04-18T14:05:00",
          text: "Tasustamise arvestus kontrollitud ja saadetud edasi.",
        },
        {
          id: "comment-archive-2",
          userId: "user-kadi",
          timestamp: "2026-04-23T10:25:00",
          text: "@Mari Mägi lahkunud töötajate e-mailid on kaughaldusele edastatud.",
        },
      ];

      return steps;
    })(),
  },
];

export const initialData = {
  today,
  account: {
    id: "school-pohjataht",
    name: "Kännu kool",
    helperText:
      "Kõik mallid, kommentaarid ja tööprotsessid kuuluvad ainult selle kooli kontole. Teistel koolidel puudub nähtavus.",
  },
  users,
  templates,
  activeInstances: initialInstances,
  archivedInstances,
};
