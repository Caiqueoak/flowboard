export type Project = {
  id: string;
  name: string;
  description?: string;
};

export type ProjectInput = {
  name: string;
  description?: string;
};

export function createProject(input: ProjectInput): Project {
  return {
    id: crypto.randomUUID(),
    ...normalizeProjectInput(input),
  };
}

export function updateProject(project: Project, input: ProjectInput): Project {
  return {
    ...project,
    ...normalizeProjectInput(input),
  };
}

export function deleteProject(projects: Project[], projectId: string): Project[] {
  return projects.filter((project) => project.id !== projectId);
}

function normalizeProjectInput(input: ProjectInput): ProjectInput {
  const name = input.name.trim();

  if (!name) {
    throw new Error('Project name is required.');
  }

  const description = input.description?.trim() ?? '';

  return {
    name,
    description,
  };
}
