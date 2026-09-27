export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#workspace" aria-label="Flowboard home">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>flowboard</span>
        </a>
        <span className="workspace-label">Personal workspace</span>
      </header>

      <main id="workspace" className="workspace">
        <section className="intro" aria-labelledby="workspace-title">
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1 id="workspace-title">Make room for focused work.</h1>
          <p className="intro-copy">
            Keep your projects together and see what needs your attention next.
          </p>
        </section>

        <section className="empty-state" aria-labelledby="empty-title">
          <div className="empty-mark" aria-hidden="true">
            <span className="empty-mark-line" />
            <span className="empty-mark-dot" />
          </div>
          <div className="empty-copy">
            <p className="eyebrow">A CLEAR START</p>
            <h2 id="empty-title">Your projects will live here.</h2>
            <p>
              Create a project to give its tasks a place, then move each one
              forward at your own pace.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
