import { UiLayout } from '@kikstart/ui';

export const appLayout: UiLayout = {
  brand: {
    logo: 'assets/logo.svg',
    name: 'kikstart.dev',
    product: 'ui-starter',
    separator: '|',
  },
  header: {
    style: 'dark',
    links: [
      { path: 'home', label: 'Home', icon: 'mr-2 fa fa-fw fa-home' },
      { path: 'docs', label: 'Docs', icon: 'mr-2 fa fa-fw fa-book' },
      { path: 'blog', label: 'Blog', icon: 'mr-2 fa fa-fw fa-rss' },
      { path: 'style-guide', label: 'Style Guide', icon: 'mr-2 fa fa-fw fa-paint-brush' },
      { url: 'https://github.com/beeman/kikstart-ui-starter', label: 'GitHub', icon: 'mr-2 fa fa-fw fa-github' },
    ],
  },
  footer: {
    html: `Copyright <a href="">kikstart.dev</a> 2019.`,
    links: [
      { url: 'https://github.com/beeman', label: '', icon: 'fa fa-fw fa-2x fa-github' },
      { url: 'https://twitter.com/beeman_nl', label: '', icon: 'fa fa-fw fa-2x fa-twitter' },
    ],
  },
};
