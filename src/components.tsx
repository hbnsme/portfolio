import { categoryFor, type Work } from './data';
import details from './details';

export function SectionHeading({ title, translation }: { title: string; translation: string }) {
  return <div className="section-heading"><h2 lang="en">{title}</h2><span>{translation}</span></div>;
}

export function ProjectList({ entries, curated = false }: { entries: Work[]; curated?: boolean }) {
  return <ol className="project-list">{entries.map((work, index) => (
    <li key={work.id}><a className="project" href={`#/work/${work.id}`}>
      <span className="mono number">{curated ? String(index + 1).padStart(2, '0') : work.number}</span>
      <div>
        <h3>{work.title}</h3>
        {curated ? <>
          <p>{details[work.id].lead}</p>
          <p className="project-attributes"><strong>{work.literaryType ? '篇幅与形式' : '交付'}</strong> · {details[work.id].deliverable}</p>
        </> : <>
          {work.description && <p>{work.description}</p>}
          {work.attributes && <p className="project-attributes">{work.attributes}</p>}
        </>}
      </div>
      <span className="mono category">{work.id === 'content-strategy' ? 'Content Strategy' : categoryFor(work.category)[1]}</span>
      <span className="project-mark" aria-hidden="true">↗</span>
    </a></li>
  ))}</ol>;
}

export function LiteraryArchive({ entries }: { entries: Work[] }) {
  return <ul className="covers">{entries.map(work => (
    <li key={work.id}><a className="cover" href={`#/work/${work.id}`}>
      <span className="mono cover-meta" lang="en">{work.number} / {work.literaryType}</span>
      <h3 className={work.id === 'low-season' ? 'long-title' : undefined}>{work.title.slice(1, -1)}</h3>
      <span className="mono cover-signature">F. Y. L.</span>
    </a></li>
  ))}</ul>;
}
