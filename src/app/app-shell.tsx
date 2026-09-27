import { useEffect, useRef, useState } from 'react';
import {
  createProject,
  deleteProject,
  updateProject,
  type Project,
  type ProjectInput,
} from '../projects/project';
import { ProjectList } from '../projects/project-list';
import {
  changeTaskStatus,
  createTask,
  deleteTask,
  updateTask,
  type Task,
  type TaskInput,
  type TaskStatus,
} from '../tasks/task';
import { TaskBoard } from '../tasks/task-board';
import {
  APP_DATA_VERSION,
  loadWorkspace,
  resetWorkspace,
  saveWorkspace,
  type AppData,
} from '../storage/workspace-storage';
import './storage-notice.css';

type StorageStatus = 'loading' | 'ready' | 'unavailable' | 'malformed';

export function AppShell() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [storageStatus, setStorageStatus] = useState<StorageStatus>('loading');
  const [storageMessage, setStorageMessage] = useState('');
  const hasPendingSave = useRef(false);
  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? null;

  useEffect(() => {
    const result = loadWorkspace();

    if (result.status === 'loaded') {
      setProjects(result.data.projects);
      setTasks(result.data.tasks);
      setSelectedProjectId(result.data.projects[0]?.id ?? null);
      setStorageStatus('ready');
      return;
    }

    if (result.status === 'missing') {
      setStorageStatus('ready');
      return;
    }

    if (result.status === 'malformed') {
      setStorageStatus('malformed');
      setStorageMessage(
        'The saved workspace could not be read. Its data was left untouched.',
      );
      return;
    }

    setStorageStatus('unavailable');
    setStorageMessage(
      'Browser storage is unavailable. Changes may only remain until you close or reload this page.',
    );
  }, []);

  useEffect(() => {
    if (
      !hasPendingSave.current ||
      storageStatus === 'loading' ||
      storageStatus === 'malformed'
    ) {
      return;
    }

    hasPendingSave.current = false;
    const appData: AppData = {
      version: APP_DATA_VERSION,
      projects,
      tasks,
    };
    const result = saveWorkspace(appData);

    if (!result.ok) {
      setStorageStatus('unavailable');
      setStorageMessage(
        'Your latest changes are still available on this page, but could not be saved and may be lost after reload.',
      );
      return;
    }

    setStorageStatus('ready');
    setStorageMessage('');
  }, [projects, tasks, storageStatus]);

  function handleCreateProject(input: ProjectInput) {
    const project = createProject(input);
    hasPendingSave.current = true;
    setProjects((currentProjects) => [...currentProjects, project]);
    setSelectedProjectId(project.id);
  }

  function handleUpdateProject(projectId: string, input: ProjectInput) {
    hasPendingSave.current = true;
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === projectId ? updateProject(project, input) : project,
      ),
    );
  }

  function handleDeleteProject(projectId: string) {
    const remainingProjects = deleteProject(projects, projectId);
    hasPendingSave.current = true;
    setProjects(remainingProjects);
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.projectId !== projectId),
    );

    if (selectedProjectId === projectId) {
      setSelectedProjectId(remainingProjects[0]?.id ?? null);
    }
  }

  function handleCreateTask(projectId: string, input: TaskInput) {
    const task = createTask(projectId, input);
    hasPendingSave.current = true;
    setTasks((currentTasks) => [...currentTasks, task]);
  }

  function handleUpdateTask(taskId: string, input: TaskInput) {
    hasPendingSave.current = true;
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? updateTask(task, input) : task,
      ),
    );
  }

  function handleDeleteTask(taskId: string) {
    hasPendingSave.current = true;
    setTasks((currentTasks) => deleteTask(currentTasks, taskId));
  }

  function handleTaskStatusChange(taskId: string, status: TaskStatus) {
    hasPendingSave.current = true;
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? changeTaskStatus(task, status) : task,
      ),
    );
  }

  function handleResetMalformedWorkspace() {
    const confirmed = window.confirm(
      'Reset the unreadable saved workspace? This removes Flowboard data stored in this browser.',
    );
    if (!confirmed) return;

    const result = resetWorkspace();
    if (!result.ok) {
      setStorageMessage(
        'Flowboard could not reset the unreadable saved data. It remains untouched.',
      );
      return;
    }

    hasPendingSave.current = true;
    setProjects([]);
    setTasks([]);
    setSelectedProjectId(null);
    setStorageStatus('ready');
    setStorageMessage('');
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
        {storageMessage && (
          <div
            className={`storage-notice storage-notice-${storageStatus}`}
            role={storageStatus === 'malformed' ? 'alert' : 'status'}
          >
            <p>{storageMessage}</p>
            {storageStatus === 'malformed' && (
              <button
                className="button button-danger-quiet"
                type="button"
                onClick={handleResetMalformedWorkspace}
              >
                Reset saved workspace
              </button>
            )}
          </div>
        )}

        <section className="intro" aria-labelledby="workspace-title">
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1 id="workspace-title">Give every project a clear next step.</h1>
          <p className="intro-copy">
            Keep your work together and see what needs your attention next.
          </p>
        </section>

        {storageStatus === 'loading' ? (
          <p className="workspace-loading" role="status">
            Loading your workspace...
          </p>
        ) : storageStatus === 'malformed' ? (
          <section className="recovery-panel" aria-labelledby="recovery-title">
            <p className="eyebrow">RECOVERY NEEDED</p>
            <h2 id="recovery-title">Your saved workspace is protected.</h2>
            <p>
              Flowboard could not safely open the saved data. Reset it only if
              you are ready to remove it and start with an empty workspace.
            </p>
          </section>
        ) : (
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
                  <p className="project-description">
                    {selectedProject.description}
                  </p>
                ) : (
                  <p className="project-placeholder">
                    Your tasks will have a home here.
                  </p>
                )}
                <TaskBoard
                  key={selectedProject.id}
                  projectId={selectedProject.id}
                  tasks={tasks.filter(
                    (task) => task.projectId === selectedProject.id,
                  )}
                  onCreate={handleCreateTask}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleTaskStatusChange}
                />
              </section>
            ) : (
              <section
                className="project-overview project-overview-empty"
                aria-live="polite"
              >
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
        )}
      </main>
    </div>
  );
}
