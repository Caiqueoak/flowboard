import { useState, type FormEvent } from 'react';
import type { Task, TaskInput } from './task';

type TaskFormProps = {
  task?: Task;
  onSave: (input: TaskInput) => void;
  onCancel: () => void;
};

export function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [titleError, setTitleError] = useState('');
  const titleFieldId = task ? 'edit-task-title' : 'new-task-title';
  const descriptionFieldId = task
    ? 'edit-task-description'
    : 'new-task-description';
  const titleErrorId = task ? 'edit-task-title-error' : 'new-task-title-error';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitleError('Enter a task title to continue.');
      return;
    }

    setTitleError('');
    onSave({ title: trimmedTitle, description: description.trim() });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor={titleFieldId}>Task title <span>(required)</span></label>
        <input
          autoFocus
          id={titleFieldId}
          name="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (titleError) setTitleError('');
          }}
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? titleErrorId : undefined}
          required
        />
        {titleError && (
          <p className="field-error" id={titleErrorId} role="alert">
            {titleError}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor={descriptionFieldId}>Description <span>(optional)</span></label>
        <textarea
          id={descriptionFieldId}
          name="description"
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="form-actions">
        <button className="button button-primary" type="submit">
          {task ? 'Save changes' : 'Add task'}
        </button>
        <button className="button button-quiet" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
