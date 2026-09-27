import { useState } from 'react';
import { ProjectForm } from './project-form';
import type { Project, ProjectInput } from './project';

type ProjectListProps = {
  projects: Project[];
  selectedProjectId: string | null;
  onSelect: (projectId: string) => void;
  onCreate: (input: ProjectInput) => void;
  onUpdate: (projectId: string, input: ProjectInput) => void;
  onDelete: (projectId: string) => void;
};

export function ProjectList({
  projects,
  selectedProjectId,
  onSelect,
  onCreate,
  onUpdate,
  onDelete,
}: ProjectListProps) {
  const [formProject, setFormProject] = useState<Project | 'new' | null>(null);

  function handleSave(input: ProjectInput) {
    if (formProject === 'new') {
      onCreate(input);
    } else if (formProject) {
      onUpdate(formProject.id, input);
    }

    setFormProject(null);
  }

  function confirmDelete(project: Project) {
    const confirmed = window.confirm(
      `Delete “${project.name}”? Any tasks in this project will also be removed.`,
    );

    if (confirmed) {
      onDelete(project.id);
      if (formProject !== 'new' && formProject?.id === project.id) {
        setFormProject(null);
      }
    }
  }

  return (
    <section className="project-panel" aria-labelledby="projects-heading">
      <div className="project-panel-heading">
        <div>
          <p className="eyebrow">YOUR COLLECTION</p>
          <h2 id="projects-heading">Projects</h2>
        </div>
        {formProject === null && (
          <button
            className="button button-primary"
            type="button"
            onClick={() => setFormProject('new')}
          >
            New project
          </button>
        )}
      </div>

      {formProject !== null && (
        <div className="project-form-panel">
          <h3>{formProject === 'new' ? 'Create a project' : 'Edit project'}</h3>
          <ProjectForm
            key={formProject === 'new' ? 'new-project' : formProject.id}
            project={formProject === 'new' ? undefined : formProject}
            onSave={handleSave}
            onCancel={() => setFormProject(null)}
          />
        </div>
      )}

      {projects.length === 0 ? (
        <div className="project-list-empty">
          <p>No projects yet. Create one to get started.</p>
        </div>
      ) : (
        <ul className="project-list">
          {projects.map((project) => {
            const isSelected = project.id === selectedProjectId;

            return (
              <li
                className={`project-list-item${isSelected ? ' is-selected' : ''}`}
                key={project.id}
              >
                <button
                  className="project-select"
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelect(project.id)}
                >
                  <span className="project-select-name">{project.name}</span>
                  {project.description && (
                    <span className="project-select-description">
                      {project.description}
                    </span>
                  )}
                </button>
                <div className="project-actions">
                  <button
                    className="button button-quiet button-small"
                    type="button"
                    onClick={() => setFormProject(project)}
                    aria-label={`Edit ${project.name}`}
                  >
                    Edit
                  </button>
                  <button
                    className="button button-danger-quiet button-small"
                    type="button"
                    onClick={() => confirmDelete(project)}
                    aria-label={`Delete ${project.name}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
