import { addAlias, addPath } from 'module-alias';
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

export function enableRefs (projectName: string) {
  addPath(root('packages', projectName, 'node_modules'));

  const refProjects = listRefProjects(projectName);
  refProjects.forEach(project => {
    addPath(root('packages', project, 'node_modules'));
  });
  addAlias('@', '../');
}

export function bootstrapNodeApp (projectName: string, appEntry: string = 'app') {
  enableRefs(projectName);
  require(`../${projectName}/${appEntry}`);
}
