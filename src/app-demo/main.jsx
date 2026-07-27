import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";

const STORAGE_KEY = "launchpad-demo-tasks";
const THEME_KEY = "launchpad-demo-theme";

const owners = [
  { id: "elina", name: "Elina Razina", initials: "ER", color: "#ff7a45" },
  { id: "maya", name: "Maya Chen", initials: "MC", color: "#7c6cff" },
  { id: "leo", name: "Leo Martins", initials: "LM", color: "#2abf88" },
  { id: "noah", name: "Noah Kim", initials: "NK", color: "#eab84d" },
];

const columns = [
  {
    id: "backlog",
    title: "Backlog",
    hint: "Ideas & discovery",
    tone: "neutral",
  },
  { id: "progress", title: "In progress", hint: "Building now", tone: "blue" },
  { id: "review", title: "Review", hint: "Validation", tone: "violet" },
  { id: "done", title: "Done", hint: "Shipped", tone: "green" },
];

const initialTasks = [
  {
    id: "LP-142",
    title: "Add saved views for analytics filters",
    description:
      "Let users save frequently used filter combinations and share them with teammates.",
    status: "progress",
    priority: "high",
    owner: "elina",
    tag: "Analytics",
    points: 8,
    due: "Jul 29",
  },
  {
    id: "LP-138",
    title: "Improve onboarding empty states",
    description:
      "Create clear first-run guidance for teams that have not connected a data source.",
    status: "review",
    priority: "medium",
    owner: "maya",
    tag: "UX",
    points: 3,
    due: "Jul 28",
  },
  {
    id: "LP-151",
    title: "Audit role-based access rules",
    description:
      "Review workspace permissions and cover admin, editor, and viewer scenarios.",
    status: "backlog",
    priority: "high",
    owner: "noah",
    tag: "Platform",
    points: 5,
    due: "Aug 04",
  },
  {
    id: "LP-129",
    title: "Virtualize the activity timeline",
    description:
      "Keep scrolling smooth for workspaces with more than 10,000 audit events.",
    status: "done",
    priority: "high",
    owner: "elina",
    tag: "Performance",
    points: 8,
    due: "Jul 24",
  },
  {
    id: "LP-145",
    title: "Create billing usage breakdown",
    description:
      "Show usage by environment, data source, and team for enterprise workspaces.",
    status: "progress",
    priority: "medium",
    owner: "leo",
    tag: "Billing",
    points: 5,
    due: "Aug 01",
  },
  {
    id: "LP-136",
    title: "Keyboard navigation for data grid",
    description:
      "Support predictable focus movement, selection, and inline editing without a mouse.",
    status: "review",
    priority: "high",
    owner: "elina",
    tag: "Accessibility",
    points: 5,
    due: "Jul 30",
  },
  {
    id: "LP-154",
    title: "Workspace health notifications",
    description:
      "Notify admins when sync latency or error rates cross a configurable threshold.",
    status: "backlog",
    priority: "medium",
    owner: "maya",
    tag: "Monitoring",
    points: 3,
    due: "Aug 07",
  },
  {
    id: "LP-133",
    title: "Release dashboard export",
    description:
      "Generate a presentation-ready PDF snapshot of the weekly delivery report.",
    status: "done",
    priority: "medium",
    owner: "leo",
    tag: "Reporting",
    points: 3,
    due: "Jul 22",
  },
  {
    id: "LP-149",
    title: "Refactor query cache boundaries",
    description:
      "Separate workspace and project caches to prevent unnecessary invalidation.",
    status: "progress",
    priority: "low",
    owner: "noah",
    tag: "Architecture",
    points: 5,
    due: "Aug 02",
  },
  {
    id: "LP-127",
    title: "Add command palette",
    description:
      "Provide quick navigation and common actions through a searchable command menu.",
    status: "done",
    priority: "low",
    owner: "maya",
    tag: "Productivity",
    points: 3,
    due: "Jul 18",
  },
];

const velocity = [
  { label: "S17", value: 24 },
  { label: "S18", value: 31 },
  { label: "S19", value: 28 },
  { label: "S20", value: 42 },
  { label: "S21", value: 38 },
  { label: "S22", value: 46 },
];

function readStoredTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : initialTasks;
    return Array.isArray(parsed) ? parsed : initialTasks;
  } catch {
    return initialTasks;
  }
}

function readTheme() {
  const documentTheme = document.documentElement.dataset.appTheme;
  if (documentTheme === "light" || documentTheme === "dark") {
    return documentTheme;
  }

  try {
    return (
      localStorage.getItem(THEME_KEY) ||
      (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
    );
  } catch {
    return "dark";
  }
}

function Avatar({ ownerId, size = "medium" }) {
  const owner = owners.find((item) => item.id === ownerId) ?? owners[0];
  return (
    <span
      className={`avatar avatar--${size}`}
      style={{ "--avatar-color": owner.color }}
      title={owner.name}
      aria-label={owner.name}
    >
      {owner.initials}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return <span className={`priority priority--${priority}`}>{priority}</span>;
}

function TaskCard({ task, onOpen, onDragStart }) {
  return (
    <article
      className="task-card"
      draggable
      onDragStart={(event) => onDragStart(event, task.id)}
    >
      <button
        className="task-card__open"
        type="button"
        onClick={() => onOpen(task.id)}
        aria-label={`Open ${task.title}`}
      >
        <span className="task-card__eyebrow">
          <span>{task.id}</span>
          <PriorityBadge priority={task.priority} />
        </span>
        <strong>{task.title}</strong>
        <span className="task-card__tag">{task.tag}</span>
        <span className="task-card__meta">
          <Avatar ownerId={task.owner} size="small" />
          <span>{task.points} pts</span>
          <span className="task-card__date">{task.due}</span>
        </span>
      </button>
    </article>
  );
}

function Board({ tasks, onOpen, onMove, search, priority, onClearFilters }) {
  const [draggedTask, setDraggedTask] = useState(null);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !normalizedSearch ||
      `${task.id} ${task.title} ${task.tag}`
        .toLowerCase()
        .includes(normalizedSearch);
    const matchesPriority = priority === "all" || task.priority === priority;
    return matchesSearch && matchesPriority;
  });

  function handleDragStart(event, taskId) {
    setDraggedTask(taskId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", taskId);
  }

  function handleDrop(event, status) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain") || draggedTask;
    if (taskId) onMove(taskId, status);
    setDraggedTask(null);
  }

  return (
    <section className="board" aria-label="Sprint board">
      {columns.map((column) => {
        const columnTasks = filteredTasks.filter(
          (task) => task.status === column.id,
        );
        return (
          <div
            className={`board-column board-column--${column.tone}`}
            key={column.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, column.id)}
          >
            <header className="board-column__header">
              <span className="board-column__marker" aria-hidden="true" />
              <span>
                <strong>{column.title}</strong>
                <small>{column.hint}</small>
              </span>
              <span className="board-column__count">{columnTasks.length}</span>
            </header>
            <div className="board-column__body">
              {columnTasks.map((task) => (
                <TaskCard
                  task={task}
                  key={task.id}
                  onOpen={onOpen}
                  onDragStart={handleDragStart}
                />
              ))}
              {columnTasks.length === 0 && (
                <div className="empty-column">
                  <span>Drop a task here</span>
                  {(search || priority !== "all") && (
                    <button type="button" onClick={onClearFilters}>
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function Insights({ tasks }) {
  const completed = tasks.filter((task) => task.status === "done").length;
  const progress = Math.round((completed / tasks.length) * 100);
  const totalPoints = tasks.reduce((sum, task) => sum + task.points, 0);
  const completedPoints = tasks
    .filter((task) => task.status === "done")
    .reduce((sum, task) => sum + task.points, 0);
  const maxVelocity = Math.max(...velocity.map((item) => item.value));

  const workload = owners.map((owner) => ({
    ...owner,
    points: tasks
      .filter((task) => task.owner === owner.id && task.status !== "done")
      .reduce((sum, task) => sum + task.points, 0),
  }));
  const maxWorkload = Math.max(...workload.map((item) => item.points), 1);

  return (
    <section className="insights" aria-label="Delivery insights">
      <div className="metric-grid">
        <article className="metric-card metric-card--hero">
          <span className="metric-card__label">Sprint completion</span>
          <div
            className="progress-ring"
            style={{ "--progress": `${progress}%` }}
          >
            <span>{progress}%</span>
          </div>
          <p>
            <strong>{completed}</strong> of {tasks.length} tasks shipped
          </p>
        </article>
        <article className="metric-card">
          <span className="metric-card__label">Delivered points</span>
          <strong className="metric-card__value">{completedPoints}</strong>
          <span className="metric-card__trend">↑ 12% vs last sprint</span>
        </article>
        <article className="metric-card">
          <span className="metric-card__label">Total scope</span>
          <strong className="metric-card__value">{totalPoints}</strong>
          <span className="metric-card__subtle">story points</span>
        </article>
        <article className="metric-card">
          <span className="metric-card__label">Cycle time</span>
          <strong className="metric-card__value">3.4d</strong>
          <span className="metric-card__trend">↓ 0.8d improvement</span>
        </article>
      </div>

      <div className="insight-layout">
        <article className="panel velocity-panel">
          <header className="panel__header">
            <span>
              <small>Delivery trend</small>
              <h2>Team velocity</h2>
            </span>
            <span className="panel__badge">Last 6 sprints</span>
          </header>
          <div className="bar-chart" aria-label="Velocity by sprint">
            {velocity.map((item, index) => (
              <div className="bar-chart__item" key={item.label}>
                <span className="bar-chart__value">{item.value}</span>
                <div
                  className={`bar-chart__bar${
                    index === velocity.length - 1 ? " is-current" : ""
                  }`}
                  style={{ height: `${(item.value / maxVelocity) * 100}%` }}
                />
                <span className="bar-chart__label">{item.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel workload-panel">
          <header className="panel__header">
            <span>
              <small>Capacity</small>
              <h2>Team workload</h2>
            </span>
          </header>
          <div className="workload-list">
            {workload.map((owner) => (
              <div className="workload-row" key={owner.id}>
                <Avatar ownerId={owner.id} />
                <span className="workload-row__name">{owner.name}</span>
                <span className="workload-row__bar">
                  <i
                    style={{
                      width: `${Math.max(
                        8,
                        (owner.points / maxWorkload) * 100,
                      )}%`,
                      "--bar-color": owner.color,
                    }}
                  />
                </span>
                <strong>{owner.points}</strong>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="panel delivery-panel">
        <header className="panel__header">
          <span>
            <small>Live signals</small>
            <h2>Delivery health</h2>
          </span>
          <span className="health-badge">All systems healthy</span>
        </header>
        <div className="health-grid">
          <div>
            <span className="health-dot health-dot--green" />
            <span>
              <strong>Build pipeline</strong>
              <small>42 successful runs</small>
            </span>
            <b>99.8%</b>
          </div>
          <div>
            <span className="health-dot health-dot--blue" />
            <span>
              <strong>Review coverage</strong>
              <small>18 pull requests</small>
            </span>
            <b>94%</b>
          </div>
          <div>
            <span className="health-dot health-dot--orange" />
            <span>
              <strong>Escaped defects</strong>
              <small>Last 30 days</small>
            </span>
            <b>2</b>
          </div>
        </div>
      </article>
    </section>
  );
}

function CreateTaskModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    owner: "elina",
    status: "backlog",
    tag: "Product",
    points: 3,
  });

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) return;
    onCreate({
      ...form,
      title: form.title.trim(),
      description:
        form.description.trim() || "New product task created in the demo.",
      points: Number(form.points),
    });
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <span>
            <small>Create work item</small>
            <h2 id="create-task-title">New task</h2>
          </span>
          <button type="button" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </header>
        <form onSubmit={submit}>
          <label className="field field--wide">
            <span>Task title</span>
            <input
              autoFocus
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="What should the team deliver?"
            />
          </label>
          <label className="field field--wide">
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Add context and an expected outcome"
              rows="3"
            />
          </label>
          <div className="form-grid">
            <label className="field">
              <span>Status</span>
              <select
                value={form.status}
                onChange={(event) => update("status", event.target.value)}
              >
                {columns.map((column) => (
                  <option value={column.id} key={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Priority</span>
              <select
                value={form.priority}
                onChange={(event) => update("priority", event.target.value)}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
            <label className="field">
              <span>Owner</span>
              <select
                value={form.owner}
                onChange={(event) => update("owner", event.target.value)}
              >
                {owners.map((owner) => (
                  <option value={owner.id} key={owner.id}>
                    {owner.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Points</span>
              <select
                value={form.points}
                onChange={(event) => update("points", event.target.value)}
              >
                {[1, 2, 3, 5, 8].map((point) => (
                  <option value={point} key={point}>
                    {point}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <footer className="modal__actions">
            <button
              className="button button--ghost"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="button button--primary" type="submit">
              Create task
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function TaskDrawer({ task, onClose, onUpdate, onDelete }) {
  if (!task) return null;
  const owner = owners.find((item) => item.id === task.owner) ?? owners[0];

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-drawer-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="drawer__header">
          <span className="drawer__id">{task.id}</span>
          <button type="button" onClick={onClose} aria-label="Close task">
            ×
          </button>
        </header>
        <div className="drawer__content">
          <PriorityBadge priority={task.priority} />
          <h2 id="task-drawer-title">{task.title}</h2>
          <p>{task.description}</p>

          <div className="drawer__fields">
            <label className="field">
              <span>Status</span>
              <select
                value={task.status}
                onChange={(event) =>
                  onUpdate(task.id, { status: event.target.value })
                }
              >
                {columns.map((column) => (
                  <option value={column.id} key={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Priority</span>
              <select
                value={task.priority}
                onChange={(event) =>
                  onUpdate(task.id, { priority: event.target.value })
                }
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>

          <div className="drawer__owner">
            <Avatar ownerId={owner.id} />
            <span>
              <small>Owner</small>
              <strong>{owner.name}</strong>
            </span>
          </div>

          <div className="drawer__facts">
            <span>
              <small>Estimate</small>
              <strong>{task.points} points</strong>
            </span>
            <span>
              <small>Due date</small>
              <strong>{task.due}</strong>
            </span>
            <span>
              <small>Area</small>
              <strong>{task.tag}</strong>
            </span>
          </div>

          <div className="activity">
            <h3>Activity</h3>
            <div>
              <Avatar ownerId="elina" size="small" />
              <p>
                <strong>Elina</strong> refined acceptance criteria
                <small>Today, 10:24</small>
              </p>
            </div>
            <div>
              <span className="activity__system">✓</span>
              <p>
                Task added to the current sprint
                <small>Yesterday, 16:08</small>
              </p>
            </div>
          </div>
        </div>
        <footer className="drawer__footer">
          <button
            className="button button--danger"
            type="button"
            onClick={() => onDelete(task.id)}
          >
            Delete task
          </button>
          <button
            className="button button--primary"
            type="button"
            onClick={onClose}
          >
            Done
          </button>
        </footer>
      </aside>
    </div>
  );
}

function Sidebar({ view, onViewChange, theme, onThemeChange }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="/app/" aria-label="Launchpad home">
        <span className="brand__mark">L</span>
        <span>
          <strong>Launchpad</strong>
          <small>Product workspace</small>
        </span>
      </a>

      <nav className="sidebar__nav" aria-label="Demo navigation">
        <button
          className={view === "board" ? "is-active" : ""}
          type="button"
          onClick={() => onViewChange("board")}
        >
          <span>01</span>
          Delivery board
        </button>
        <button
          className={view === "insights" ? "is-active" : ""}
          type="button"
          onClick={() => onViewChange("insights")}
        >
          <span>02</span>
          Insights
        </button>
      </nav>

      <div className="sidebar__team">
        <small>Orbit team</small>
        <div>
          <span className="avatar-stack">
            {owners.slice(0, 4).map((owner) => (
              <Avatar ownerId={owner.id} size="small" key={owner.id} />
            ))}
          </span>
          <span>4 members</span>
        </div>
      </div>

      <div className="sidebar__footer">
        <a
          href="/resume"
          aria-label="Back to 
        resume"
        >
          <span>←</span>
          Resume
        </a>
        <button
          type="button"
          onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          <span>{theme === "dark" ? "☀" : "☾"}</span>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </aside>
  );
}

function ProductDemo() {
  const [tasks, setTasks] = useState(readStoredTasks);
  const [theme, setTheme] = useState(readTheme);
  const [view, setView] = useState("board");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [notice, setNotice] = useState("");

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId),
    [selectedTaskId, tasks],
  );

  const stats = useMemo(() => {
    const done = tasks.filter((task) => task.status === "done").length;
    const active = tasks.filter((task) => task.status === "progress").length;
    const review = tasks.filter((task) => task.status === "review").length;
    return { done, active, review };
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.dataset.appTheme = theme;
    localStorage.setItem(THEME_KEY, theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#111318" : "#f4f6f8");
  }, [theme]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 2200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setCreateOpen(false);
        setSelectedTaskId(null);
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  function moveTask(taskId, status) {
    const target = columns.find((column) => column.id === status);
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status } : task)),
    );
    setNotice(`Task moved to ${target?.title ?? status}`);
  }

  function updateTask(taskId, patch) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, ...patch } : task,
      ),
    );
    setNotice("Task updated");
  }

  function createTask(data) {
    const nextNumber =
      Math.max(
        154,
        ...tasks.map((task) => Number(task.id.split("-")[1]) || 0),
      ) + 1;
    const task = {
      ...data,
      id: `LP-${nextNumber}`,
      due: "Aug 12",
    };
    setTasks((current) => [task, ...current]);
    setCreateOpen(false);
    setSelectedTaskId(task.id);
    setNotice("Task created");
  }

  function deleteTask(taskId) {
    setTasks((current) => current.filter((task) => task.id !== taskId));
    setSelectedTaskId(null);
    setNotice("Task deleted");
  }

  function resetDemo() {
    setTasks(initialTasks);
    setSearch("");
    setPriority("all");
    setNotice("Demo data restored");
  }

  return (
    <div className="product-shell">
      <Sidebar
        view={view}
        onViewChange={setView}
        theme={theme}
        onThemeChange={setTheme}
      />

      <main className="workspace">
        <header className="workspace__topbar">
          <div className="demo-label">
            <span />
            Interactive product demo
          </div>
          <div className="topbar-actions">
            <button className="text-button" type="button" onClick={resetDemo}>
              Reset demo
            </button>
            <button
              className="button button--primary"
              type="button"
              onClick={() => setCreateOpen(true)}
            >
              <span>+</span>
              New task
            </button>
          </div>
        </header>

        <div className="workspace__content">
          <header className="page-heading">
            <div>
              <span className="page-heading__eyebrow">Orbit / Sprint 22</span>
              <h1>
                {view === "board" ? "Delivery board" : "Delivery insights"}
              </h1>
              <p>
                {view === "board"
                  ? "Plan, prioritize, and move work from idea to release."
                  : "Track delivery signals, team capacity, and sprint momentum."}
              </p>
            </div>
            <div className="sprint-summary" aria-label="Sprint summary">
              <span>
                <small>In progress</small>
                <strong>{stats.active}</strong>
              </span>
              <span>
                <small>In review</small>
                <strong>{stats.review}</strong>
              </span>
              <span>
                <small>Shipped</small>
                <strong>{stats.done}</strong>
              </span>
            </div>
          </header>

          {view === "board" && (
            <>
              <div className="board-toolbar">
                <label className="search-field">
                  <span aria-hidden="true">⌕</span>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search tasks or tags"
                    aria-label="Search tasks"
                  />
                </label>
                <div
                  className="filter-group"
                  role="group"
                  aria-label="Priority filter"
                >
                  {["all", "high", "medium", "low"].map((item) => (
                    <button
                      className={priority === item ? "is-active" : ""}
                      type="button"
                      key={item}
                      onClick={() => setPriority(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <span className="drag-hint">Drag cards between columns</span>
              </div>
              <Board
                tasks={tasks}
                onOpen={setSelectedTaskId}
                onMove={moveTask}
                search={search}
                priority={priority}
                onClearFilters={() => {
                  setSearch("");
                  setPriority("all");
                }}
              />
            </>
          )}

          {view === "insights" && <Insights tasks={tasks} />}
        </div>
      </main>

      {createOpen && (
        <CreateTaskModal
          onClose={() => setCreateOpen(false)}
          onCreate={createTask}
        />
      )}
      <TaskDrawer
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
      {notice && (
        <div className="toast" role="status">
          <span>✓</span>
          {notice}
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("product-demo-root")).render(
  <StrictMode>
    <ProductDemo />
  </StrictMode>,
);
