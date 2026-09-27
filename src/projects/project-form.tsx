import { useState, type FormEvent } from 'react';
import type { Project, ProjectInput } from './project';

type ProjectFormProps = {
  project?: Project;
  onSave: (input: ProjectInput) => void;
  onCancel: () => void;
};

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [name, setName] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [nameError, setNameError] = useState('');
  const nameFieldId = project ? 'edit-project-name' : 'new-project-name';
  const descriptionFieldId = project
    ? 'edit-project-description'
    : 'new-project-description';
  const nameErrorId = project ? 'edit-project-name-error' : 'new-project-name-error';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError('Enter a project name to continue.');
      return;
    }

    setNameError('');
    onSave({ name: trimmedName, description: description.trim() });
  }

  return (
    <form className="project-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor={nameFieldId}>Project name <span>(required)</span></label>
        <input
          autoFocus
          id={nameFieldId}
          name="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (nameError) setNameError('');
          }}
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? nameErrorId : undefined}
          required
        />
        {nameError && (
          <p className="field-error" id={nameErrorId} role="alert">
            {nameError}
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
          {project ? 'Save changes' : 'Create project'}
        </button>
        <button className="button button-quiet" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
