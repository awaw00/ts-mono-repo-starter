import { addAlias, addPath } from 'module-alias';
import { root, listRefProjects } from './index';

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
