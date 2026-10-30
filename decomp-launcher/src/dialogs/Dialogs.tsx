import { Modal } from "@/components/Modal";
import { getGames, getMods } from "@/data/catalog";
import { noop } from "@/lib/noop";
import type { Game } from "@/types";

type CloseProps = { onClose: () => void };

export function DownloadDialog({ onClose }: CloseProps) {
  return (
    <Modal title="Download Decomps" onClose={onClose}>
      <input className="search" placeholder="Search games…" />
      <div className="list">
        {getGames().map((g) => (
          <div className="row-item" key={g.id}>
            <div className="mini-cover">{g.name.charAt(0)}</div>
            <div className="grow">
              <strong>{g.name}</strong>{" "}
              <span className="tag">{g.platform}</span>
              <p className="muted">{g.description}</p>
            </div>
            {g.installed ? (
              <span className="muted">Installed</span>
            ) : (
              <button className="primary" onClick={noop}>
                Install
              </button>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}

export function GuideDialog({ onClose }: CloseProps) {
  return (
    <Modal title="How to install games" onClose={onClose}>
      <ol className="guide">
        <li>
          Click <b>Download Decomps</b> and pick a game from the list.
        </li>
        <li>
          Press <b>Install</b>. The launcher downloads the open-source build for
          you.
        </li>
        <li>
          Some games need files from your own copy of the game. The launcher
          will ask you to select them.{" "}
          <b>We never provide ROMs or game assets.</b>
        </li>
        <li>
          Select the game in your library and press <b>Play</b>.
        </li>
        <li>
          Want mods? Select a game, press <b>Edit</b>, and open the Mods
          section.
        </li>
      </ol>
    </Modal>
  );
}

export function SettingsDialog({ onClose }: CloseProps) {
  return (
    <Modal title="Settings" onClose={onClose}>
      <label className="field">
        Games folder
        <div className="row">
          <input readOnly value="C:\Games\DecompLauncher" />
          <button onClick={noop}>Change…</button>
        </div>
      </label>
      <label className="field">
        <input type="checkbox" defaultChecked /> Check for updates on startup
      </label>
      <label className="field">
        <input type="checkbox" /> Close launcher when a game starts
      </label>
    </Modal>
  );
}

export function EditDialog({ game, onClose }: CloseProps & { game: Game }) {
  const gameMods = getMods(game.id);
  return (
    <Modal title={`Edit: ${game.name}`} onClose={onClose}>
      <p className="muted">
        {game.platform} · {game.version ? `v${game.version}` : "no version"}
      </p>
      <div className="section-head">
        <h3>Mods</h3>
        {game.supportsMods && (
          <button className="primary" onClick={noop}>
            Download mods…
          </button>
        )}
      </div>
      {!game.supportsMods && (
        <p className="muted">This game doesn't support mods.</p>
      )}
      <div className="list">
        {gameMods.map((m) => (
          <div className="row-item" key={m.id}>
            <input type="checkbox" defaultChecked />
            <div className="grow">
              <strong>{m.name}</strong>
              <p className="muted">by {m.author}</p>
            </div>
            <button onClick={noop}>Remove</button>
          </div>
        ))}
        {game.supportsMods && gameMods.length === 0 && (
          <p className="muted">No mods installed.</p>
        )}
      </div>
    </Modal>
  );
}
