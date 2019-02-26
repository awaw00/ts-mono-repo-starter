import { listRefProjects, root } from './index';
import { Configuration } from 'webpack';
import * as webpackMerge from 'webpack-merge';

export function webpackConfigCreator (projectName: string) {
  const refProjects = listRefProjects(projectName);
  let config: Configuration = {
    mode: (process.env.NODE_ENV || 'development' as any),
    devtool: 'inline-source-map',
    context: root('lib'),
    entry: `./${projectName}/index.js`,
    output: {
      path: root('packages', projectName, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      alias: {
        '@': '../',
      },
      extensions: ['*', '.js', '.jsx'],
      modules: [
        root('packages', projectName, 'node_modules'),
        ...refProjects.map(project => root('packages', project, 'node_modules')),
      ],
    },
  };

  return {
    create () {
      return config;
    },
    merge (webpackConfig: Configuration) {
      return webpackMerge(config, webpackConfig);
    },
  };
}

