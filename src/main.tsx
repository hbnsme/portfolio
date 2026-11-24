import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LiteraryArchive, ProjectList, SectionHeading } from './components';
import { categories, collections, profile, works, type Work } from './data';
import { WorkDetail } from './work-detail';
import './styles.css';

const readRoute = () => window.location.hash.slice(1) || '/';
const year = new Date().getFullYear();

function WorkEntries({ entries }: { entries: Work[] }) {
  const projects = entries.filter(work => !work.literaryType);
  const literary = entries.filter(work => work.literaryType);
  return <>{projects.length > 0 && <ProjectList entries={projects} />}{literary.length > 0 && <LiteraryArchive entries={literary} />}</>;
}

function Home() {
  return <>
    <section className="hero" aria-labelledby="hero-title">
      <p className="mono disciplines">Literature / AI / Product</p>
      <h1 id="hero-title" lang="en">Between Words<br /><em>&amp; Worlds.</em></h1>
      <div className="intro">
        <h2>在文字与世界之间。</h2>
        <p><strong>傅宇凌</strong>。{profile}</p>
        <p className="mono identity" lang="en">Peking University · M.A. Student</p>
        <div className="intro-links"><a href="#/works">浏览作品</a><a href="#/about">关于我</a></div>
      </div>
    </section>
    <nav className="curated" aria-labelledby="curated-title">
      <h2 id="curated-title"><span className="mono" lang="en">Curated Portfolios</span><span>定向作品集</span></h2>
      <ul>{collections.map(collection => (
        <li key={collection.id}><a href={`#/collection/${collection.id}`}>
          <span lang="en">{collection.english}</span>
          <span>{collection.title}</span>
          <span className="curated-mark" aria-hidden="true">↗</span>
        </a></li>
      ))}</ul>
    </nav>
    <section className="section"><SectionHeading title="Selected Works" translation="精选项目" />
      <ProjectList entries={works.filter(work => !work.literaryType).slice(0, 4)} />
    </section>
    <section className="section archive"><SectionHeading title="Literary Archive" translation="文学档案" />
      <LiteraryArchive entries={works.filter(work => work.literaryType)} />
    </section>
  </>;
}

function WorksIndex() {
  return <div className="inner">
    <h1 lang="en">Works</h1>
    <nav className="directory" aria-label="作品分类">
      {categories.map(([id, english, chinese]) => <a key={id} href={`#/category/${id}`}>{english}<small>{chinese}</small></a>)}
      <a href="#/about">About<small>关于我</small></a>
    </nav>
    <section className="section"><SectionHeading title="Collections" translation="定向作品集" />
      <nav className="directory" aria-label="定向作品集">
        {collections.map(collection => <a key={collection.id} href={`#/collection/${collection.id}`}>{collection.title}</a>)}
      </nav>
    </section>
    <section className="section"><SectionHeading title="Archive" translation="作品档案" /><WorkEntries entries={works} /></section>
  </div>;
}

function InnerPage({ route }: { route: string }) {
  if (route === '/works') return <WorksIndex />;
  if (route === '/about') return <article className="inner"><p className="mono kicker">关于我</p><h1 lang="en">About</h1><p className="lead">{profile}</p></article>;

  const [, kind, id, extra] = route.split('/');
  const work = !extra && kind === 'work' ? works.find(item => item.id === id) : undefined;
  if (work) return <WorkDetail work={work} />;

  const category = !extra && kind === 'category' ? categories.find(([key]) => key === id) : undefined;
  const collection = !extra && kind === 'collection' ? collections.find(item => item.id === id) : undefined;
  if (category || collection) return <section className="inner">
    <a className="mono back" href="#/works">返回作品目录</a>
    <p className="mono kicker">{category?.[2] ?? '定向作品集'}</p>
    <h1>{category?.[1] ?? collection?.title}</h1>
    {collection
      ? <>
        <header className="collection-intro">
          <p className="collection-subtitle" lang="en">{collection.subtitle}</p>
          <p className="collection-author">傅宇凌 · 北京大学中国语言文学系硕士在读</p>
          <p className="lead">{collection.summary}</p>
          <ul aria-label="核心能力" className="collection-skills">{collection.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
        </header>
        <ProjectList curated entries={collection.workIds.map(id => works.find(work => work.id === id)!)} />
      </>
      : <WorkEntries entries={works.filter(item => item.category === category?.[0])} />}
  </section>;

  return <section className="inner"><h1>页面未找到</h1><a href="#/">返回首页</a></section>;
}

function App() {
  const [route, setRoute] = useState(readRoute);
  const main = useRef<HTMLElement>(null);
  const previousRoute = useRef(route);
  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  useEffect(() => {
    if (previousRoute.current === route) return;
    previousRoute.current = route;
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [route]);

  const active = route === '/' ? '/' : route === '/about' ? '/about' : '/works';

  return <div className="shell">
    <header className="header">
      <a className="brand mono" href="#/">F. Y. L. <span>/</span> Portfolio</a>
      <nav aria-label="主导航">{[['/', 'Index'], ['/works', 'Works'], ['/about', 'About']].map(([path, label]) =>
        <a className="mono" key={path} href={`#${path}`} aria-current={active === path ? 'page' : undefined}>{label}</a>
      )}</nav>
    </header>
    <main ref={main} tabIndex={-1} key={route}>{route === '/' ? <Home /> : <InnerPage route={route} />}</main>
    <footer className="footer mono"><span>F. Y. L. / Portfolio</span><span>© {year}</span><a href="https://github.com/hbnsme">GitHub</a></footer>
  </div>;
}

createRoot(document.getElementById('root')!).render(<App />);
