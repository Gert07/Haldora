import React, { useEffect, useRef, useState } from "react";
import { initialData } from "./data.js";

const blockOptions = [
  { type: "paragraph", label: "Lõik" },
  { type: "checklist", label: "Kontrollnimekiri" },
  { type: "link", label: "Link" },
  { type: "image", label: "Pilt" },
];

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value) {
  if (!value) {
    return "Kuupäev puudub";
  }

  return new Intl.DateTimeFormat("et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("et-EE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function cloneTemplateBlocks(blocks) {
  return blocks.map((block) => {
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
}

function buildInstanceSteps(templateSteps) {
  return templateSteps.map((step) => ({
    id: makeId("instance-step"),
    templateStepId: step.id,
    title: step.title,
    required: step.required,
    done: false,
    comments: [],
    blocks: cloneTemplateBlocks(step.blocks),
  }));
}

function countComments(step) {
  return step.comments.length;
}

function getInstanceProgress(instance) {
  const total = instance.steps.length;
  const done = instance.steps.filter((step) => step.done).length;
  const requiredTotal = instance.steps.filter((step) => step.required).length;
  const requiredDone = instance.steps.filter((step) => step.required && step.done).length;

  return {
    done,
    total,
    requiredDone,
    requiredTotal,
    allRequiredDone: requiredDone === requiredTotal,
    allDone: done === total,
  };
}

function highlightMentions(text, users) {
  const names = users.map((user) => user.name).sort((left, right) => right.length - left.length);

  if (!names.length) {
    return text;
  }

  const pattern = new RegExp(`(@(?:${names.map(escapeForRegex).join("|")}))`, "g");
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      return (
        <span className="mention" key={`${part}-${index}`}>
          {part}
        </span>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function paragraphHtml(block) {
  if (block.html) {
    return block.html;
  }

  if (!block.text) {
    return "";
  }

  return `<p>${escapeHtml(block.text)}</p>`;
}

function Avatar({ user, small = false }) {
  return (
    <div className={`avatar avatar-${user.accent}${small ? " avatar-small" : ""}`}>
      {getInitials(user.name)}
    </div>
  );
}

function UserPill({ user, muted = false }) {
  return (
    <div className={`user-pill${muted ? " user-pill-muted" : ""}`}>
      <Avatar user={user} small />
      <span>{user.name}</span>
    </div>
  );
}

function Button({ children, kind = "primary", ...props }) {
  return (
    <button className={`button button-${kind}`} {...props}>
      {children}
    </button>
  );
}

function EmptyState({ title, text, action }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

function Modal({ open, title, children, onClose, actions }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div>
            <p className="eyebrow">Uus tööprotsess</p>
            <h3>{title}</h3>
          </div>
          <button className="ghost-link" onClick={onClose} type="button">
            Sule
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">{actions}</div>
      </div>
    </div>
  );
}

function PersonSelect({ users, selectedId, onChange, placeholder = "Kõik kasutajad", allowEmpty = false }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const selectedUser = users.find((user) => user.id === selectedId);

  useEffect(() => {
    function handleOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    window.addEventListener("click", handleOutside);

    return () => window.removeEventListener("click", handleOutside);
  }, []);

  return (
    <div className="person-select" ref={wrapperRef}>
      <button className="person-select-trigger" onClick={() => setOpen((value) => !value)} type="button">
        {selectedUser ? <UserPill user={selectedUser} muted /> : <span>{placeholder}</span>}
        <span className="caret">▾</span>
      </button>
      {open ? (
        <div className="person-select-menu">
          {allowEmpty ? (
            <button
              className={`person-select-option${selectedId ? "" : " person-select-option-active"}`}
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              type="button"
            >
              <span>{placeholder}</span>
            </button>
          ) : null}
          {users.map((user) => (
            <button
              className={`person-select-option${selectedId === user.id ? " person-select-option-active" : ""}`}
              key={user.id}
              onClick={() => {
                onChange(user.id);
                setOpen(false);
              }}
              type="button"
            >
              <UserPill user={user} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function App() {
  const [appData, setAppData] = useState(() => cloneData(initialData));
  const [currentUserId, setCurrentUserId] = useState(initialData.users[0].id);
  const [currentView, setCurrentView] = useState({ name: "home" });
  const [startModal, setStartModal] = useState({
    open: false,
    templateId: initialData.templates[0].id,
    assigneeId: initialData.users[0].id,
    name: "",
  });
  const [filters, setFilters] = useState({
    activeUserId: "",
    activeTemplateQuery: "",
    activeDate: "",
    archiveUserId: "",
    archiveTemplateQuery: "",
    archiveDate: "",
  });

  const currentUser = appData.users.find((user) => user.id === currentUserId);
  const templatesById = Object.fromEntries(appData.templates.map((template) => [template.id, template]));
  const usersById = Object.fromEntries(appData.users.map((user) => [user.id, user]));

  const myActiveInstances = appData.activeInstances.filter((instance) => instance.assignedUserId === currentUserId);
  const filteredActiveInstances = appData.activeInstances.filter((instance) => {
    const matchesUser = !filters.activeUserId || instance.assignedUserId === filters.activeUserId;
    const matchesTemplate =
      !filters.activeTemplateQuery ||
      instance.templateName.toLowerCase().includes(filters.activeTemplateQuery.toLowerCase());
    const matchesDate = !filters.activeDate || instance.startedAt === filters.activeDate;

    return matchesUser && matchesTemplate && matchesDate;
  });
  const filteredArchivedInstances = appData.archivedInstances.filter((instance) => {
    const matchesUser = !filters.archiveUserId || instance.assignedUserId === filters.archiveUserId;
    const matchesTemplate =
      !filters.archiveTemplateQuery ||
      instance.templateName.toLowerCase().includes(filters.archiveTemplateQuery.toLowerCase());
    const matchesDate = !filters.archiveDate || instance.finishedAt === filters.archiveDate;

    return matchesUser && matchesTemplate && matchesDate;
  });

  const selectedTemplateForModal =
    appData.templates.find((template) => template.id === startModal.templateId) ?? appData.templates[0];
  const selectedActiveInstance =
    currentView.name === "run-instance"
      ? appData.activeInstances.find((instance) => instance.id === currentView.instanceId)
      : null;
  const selectedArchivedInstance =
    currentView.name === "archive-instance"
      ? appData.archivedInstances.find((instance) => instance.id === currentView.instanceId)
      : null;
  const selectedTemplate =
    currentView.name === "edit-template"
      ? appData.templates.find((template) => template.id === currentView.templateId)
      : null;

  function navigate(name, extra = {}) {
    setCurrentView({ name, ...extra });
  }

  function openStartModal(templateId = appData.templates[0]?.id) {
    const template = appData.templates.find((item) => item.id === templateId) ?? appData.templates[0];
    setStartModal({
      open: true,
      templateId: template.id,
      assigneeId: currentUserId,
      name: "",
    });
  }

  function closeStartModal() {
    setStartModal((previous) => ({ ...previous, open: false }));
  }

  function startWorkflow() {
    if (!startModal.name.trim()) {
      return;
    }

    const template = appData.templates.find((item) => item.id === startModal.templateId);

    if (!template) {
      return;
    }

    const newInstance = {
      id: makeId("instance"),
      templateId: template.id,
      templateName: template.title,
      templateVersion: template.currentVersion,
      name: startModal.name.trim(),
      assignedUserId: startModal.assigneeId,
      startedAt: appData.today,
      dueDate: "",
      finishedAt: null,
      steps: buildInstanceSteps(template.steps),
    };

    setAppData((previous) => ({
      ...previous,
      activeInstances: [newInstance, ...previous.activeInstances],
    }));
    setCurrentUserId(startModal.assigneeId);
    closeStartModal();
    navigate("run-instance", { instanceId: newInstance.id });
  }

  function createTemplate() {
    const templateId = makeId("template");
    const newTemplate = {
      id: templateId,
      title: "Uus mall",
      description: "Kirjelda lühidalt, mille jaoks seda tööprotsessi kasutatakse.",
      category: "Vastavalt vajadusele",
      currentVersion: "v0",
      lastSavedAt: appData.today,
      versions: [],
      steps: [
        {
          id: makeId("template-step"),
          title: "Esimene samm",
          required: true,
          blocks: [
            {
              id: makeId("block"),
              type: "paragraph",
              text: "Kirjuta siia lühike juhis või lisa / abil uusi plokke.",
            },
          ],
        },
      ],
    };

    setAppData((previous) => ({
      ...previous,
      templates: [newTemplate, ...previous.templates],
    }));
    navigate("edit-template", { templateId });
  }

  function saveTemplate(templateDraft) {
    setAppData((previous) => {
      const templates = previous.templates.map((template) => {
        if (template.id !== templateDraft.id) {
          return template;
        }

        const nextVersion = `v${template.versions.length + 1}`;

        return {
          ...templateDraft,
          currentVersion: nextVersion,
          lastSavedAt: previous.today,
          versions: [
            ...template.versions,
            {
              version: nextVersion,
              date: previous.today,
              summary: `Mall salvestati ${templateDraft.steps.length} sammuga.`,
            },
          ],
        };
      });

      return {
        ...previous,
        templates,
      };
    });
  }

  function updateInstance(instanceId, updater) {
    setAppData((previous) => ({
      ...previous,
      activeInstances: previous.activeInstances.map((instance) =>
        instance.id === instanceId ? updater(instance) : instance,
      ),
    }));
  }

  function updateArchivedInstance(instanceId, updater) {
    setAppData((previous) => ({
      ...previous,
      archivedInstances: previous.archivedInstances.map((instance) =>
        instance.id === instanceId ? updater(instance) : instance,
      ),
    }));
  }

  function completeInstance(instanceId) {
    setAppData((previous) => {
      const target = previous.activeInstances.find((instance) => instance.id === instanceId);

      if (!target) {
        return previous;
      }

      const archivedInstance = {
        ...target,
        finishedAt: previous.today,
      };

      return {
        ...previous,
        activeInstances: previous.activeInstances.filter((instance) => instance.id !== instanceId),
        archivedInstances: [archivedInstance, ...previous.archivedInstances],
      };
    });
    navigate("archive-instance", { instanceId });
  }

  function renderPage() {
    if (currentView.name === "home") {
      return (
        <HomePage
          instances={myActiveInstances}
          onOpenInstance={(instanceId) => navigate("run-instance", { instanceId })}
          onOpenAll={() => navigate("all-active")}
          onOpenArchive={() => navigate("archive")}
          onOpenStart={() => openStartModal()}
          usersById={usersById}
          currentUser={currentUser}
        />
      );
    }

    if (currentView.name === "all-active") {
      return (
        <AllActivePage
          filters={filters}
          instances={filteredActiveInstances}
          onFilterChange={(key, value) => setFilters((previous) => ({ ...previous, [key]: value }))}
          onOpenInstance={(instanceId) => navigate("run-instance", { instanceId })}
          users={appData.users}
          usersById={usersById}
        />
      );
    }

    if (currentView.name === "templates") {
      return (
        <TemplateLibraryPage
          templates={appData.templates}
          onEditTemplate={(templateId) => navigate("edit-template", { templateId })}
          onOpenStart={openStartModal}
          onCreateTemplate={createTemplate}
        />
      );
    }

    if (currentView.name === "edit-template" && selectedTemplate) {
      return (
        <TemplateEditorPage
          key={selectedTemplate.id}
          template={selectedTemplate}
          onBack={() => navigate("templates")}
          onSave={saveTemplate}
        />
      );
    }

    if (currentView.name === "run-instance" && selectedActiveInstance) {
      return (
        <WorkflowRunPage
          key={selectedActiveInstance.id}
          instance={selectedActiveInstance}
          currentUserId={currentUserId}
          users={appData.users}
          usersById={usersById}
          onBack={() => navigate("all-active")}
          onUpdateInstance={(updater) => updateInstance(selectedActiveInstance.id, updater)}
          onComplete={() => completeInstance(selectedActiveInstance.id)}
        />
      );
    }

    if (currentView.name === "archive") {
      return (
        <ArchivePage
          filters={filters}
          instances={filteredArchivedInstances}
          onFilterChange={(key, value) => setFilters((previous) => ({ ...previous, [key]: value }))}
          onOpenInstance={(instanceId) => navigate("archive-instance", { instanceId })}
          users={appData.users}
          usersById={usersById}
        />
      );
    }

    if (currentView.name === "archive-instance" && selectedArchivedInstance) {
      return (
        <WorkflowRunPage
          key={selectedArchivedInstance.id}
          instance={selectedArchivedInstance}
          currentUserId={currentUserId}
          users={appData.users}
          usersById={usersById}
          readOnly
          onBack={() => navigate("archive")}
          onUpdateInstance={(updater) => updateArchivedInstance(selectedArchivedInstance.id, updater)}
        />
      );
    }

    return (
      <EmptyState
        title="Valitud vaadet ei leitud"
        text="Mine tagasi avalehele või ava protsesside kogu, et jätkata sealt, kus pooleli jäid."
        action={
          <Button kind="secondary" onClick={() => navigate("home")} type="button">
            Tagasi avalehele
          </Button>
        }
      />
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="eyebrow">Koolikorraldus</p>
          <h1>{appData.account.name}</h1>
          <p>{appData.account.helperText}</p>
        </div>

        <div className="sidebar-section">
          <p className="section-label">Vaated</p>
          <nav className="nav-list">
            <button
              className={`nav-item${currentView.name === "home" ? " nav-item-active" : ""}`}
              onClick={() => navigate("home")}
              type="button"
            >
              Minu aktiivsed tööprotsessid
            </button>
            <button
              className={`nav-item${currentView.name === "all-active" || currentView.name === "run-instance" ? " nav-item-active" : ""}`}
              onClick={() => navigate("all-active")}
              type="button"
            >
              Kõik aktiivsed tööprotsessid
            </button>
            <button
              className={`nav-item${currentView.name === "templates" || currentView.name === "edit-template" ? " nav-item-active" : ""}`}
              onClick={() => navigate("templates")}
              type="button"
            >
              Protsesside kogu
            </button>
            <button
              className={`nav-item${currentView.name === "archive" || currentView.name === "archive-instance" ? " nav-item-active" : ""}`}
              onClick={() => navigate("archive")}
              type="button"
            >
              Lõpetatud tööprotsessid
            </button>
          </nav>
        </div>

        <div className="sidebar-section">
          <p className="section-label">Aktiivne kasutaja</p>
          <PersonSelect users={appData.users} selectedId={currentUserId} onChange={setCurrentUserId} />
        </div>

        <div className="sidebar-note">
          <p className="section-label">Turbe- ja vastavusmärkus</p>
          <p>
            Kontoeraldus, versioonilogi ja minimaalne andmenähtavus on UI-s arvesse võetud. Täielik GDPR, E-ITS ja
            NIS2 vastavus eeldab lisaks autentimist, auditilogisid, säilituspoliitikaid ja serveripoole kontrolli.
          </p>
        </div>

        <div className="sidebar-note">
          <p className="section-label">Tulemas</p>
          <button className="coming-soon-row" title="Tulemas" type="button" disabled>
            E-kirja teavitused @mainimistele
          </button>
          <button className="coming-soon-row" title="Tulemas" type="button" disabled>
            Privaatsed tööprotsessid valitud inimestele
          </button>
        </div>
      </aside>

      <main className="main-pane">
        <header className="topbar">
          <div>
            <p className="eyebrow">Kooli konto</p>
            <h2>{currentUser.name}</h2>
          </div>
          <div className="topbar-actions">
            <UserPill user={currentUser} />
          </div>
        </header>
        <section className="content-pane">{renderPage()}</section>
      </main>

      <Modal
        open={startModal.open}
        onClose={closeStartModal}
        title={selectedTemplateForModal?.title ?? "Alusta tööprotsessi"}
        actions={
          <>
            <Button kind="secondary" onClick={closeStartModal} type="button">
              Tühista
            </Button>
            <Button onClick={startWorkflow} disabled={!startModal.name.trim()} type="button">
              Alusta tööprotsessi
            </Button>
          </>
        }
      >
        <label className="field">
          <span>Mall</span>
          <select
            className="input"
            value={startModal.templateId}
            onChange={(event) =>
              setStartModal((previous) => ({ ...previous, templateId: event.target.value }))
            }
          >
            {appData.templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.title}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Tööprotsessi nimi</span>
          <input
            className="input"
            onChange={(event) => setStartModal((previous) => ({ ...previous, name: event.target.value }))}
            placeholder="Näiteks Mai 2026 EHIS"
            type="text"
            value={startModal.name}
          />
        </label>
        <label className="field">
          <span>Vastutaja</span>
          <PersonSelect
            allowEmpty={false}
            onChange={(value) => setStartModal((previous) => ({ ...previous, assigneeId: value }))}
            selectedId={startModal.assigneeId}
            users={appData.users}
          />
        </label>
      </Modal>
    </div>
  );
}

function HomePage({ instances, onOpenInstance, onOpenAll, onOpenArchive, onOpenStart, usersById, currentUser }) {
  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Avaleht</p>
          <h2>Minu aktiivsed tööprotsessid</h2>
          <p>Siin on {currentUser.name.split(" ")[0]} töövood, mis vajavad lähiajal tähelepanu.</p>
        </div>
        <div className="header-actions">
          <Button kind="secondary" onClick={onOpenArchive} type="button">
            Lõpetatud tööprotsessid
          </Button>
          <Button kind="secondary" onClick={onOpenAll} type="button">
            Kõik aktiivsed tööprotsessid
          </Button>
          <Button onClick={onOpenStart} type="button">
            Alusta uut tööprotsessi
          </Button>
        </div>
      </div>

      {instances.length ? (
        <div className="card-grid">
          {instances.map((instance) => {
            const progress = getInstanceProgress(instance);
            const user = usersById[instance.assignedUserId];
            return (
              <button className="workflow-card" key={instance.id} onClick={() => onOpenInstance(instance.id)} type="button">
                <div className="workflow-card-head">
                  <div>
                    <h3>{instance.name}</h3>
                    <p>{instance.templateName}</p>
                  </div>
                  <Avatar user={user} />
                </div>
                <div className="progress-strip">
                  <div className="progress-bar">
                    <span style={{ width: `${(progress.done / progress.total) * 100}%` }} />
                  </div>
                  <strong>
                    {progress.done}/{progress.total} sammu tehtud
                  </strong>
                </div>
                <div className="meta-row">
                  <span>Alustatud {formatDate(instance.startedAt)}</span>
                  <span>{instance.dueDate ? `Tähtaeg ${formatDate(instance.dueDate)}` : "Tähtaega pole lisatud"}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Aktiivseid tööprotsesse veel ei ole"
          text="Alusta mõnest mallist uue tööprotsessiga ja see ilmub siia kohe koos edenemisega."
          action={
            <Button onClick={onOpenStart} type="button">
              Loo esimene tööprotsess
            </Button>
          }
        />
      )}
    </div>
  );
}

function AllActivePage({ instances, users, usersById, filters, onFilterChange, onOpenInstance }) {
  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Kooli vaade</p>
          <h2>Kõik aktiivsed tööprotsessid</h2>
          <p>Kõik pooleliolevad protsessid üle terve kooli konto, sõltumata vastutajast.</p>
        </div>
      </div>

      <div className="filter-row">
        <label className="field compact-field">
          <span>Kasutaja</span>
          <PersonSelect
            allowEmpty
            onChange={(value) => onFilterChange("activeUserId", value)}
            placeholder="Kõik kasutajad"
            selectedId={filters.activeUserId}
            users={users}
          />
        </label>
        <label className="field compact-field">
          <span>Malli nimi</span>
          <input
            className="input"
            onChange={(event) => onFilterChange("activeTemplateQuery", event.target.value)}
            placeholder="Otsi malli järgi"
            type="text"
            value={filters.activeTemplateQuery}
          />
        </label>
        <label className="field compact-field">
          <span>Alustatud</span>
          <input
            className="input"
            onChange={(event) => onFilterChange("activeDate", event.target.value)}
            type="date"
            value={filters.activeDate}
          />
        </label>
      </div>

      {instances.length ? (
        <div className="table-card">
          <div className="table-head table-grid">
            <span>Tööprotsess</span>
            <span>Mall</span>
            <span>Vastutaja</span>
            <span>Edenemine</span>
            <span>Alustatud</span>
          </div>
          {instances.map((instance) => {
            const progress = getInstanceProgress(instance);
            return (
              <button className="table-row table-grid" key={instance.id} onClick={() => onOpenInstance(instance.id)} type="button">
                <strong>{instance.name}</strong>
                <span>{instance.templateName}</span>
                <UserPill user={usersById[instance.assignedUserId]} />
                <span>
                  {progress.done}/{progress.total} sammu tehtud
                </span>
                <span>{formatDate(instance.startedAt)}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Filtritele vastavaid tööprotsesse ei leitud"
          text="Muuda filtreid või alusta uut tööprotsessi mallide kogust."
        />
      )}
    </div>
  );
}

function TemplateLibraryPage({ templates, onEditTemplate, onOpenStart, onCreateTemplate }) {
  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Mallid</p>
          <h2>Protsesside kogu</h2>
          <p>Ühes kohas kõik korduvate kooli protsesside mallid, mida saab jooksvalt täiendada ja kohe käivitada.</p>
        </div>
        <Button onClick={onCreateTemplate} type="button">
          Uus mall
        </Button>
      </div>

      <div className="card-grid">
        {templates.map((template) => (
          <article className="template-card" key={template.id}>
            <div className="template-card-top">
              <div className="tag-row">
                <span className="tag">{template.category}</span>
                <span className="meta-chip">{template.currentVersion}</span>
              </div>
              <h3>{template.title}</h3>
              <p>{template.description}</p>
            </div>
            <div className="template-card-bottom">
              <div className="meta-row">
                <span>{template.steps.length} sammu</span>
                <span>Salvestatud {formatDate(template.lastSavedAt)}</span>
              </div>
              <div className="inline-actions">
                <Button kind="secondary" onClick={() => onOpenStart(template.id)} type="button">
                  Alusta
                </Button>
                <Button kind="secondary" onClick={() => onEditTemplate(template.id)} type="button">
                  Muuda malli
                </Button>
                <button className="button button-disabled" title="Tulemas" type="button" disabled>
                  Jaga tööprotsessi KOV-iga
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TemplateEditorPage({ template, onBack, onSave }) {
  const [draft, setDraft] = useState(() => cloneData(template));
  const [draggedStepId, setDraggedStepId] = useState("");
  const [savedAt, setSavedAt] = useState(template.lastSavedAt);

  function updateStep(stepId, updater) {
    setDraft((previous) => ({
      ...previous,
      steps: previous.steps.map((step) => (step.id === stepId ? updater(step) : step)),
    }));
  }

  function removeStep(stepId) {
    setDraft((previous) => ({
      ...previous,
      steps: previous.steps.filter((step) => step.id !== stepId),
    }));
  }

  function addStep() {
    setDraft((previous) => ({
      ...previous,
      steps: [
        ...previous.steps,
        {
          id: makeId("template-step"),
          title: "Uus samm",
          required: true,
          blocks: [
            {
              id: makeId("block"),
              type: "paragraph",
              text: "",
            },
          ],
        },
      ],
    }));
  }

  function moveStep(draggedId, targetId) {
    setDraft((previous) => {
      const steps = [...previous.steps];
      const draggedIndex = steps.findIndex((step) => step.id === draggedId);
      const targetIndex = steps.findIndex((step) => step.id === targetId);

      if (draggedIndex < 0 || targetIndex < 0 || draggedIndex === targetIndex) {
        return previous;
      }

      const [moved] = steps.splice(draggedIndex, 1);
      steps.splice(targetIndex, 0, moved);

      return {
        ...previous,
        steps,
      };
    });
  }

  function save() {
    const nextVersion = `v${draft.versions.length + 1}`;
    const nextSavedAt = new Date().toISOString().slice(0, 10);

    setDraft((previous) => ({
      ...previous,
      currentVersion: nextVersion,
      lastSavedAt: nextSavedAt,
      versions: [
        ...previous.versions,
        {
          version: nextVersion,
          date: nextSavedAt,
          summary: `Mall salvestati ${previous.steps.length} sammuga.`,
        },
      ],
    }));
    onSave(draft);
    setSavedAt(nextSavedAt);
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <button className="back-link" onClick={onBack} type="button">
            ← Tagasi mallide kogusse
          </button>
          <p className="eyebrow">Muudatusrežiim</p>
          <h2>Malli muutmine</h2>
          <p>Hoia sammud lühikesed, selged ja korduvkasutatavad. Live tööprotsessid ei muutu tagasiulatuvalt.</p>
        </div>
        <div className="header-actions">
          <button className="button button-disabled" title="Tulemas" type="button" disabled>
            Määra sammud automaatselt rollidele
          </button>
          <Button onClick={save} type="button">
            Salvesta mall
          </Button>
        </div>
      </div>

      <div className="editor-layout">
        <div className="editor-main">
          <label className="field">
            <span>Malli pealkiri</span>
            <input
              className="input large-input"
              onChange={(event) => setDraft((previous) => ({ ...previous, title: event.target.value }))}
              type="text"
              value={draft.title}
            />
          </label>
          <label className="field">
            <span>Kirjeldus</span>
            <textarea
              className="input textarea"
              onChange={(event) => setDraft((previous) => ({ ...previous, description: event.target.value }))}
              rows={3}
              value={draft.description}
            />
          </label>
          <label className="field compact-field">
            <span>Kategooria</span>
            <select
              className="input"
              onChange={(event) => setDraft((previous) => ({ ...previous, category: event.target.value }))}
              value={draft.category}
            >
              <option>Igakuine</option>
              <option>Iga-aastane</option>
              <option>Eksam</option>
              <option>Personal</option>
              <option>Vastavalt vajadusele</option>
            </select>
          </label>

          <div className="steps-stack">
              {draft.steps.map((step) => (
                <article
                  className="step-editor-card"
                  key={step.id}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => moveStep(draggedStepId, step.id)}
                >
                  <div className="step-editor-top">
                    <div>
                      <p className="eyebrow">Samm</p>
                    <input
                      className="step-title-input"
                      onChange={(event) =>
                        updateStep(step.id, (previous) => ({ ...previous, title: event.target.value }))
                      }
                      type="text"
                      value={step.title}
                    />
                  </div>
                  <div className="step-editor-actions">
                    <button
                      className="drag-handle"
                      draggable
                      onDragStart={() => setDraggedStepId(step.id)}
                      type="button"
                    >
                      Lohista
                    </button>
                    <label className="toggle-pill">
                      <input
                        checked={step.required}
                        onChange={(event) =>
                          updateStep(step.id, (previous) => ({ ...previous, required: event.target.checked }))
                        }
                        type="checkbox"
                      />
                      <span>{step.required ? "Kohustuslik" : "Valikuline"}</span>
                    </label>
                    <button className="ghost-link danger" onClick={() => removeStep(step.id)} type="button">
                      Eemalda samm
                    </button>
                  </div>
                </div>

                <StepBlockEditor
                  blocks={step.blocks}
                  onChange={(blocks) => updateStep(step.id, (previous) => ({ ...previous, blocks }))}
                />
              </article>
            ))}
          </div>

          <Button kind="secondary" onClick={addStep} type="button">
            Lisa samm
          </Button>
        </div>

        <aside className="editor-sidebar">
          <div className="side-card">
            <p className="section-label">Versioonilugu</p>
            {draft.versions.length ? (
              <div className="history-list">
                {draft.versions
                  .slice()
                  .reverse()
                  .map((entry) => (
                    <div className="history-row" key={`${entry.version}-${entry.date}`}>
                      <strong>{entry.version}</strong>
                      <span>{formatDate(entry.date)}</span>
                      <p>{entry.summary}</p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="muted-copy">Esimene versioon tekib pärast esmast salvestamist.</p>
            )}
          </div>
          <div className="side-card success-card">
            <strong>Muudatused salvestatud {formatDate(savedAt)}.</strong>
            <p>Varasemad tööprotsessid ei ole mõjutatud.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StepBlockEditor({ blocks, onChange }) {
  const [slashValue, setSlashValue] = useState("");

  function updateBlock(blockId, updater) {
    onChange(blocks.map((block) => (block.id === blockId ? updater(block) : block)));
  }

  function removeBlock(blockId) {
    onChange(blocks.filter((block) => block.id !== blockId));
  }

  function addBlock(type) {
    const baseBlock = {
      paragraph: {
        id: makeId("block"),
        type: "paragraph",
        text: "",
      },
      checklist: {
        id: makeId("block"),
        type: "checklist",
        items: [{ id: makeId("check"), text: "Uus kontrollpunkt" }],
      },
      link: {
        id: makeId("block"),
        type: "link",
        label: "",
        url: "",
      },
      image: {
        id: makeId("block"),
        type: "image",
        name: "",
        src: "",
      },
    };

    onChange([...blocks, baseBlock[type]]);
    setSlashValue("");
  }

  function handleImageUpload(event, blockId) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateBlock(blockId, (block) => ({
        ...block,
        name: file.name,
        src: String(reader.result),
      }));
    };
    reader.readAsDataURL(file);
  }

  const visibleOptions = blockOptions.filter((option) =>
    option.label.toLowerCase().includes(slashValue.replace("/", "").toLowerCase()),
  );

  return (
    <div className="block-editor">
      {blocks.map((block) => (
        <div className="block-row" key={block.id}>
          <div className="block-row-head">
            <span className="block-label">
              {block.type === "paragraph"
                ? "Lõik"
                : block.type === "checklist"
                  ? "Kontrollnimekiri"
                  : block.type === "link"
                    ? "Link"
                    : "Pilt"}
            </span>
            <button className="ghost-link" onClick={() => removeBlock(block.id)} type="button">
              Eemalda plokk
            </button>
          </div>

          {block.type === "paragraph" ? (
            <RichTextBlockEditor
              block={block}
              onChange={(nextHtml, nextText) =>
                updateBlock(block.id, (previous) => ({
                  ...previous,
                  html: nextHtml,
                  text: nextText,
                }))
              }
            />
          ) : null}

          {block.type === "checklist" ? (
            <div className="checklist-editor">
              {block.items.map((item) => (
                <div className="checklist-editor-row" key={item.id}>
                  <span className="fake-checkbox" />
                  <input
                    className="input"
                    onChange={(event) =>
                      updateBlock(block.id, (previous) => ({
                        ...previous,
                        items: previous.items.map((previousItem) =>
                          previousItem.id === item.id
                            ? { ...previousItem, text: event.target.value }
                            : previousItem,
                        ),
                      }))
                    }
                    type="text"
                    value={item.text}
                  />
                </div>
              ))}
              <button
                className="ghost-link"
                onClick={() =>
                  updateBlock(block.id, (previous) => ({
                    ...previous,
                    items: [...previous.items, { id: makeId("check"), text: "Uus kontrollpunkt" }],
                  }))
                }
                type="button"
              >
                Lisa kontrollpunkt
              </button>
            </div>
          ) : null}

          {block.type === "link" ? (
            <div className="link-grid">
              <input
                className="input"
                onChange={(event) => updateBlock(block.id, (previous) => ({ ...previous, label: event.target.value }))}
                placeholder="Näidatav tekst"
                type="text"
                value={block.label}
              />
              <input
                className="input"
                onChange={(event) => updateBlock(block.id, (previous) => ({ ...previous, url: event.target.value }))}
                placeholder="https://..."
                type="url"
                value={block.url}
              />
            </div>
          ) : null}

          {block.type === "image" ? (
            <div className="image-editor">
              <input
                className="hidden-input"
                id={`upload-${block.id}`}
                onChange={(event) => handleImageUpload(event, block.id)}
                type="file"
              />
              <Button
                kind="secondary"
                onClick={() => document.getElementById(`upload-${block.id}`)?.click()}
                type="button"
              >
                Laadi pilt üles
              </Button>
              {block.src ? <img alt={block.name || "Sammu pilt"} className="uploaded-image" src={block.src} /> : null}
            </div>
          ) : null}
        </div>
      ))}

      <div className="slash-box">
        <input
          className="input"
          onChange={(event) => setSlashValue(event.target.value)}
          placeholder="Kirjuta / ploki lisamiseks"
          type="text"
          value={slashValue}
        />
        {slashValue.startsWith("/") ? (
          <div className="slash-menu">
            {visibleOptions.map((option) => (
              <button className="slash-option" key={option.type} onClick={() => addBlock(option.type)} type="button">
                {option.label}
              </button>
            ))}
            {!visibleOptions.length ? <p className="muted-copy">Sobivat plokki ei leitud.</p> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RichTextBlockEditor({ block, onChange }) {
  const editorRef = useRef(null);
  const selectionRef = useRef(null);
  const lastSyncedHtmlRef = useRef("");
  const [linkDraft, setLinkDraft] = useState({ open: false, url: "", newTab: true });

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const nextHtml = paragraphHtml(block);
    if (lastSyncedHtmlRef.current !== nextHtml && editorRef.current.innerHTML !== nextHtml) {
      editorRef.current.innerHTML = nextHtml;
    }
    lastSyncedHtmlRef.current = nextHtml;
  }, [block]);

  function syncContent() {
    if (!editorRef.current) {
      return;
    }

    const nextHtml = editorRef.current.innerHTML;
    lastSyncedHtmlRef.current = nextHtml;
    onChange(nextHtml, editorRef.current.textContent ?? "");
  }

  function saveSelection() {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0 || !editorRef.current) {
      return;
    }

    const range = selection.getRangeAt(0);

    if (editorRef.current.contains(range.commonAncestorContainer)) {
      selectionRef.current = range.cloneRange();
    }
  }

  function restoreSelection() {
    const selection = window.getSelection();

    if (!selection || !selectionRef.current) {
      return;
    }

    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
  }

  function runCommand(command, value = null) {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, value);
    saveSelection();
    syncContent();
  }

  function applyHighlight() {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand("styleWithCSS", false, true);
    document.execCommand("hiliteColor", false, "#fff59d");
    document.execCommand("styleWithCSS", false, false);
    saveSelection();
    syncContent();
  }

  function insertLink() {
    if (!linkDraft.url.trim()) {
      return;
    }

    editorRef.current?.focus();
    restoreSelection();
    document.execCommand("createLink", false, linkDraft.url.trim());

    const selection = window.getSelection();
    const anchor =
      selection?.anchorNode?.parentElement?.closest("a") ??
      editorRef.current?.querySelector(`a[href="${linkDraft.url.trim()}"]`);

    if (anchor) {
      if (linkDraft.newTab) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noreferrer");
      } else {
        anchor.removeAttribute("target");
        anchor.removeAttribute("rel");
      }
    }

    syncContent();
    setLinkDraft({ open: false, url: "", newTab: true });
  }

  return (
    <div className="rich-text-editor">
      <div className="format-toolbar">
        <button
          className="toolbar-button"
          onClick={() => runCommand("bold")}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          Paks
        </button>
        <button
          className="toolbar-button"
          onClick={() => runCommand("italic")}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          Kaldkiri
        </button>
        <button
          className="toolbar-button"
          onClick={() => runCommand("underline")}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          Allajoonitud
        </button>
        <button
          className="toolbar-button"
          onClick={() => runCommand("strikeThrough")}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          Läbikriipsutus
        </button>
        <button
          className="toolbar-button toolbar-highlight"
          onClick={applyHighlight}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          Highlight
        </button>
        <button
          className="toolbar-button"
          onClick={() => runCommand("insertUnorderedList")}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          Täpploend
        </button>
        <button
          className="toolbar-button"
          onClick={() => runCommand("insertOrderedList")}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          Numberloend
        </button>
        <button
          className="toolbar-button"
          onClick={() => runCommand("indent")}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          Nihuta sisse
        </button>
        <button
          className="toolbar-button"
          onClick={() => runCommand("outdent")}
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          Nihuta välja
        </button>
        <button
          className="toolbar-button"
          onClick={() => setLinkDraft((previous) => ({ ...previous, open: !previous.open }))}
          onMouseDown={(event) => {
            event.preventDefault();
            saveSelection();
          }}
          type="button"
        >
          Hyperlink
        </button>
      </div>

      {linkDraft.open ? (
        <div className="link-inline-editor">
          <input
            className="input"
            onChange={(event) => setLinkDraft((previous) => ({ ...previous, url: event.target.value }))}
            placeholder="https://..."
            type="url"
            value={linkDraft.url}
          />
          <label className="toggle-pill">
            <input
              checked={linkDraft.newTab}
              onChange={(event) => setLinkDraft((previous) => ({ ...previous, newTab: event.target.checked }))}
              type="checkbox"
            />
            <span>Ava uuel vahekaardil</span>
          </label>
          <div className="inline-actions">
            <Button kind="secondary" onClick={() => setLinkDraft({ open: false, url: "", newTab: true })} type="button">
              Tühista
            </Button>
            <Button onClick={insertLink} type="button">
              Lisa link
            </Button>
          </div>
        </div>
      ) : null}

      <div
        className="input rich-text-surface"
        contentEditable
        dir="ltr"
        onBlur={syncContent}
        onInput={syncContent}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        ref={editorRef}
        suppressContentEditableWarning
      />
      <p className="muted-copy">
        Vali tekst ja kasuta tööriistu vormindamiseks. Loendid ja nested listid töötavad taande nuppudega.
      </p>
    </div>
  );
}

function WorkflowRunPage({
  instance,
  users,
  usersById,
  currentUserId,
  onBack,
  onUpdateInstance,
  onComplete,
  readOnly = false,
}) {
  const [expandedComments, setExpandedComments] = useState({});
  const progress = getInstanceProgress(instance);

  function updateStep(stepId, updater) {
    onUpdateInstance((previous) => ({
      ...previous,
      steps: previous.steps.map((step) => (step.id === stepId ? updater(step) : step)),
    }));
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <button className="back-link" onClick={onBack} type="button">
            ← {readOnly ? "Tagasi arhiivi" : "Tagasi aktiivsete tööprotsesside juurde"}
          </button>
          <p className="eyebrow">{readOnly ? "Arhiivivaade" : "Käivitusrežiim"}</p>
          {readOnly ? (
            <h2>{instance.name}</h2>
          ) : (
            <input
              className="input large-input instance-name-input"
              onChange={(event) => onUpdateInstance((previous) => ({ ...previous, name: event.target.value }))}
              type="text"
              value={instance.name}
            />
          )}
          <p>
            Mall: {instance.templateName} · Versioon {instance.templateVersion}
          </p>
        </div>
        <div className="header-actions">
          {!readOnly && progress.allRequiredDone ? (
            <Button onClick={onComplete} type="button">
              Märgi lõpetatuks
            </Button>
          ) : null}
        </div>
      </div>

      <div className="run-summary">
        <div className="run-summary-main">
          <div className="progress-bar large-progress">
            <span style={{ width: `${(progress.done / progress.total) * 100}%` }} />
          </div>
          <strong>
            {progress.done}/{progress.total} sammu tehtud
          </strong>
          {!progress.allRequiredDone && !readOnly ? (
            <p className="muted-copy">Lõpetamiseks peavad kõik kohustuslikud sammud olema tehtud.</p>
          ) : null}
          {progress.allRequiredDone && !progress.allDone && !readOnly ? (
            <p className="muted-copy">Valikulised sammud võivad soovi korral avatuks jääda.</p>
          ) : null}
        </div>
        <div className="run-summary-side">
          <div className="summary-chip">
            <span>Vastutaja</span>
            <UserPill user={usersById[instance.assignedUserId]} />
          </div>
          <label className="field compact-field">
            <span>Tähtaeg</span>
            <input
              className="input"
              disabled={readOnly}
              onChange={(event) => onUpdateInstance((previous) => ({ ...previous, dueDate: event.target.value }))}
              type="date"
              value={instance.dueDate || ""}
            />
          </label>
        </div>
      </div>

      <div className="steps-stack">
        {instance.steps.map((step, index) => (
          <article className="run-step-card" key={step.id}>
            <div className="run-step-head">
              <div className="step-number">{index + 1}</div>
              <div className="step-main">
                <div className="step-main-row">
                  <label className="main-check">
                    <input
                      checked={step.done}
                      disabled={readOnly}
                      onChange={(event) =>
                        updateStep(step.id, (previous) => ({ ...previous, done: event.target.checked }))
                      }
                      type="checkbox"
                    />
                    <span>{step.title}</span>
                  </label>
                  <div className="inline-actions">
                    <label className="toggle-pill">
                      <input
                        checked={step.required}
                        disabled={readOnly}
                        onChange={(event) =>
                          updateStep(step.id, (previous) => ({ ...previous, required: event.target.checked }))
                        }
                        type="checkbox"
                      />
                      <span>{step.required ? "Kohustuslik" : "Valikuline"}</span>
                    </label>
                  </div>
                </div>
                <RunBlocks
                  blocks={step.blocks}
                  onToggleChecklist={(blockId, itemId, checked) =>
                    updateStep(step.id, (previous) => ({
                      ...previous,
                      blocks: previous.blocks.map((block) => {
                        if (block.id !== blockId || block.type !== "checklist") {
                          return block;
                        }

                        return {
                          ...block,
                          items: block.items.map((item) =>
                            item.id === itemId ? { ...item, checked } : item,
                          ),
                        };
                      }),
                    }))
                  }
                  readOnly={readOnly}
                />
                <button
                  className="comment-toggle"
                  onClick={() =>
                    setExpandedComments((previous) => ({
                      ...previous,
                      [step.id]: !previous[step.id],
                    }))
                  }
                  type="button"
                >
                  Kommentaarid ({countComments(step)})
                </button>
                {expandedComments[step.id] ? (
                  <CommentSection
                    readOnly={readOnly}
                    step={step}
                    users={users}
                    usersById={usersById}
                    onAddComment={(text) =>
                      updateStep(step.id, (previous) => ({
                        ...previous,
                        comments: [
                          ...previous.comments,
                          {
                            id: makeId("comment"),
                            userId: currentUserId,
                            timestamp: new Date().toISOString(),
                            text,
                          },
                        ],
                      }))
                    }
                  />
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function RunBlocks({ blocks, onToggleChecklist, readOnly }) {
  return (
    <div className="run-blocks">
      {blocks.map((block) => {
        if (block.type === "paragraph") {
          return (
            <div
              className="run-rich-text"
              dangerouslySetInnerHTML={{ __html: paragraphHtml(block) }}
              key={block.id}
            />
          );
        }

        if (block.type === "checklist") {
          return (
            <div className="run-checklist" key={block.id}>
              {block.items.map((item) => (
                <label className="run-checklist-item" key={item.id}>
                  <input
                    checked={Boolean(item.checked)}
                    disabled={readOnly}
                    onChange={(event) => onToggleChecklist(block.id, item.id, event.target.checked)}
                    type="checkbox"
                  />
                  <span>{item.text}</span>
                </label>
              ))}
            </div>
          );
        }

        if (block.type === "link") {
          return (
            <a className="inline-link" href={block.url} key={block.id} rel="noreferrer" target="_blank">
              {block.label || block.url}
            </a>
          );
        }

        if (block.type === "image") {
          return block.src ? <img alt={block.name || "Lisatud pilt"} className="uploaded-image" key={block.id} src={block.src} /> : null;
        }

        return null;
      })}
    </div>
  );
}

function CommentSection({ step, users, usersById, onAddComment, readOnly }) {
  const [draft, setDraft] = useState("");
  const [mentionQuery, setMentionQuery] = useState("");

  const matchingUsers = users.filter((user) =>
    user.name.toLowerCase().includes(mentionQuery.replace("@", "").trim().toLowerCase()),
  );

  function syncDraft(value) {
    setDraft(value);
    const match = value.match(/@[^@\n]*$/);
    setMentionQuery(match ? match[0] : "");
  }

  function insertMention(name) {
    const nextValue = draft.replace(/@[^@\n]*$/, `@${name} `);
    setDraft(nextValue);
    setMentionQuery("");
  }

  return (
    <div className="comments-wrap">
      {step.comments.length ? (
        <div className="comment-list">
          {step.comments.map((comment) => {
            const user = usersById[comment.userId];
            return (
              <article className="comment-card" key={comment.id}>
                <div className="comment-head">
                  <UserPill user={user} />
                  <span>{formatDateTime(comment.timestamp)}</span>
                </div>
                <p>{highlightMentions(comment.text, users)}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="muted-copy">Kommentaare veel ei ole. Kui midagi vajab täpsustamist, kirjuta siia kõigile nähtav märkus.</p>
      )}

      {!readOnly ? (
        <div className="comment-composer">
          <textarea
            className="input textarea"
            onChange={(event) => syncDraft(event.target.value)}
            placeholder="Kirjuta kommentaar. Kasuta @ kasutaja mainimiseks."
            rows={3}
            value={draft}
          />
          {mentionQuery.startsWith("@") ? (
            <div className="mention-menu">
              {matchingUsers.length ? (
                matchingUsers.map((user) => (
                  <button className="mention-option" key={user.id} onClick={() => insertMention(user.name)} type="button">
                    <UserPill user={user} />
                  </button>
                ))
              ) : (
                <p className="muted-copy">Sobivat inimest ei leitud.</p>
              )}
            </div>
          ) : null}
          <div className="comment-actions">
            <button className="button button-disabled" title="Tulemas" type="button" disabled>
              Teavita mainituid e-postiga
            </button>
            <Button
              disabled={!draft.trim()}
              onClick={() => {
                onAddComment(draft.trim());
                setDraft("");
                setMentionQuery("");
              }}
              type="button"
            >
              Lisa kommentaar
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ArchivePage({ instances, users, usersById, filters, onFilterChange, onOpenInstance }) {
  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Arhiiv</p>
          <h2>Lõpetatud tööprotsessid</h2>
          <p>Valmis protsessid koos kommentaaride ja kasutatud malli versiooniga jäävad siia rahulikult alles.</p>
        </div>
      </div>

      <div className="filter-row">
        <label className="field compact-field">
          <span>Kasutaja</span>
          <PersonSelect
            allowEmpty
            onChange={(value) => onFilterChange("archiveUserId", value)}
            placeholder="Kõik kasutajad"
            selectedId={filters.archiveUserId}
            users={users}
          />
        </label>
        <label className="field compact-field">
          <span>Malli nimi</span>
          <input
            className="input"
            onChange={(event) => onFilterChange("archiveTemplateQuery", event.target.value)}
            placeholder="Otsi malli järgi"
            type="text"
            value={filters.archiveTemplateQuery}
          />
        </label>
        <label className="field compact-field">
          <span>Lõpetatud</span>
          <input
            className="input"
            onChange={(event) => onFilterChange("archiveDate", event.target.value)}
            type="date"
            value={filters.archiveDate}
          />
        </label>
      </div>

      {instances.length ? (
        <div className="table-card">
          <div className="table-head table-grid archive-grid">
            <span>Tööprotsess</span>
            <span>Mall</span>
            <span>Vastutaja</span>
            <span>Lõpetatud</span>
            <span>Versioon</span>
          </div>
          {instances.map((instance) => (
            <button
              className="table-row table-grid archive-grid"
              key={instance.id}
              onClick={() => onOpenInstance(instance.id)}
              type="button"
            >
              <strong>{instance.name}</strong>
              <span>{instance.templateName}</span>
              <UserPill user={usersById[instance.assignedUserId]} />
              <span>{formatDate(instance.finishedAt)}</span>
              <span>{instance.templateVersion}</span>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Arhiiv on selle filtri järgi tühi"
          text="Kui tööprotsess märgitakse lõpetatuks, jääb see siia koos kommentaaride ja ajaloolise versiooniga."
        />
      )}
    </div>
  );
}

export default App;
