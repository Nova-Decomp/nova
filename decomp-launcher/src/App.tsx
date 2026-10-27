import {
  ChevronDown,
  ChevronRight,
  CircleUser,
  Copy,
  Download,
  Folder,
  FolderOpen,
  Gamepad2,
  Layers,
  LifeBuoy,
  Link,
  Newspaper,
  Pencil,
  Play,
  RefreshCw,
  Settings,
  Square,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import "./App.css";
import { ToolbarButton, ToolbarMenu } from "@/components/Toolbar";
import { getGames } from "@/data/catalog";
import { DownloadDialog, EditDialog, GuideDialog, SettingsDialog } from "@/dialogs/Dialogs";
import { noop } from "@/lib/noop";
import type { Game } from "@/types";

type DialogName = null | "download" | "settings" | "guide" | "edit";

export default function App() {
  const [dialog, setDialog] = useState<DialogName>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const installed = getGames().filter((g) => g.installed); // set installed:false in catalog.ts to see the welcome screen
  const selected = installed.find((g) => g.id === selectedId) ?? null;

  // group installed games by original platform
  const byPlatform = installed.reduce<Record<string, Game[]>>((acc, g) => {
    (acc[g.platform] ??= []).push(g);
    return acc;
  }, {});
  const groups = Object.entries(byPlatform).sort(([a], [b]) => a.localeCompare(b));

  const toggleGroup = (name: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const ic = 16;
  const sideActions = [
    { icon: <Play size={ic} />, label: "Play", onClick: noop },
    { icon: <Square size={ic} />, label: "Stop", onClick: noop },
    { icon: <Pencil size={ic} />, label: "Edit", onClick: () => setDialog("edit") },
    { icon: <Layers size={ic} />, label: "Change group", onClick: noop },
    { icon: <FolderOpen size={ic} />, label: "Folder", onClick: noop },
    { icon: <Upload size={ic} />, label: "Export", onClick: noop },
    { icon: <Copy size={ic} />, label: "Copy", onClick: noop },
    { icon: <Trash2 size={ic} />, label: "Delete", onClick: noop },
    { icon: <Link size={ic} />, label: "Create shortcut", onClick: noop },
  ];

  return (
    <div className="app">
      <header className="toolbar">
        <ToolbarButton icon={<Download size={20} />} label="Download Decomps" onClick={() => setDialog("download")} />
        <div className="sep" />
        <ToolbarMenu
          icon={<Folder size={20} />}
          label="Folders"
          items={[
            { label: "Games folder", onClick: noop },
            { label: "Mods folder", onClick: noop },
            { label: "Launcher data folder", onClick: noop },
          ]}
        />
        <ToolbarButton icon={<RefreshCw size={20} />} label="Refresh" onClick={noop} />
        
        <div className="spacer" />

        <ToolbarMenu
        icon={<CircleUser size={20} />}
        label="Guest"
        align="right"
        items={[
          { label: "Sign in. . .", onClick: noop},
          { label: "Language", onCLick: noop},
        ]}
      />
    </header>

    <div className="middle">
      <main className="games" onClick={() => setSelectedId}>
        {installed.lenght === 0 ? (
          <div className="welcome">
            Welcome!<br />Click "Download Decomps" to get started.
          </div>
        ) : (
          <div className="groups">
              {groups.map(([name, list]) => {
                const isCollapsed = collapsed.has(name);
                return (
                  <section key={name} className="group">
                    <button
                      className="group-head"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGroup(name);
                      }}
                    >
                      {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                      <span>{name}</span>
                      <span className="group-line" />
                    </button>
                    {!isCollapsed && (
                      <div className="tiles">
                        {list.map((g) => (
                          <div
                            key={g.id}
                            className={"tile" + (g.id === selectedId ? " selected" : "")}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(g.id);
                            }}
                            onDoubleClick={noop}
                          >
                            <div className="title-icon">{g.name.charAt(0)}</div>
                            <div className="title-name">{g.name}</div>
                          </div>
                         ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </main>

        <aside className="side">
          <div className="side-art">
            {selected ? <span className="side-letter">{selected.name.charAt(0)}</span> : <Gamepad2 size={48} />}
          </div>
          <div className="side-actions">
            {sideActions.map((a, i) => (
              <button
              key={a.label}
                className={"side-btn" + (i === 2 ? " gap" : "")}
                disabled={!selected}
                onClick={a.onClick}
              >
                <span className="tb-icon">{a.icon}</span>
                {a.label}
              </button>
          ))}
        </div>
      </aside>
    </div>
     <div className="newsbar">
        <span className="news-left">
          <Newspaper size={14} /> Decomp Launcher 0.1.0: early development
        </span>
        <span>More news…</span>
      </div>
      <footer className="status">
        <span>{selected ? selected.name : "No game selected"}</span>
        <span>Total playtime: 0s</span>
      </footer>

      {dialog === "download" && <DownloadDialog onClose={() => setDialog(null)} />}
      {dialog === "guide" && <GuideDialog onClose={() => setDialog(null)} />}
      {dialog === "settings" && <SettingsDialog onClose={() => setDialog(null)} />}
      {dialog === "edit" && selected && <EditDialog game={selected} onClose={() => setDialog(null)} />}
    </div>
  );
}