import * as path from 'path';

export function root (...args: string[]) {
  args.unshift(__dirname, '../../');
  return path.join(...args);
}

export function listRefProjects (projectName: string) {
  const projects: string[] = [];
  const refResolvedProjects: string[] = [];

  const projectConfig = require(`../${projectName}/project.config`).default as { type: string, refs: string[] };

  projectConfig.refs.forEach(refProjectName => {
    if (refResolvedProjects.includes(refProjectName)) {
      return;
    }
    const parentProjects = listRefProjects(refProjectName);
    [...parentProjects, refProjectName].forEach(proj => {
      if (!projects.includes(proj)) {
        projects.push(proj);
      }
    });
    refResolvedProjects.push(refProjectName);
  });

  return projects.reverse();
}
