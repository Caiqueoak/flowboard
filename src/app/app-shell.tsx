import { useState } from 'react';
import {
  createProject,
  deleteProject,
  updateProject,
  type Project,
  type ProjectInput,
} from '../projects/project';
import { ProjectList } from '../projects/project-list';

export function AppShell() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? null;

  function handleCreateProject(input: ProjectInput) {
    const project = createProject(input);
    setProjects((currentProjects) => [...currentProjects, project]);
    setSelectedProjectId(project.id);
  }

  function handleUpdateProject(projectId: string, input: ProjectInput) {
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === projectId ? updateProject(project, input) : project,
      ),
    );
  }

  function handleDeleteProject(projectId: string) {
    const remainingProjects = deleteProject(projects, projectId);
    setProjects(remainingProjects);

    if (selectedProjectId === projectId) {
      setSelectedProjectId(remainingProjects[0]?.id ?? null);
    }
  }

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
          <h1 id="workspace-title">Give every project a clear next step.</h1>
          <p className="intro-copy">
            Keep your work together and see what needs your attention next.
          </p>
        </section>

        <div className="project-layout">
          <ProjectList
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelect={setSelectedProjectId}
            onCreate={handleCreateProject}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
          />

          {selectedProject ? (
            <section className="project-overview" aria-labelledby="project-title">
              <p className="eyebrow">SELECTED PROJECT</p>
              <h2 id="project-title">{selectedProject.name}</h2>
              {selectedProject.description ? (
                <p className="project-description">{selectedProject.description}</p>
              ) : (
                <p className="project-placeholder">
                  Your tasks will have a home here.
                </p>
              )}
            </section>
          ) : (
            <section className="project-overview project-overview-empty" aria-live="polite">
              <div className="empty-mark" aria-hidden="true">
                <span className="empty-mark-line" />
                <span className="empty-mark-dot" />
              </div>
              <div className="empty-copy">
                <p className="eyebrow">A CLEAR START</p>
                <h2>Your projects will live here.</h2>
                <p>
                  Create a project to give its tasks a place, then move each one
                  forward at your own pace.
                </p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
