import { useLayoutEffect, useRef, useState } from 'react';
import { TaskForm } from './task-form';
import { TASK_STATUSES, type Task, type TaskInput, type TaskStatus } from './task';
import './task-board.css';

type TaskBoardProps = {
  projectId: string;
  tasks: Task[];
  onCreate: (projectId: string, input: TaskInput) => void;
  onUpdate: (taskId: string, input: TaskInput) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
};

export function TaskBoard({
  projectId,
  tasks,
  onCreate,
  onUpdate,
  onDelete,
  onStatusChange,
}: TaskBoardProps) {
  const [formTask, setFormTask] = useState<Task | 'new' | null>(null);
  const taskStatusToFocus = useRef<string | null>(null);

  useLayoutEffect(() => {
    const taskId = taskStatusToFocus.current;
    if (!taskId) return;

    document.getElementById(`task-status-${taskId}`)?.focus();
    taskStatusToFocus.current = null;
  }, [tasks]);

  function handleSave(input: TaskInput) {
    if (formTask === 'new') {
      onCreate(projectId, input);
    } else if (formTask) {
      onUpdate(formTask.id, input);
    }

    setFormTask(null);
  }

  function handleDelete(task: Task) {
    onDelete(task.id);
    if (formTask !== 'new' && formTask?.id === task.id) {
      setFormTask(null);
    }
  }

  return (
    <section className="task-board-section" aria-labelledby="task-board-heading">
      <div className="task-board-heading">
        <div>
          <p className="eyebrow">KEEP THINGS MOVING</p>
          <h3 id="task-board-heading">Tasks</h3>
        </div>
        {formTask === null && (
          <button
            className="button button-primary"
            type="button"
            onClick={() => setFormTask('new')}
          >
            Add task
          </button>
        )}
      </div>

      {formTask !== null && (
        <div className="task-form-panel">
          <h4>{formTask === 'new' ? 'Add a task' : 'Edit task'}</h4>
          <TaskForm
            key={formTask === 'new' ? 'new-task' : formTask.id}
            task={formTask === 'new' ? undefined : formTask}
            onSave={handleSave}
            onCancel={() => setFormTask(null)}
          />
        </div>
      )}

      <div className="task-columns">
        {TASK_STATUSES.map((status) => {
          const columnTasks = tasks.filter((task) => task.status === status.value);

          return (
            <section
              className="task-column"
              key={status.value}
              aria-labelledby={`tasks-${status.value}-heading`}
            >
              <div className="task-column-heading">
                <h4 id={`tasks-${status.value}-heading`}>{status.label}</h4>
                <span
                  className="task-count"
                  aria-label={`${columnTasks.length} ${columnTasks.length === 1 ? 'task' : 'tasks'}`}
                  aria-live="polite"
                >
                  {columnTasks.length}
                </span>
              </div>

              {columnTasks.length === 0 ? (
                <p className="task-column-empty">No tasks in {status.label}.</p>
              ) : (
                <ul className="task-list">
                  {columnTasks.map((task) => (
                    <li className="task-card" key={task.id}>
                      <div className="task-card-content">
                        <h5>{task.title}</h5>
                        {task.description && <p>{task.description}</p>}
                      </div>
                      <label className="task-status-control">
                        <span>Status</span>
                        <select
                          id={`task-status-${task.id}`}
                          aria-label={`Change status for ${task.title}`}
                          value={task.status}
                          onChange={(event) => {
                            const nextStatus = TASK_STATUSES.find(
                              (candidate) => candidate.value === event.target.value,
                            );
                            if (nextStatus) {
                              taskStatusToFocus.current = task.id;
                              onStatusChange(task.id, nextStatus.value);
                            }
                          }}
                        >
                          {TASK_STATUSES.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="task-card-actions">
                        <button
                          className="button button-quiet button-small"
                          type="button"
                          onClick={() => setFormTask(task)}
                          aria-label={`Edit ${task.title}`}
                        >
                          Edit
                        </button>
                        <button
                          className="button button-danger-quiet button-small"
                          type="button"
                          onClick={() => handleDelete(task)}
                          aria-label={`Delete ${task.title}`}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}
