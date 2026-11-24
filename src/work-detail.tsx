import { categoryFor, type Work } from './data';
import details from './details';
import { ReportReader } from './report-reader';
import { imageHref, publishedAssets } from './portfolio-assets';

export function WorkDetail({ work }: { work: Work }) {
  const detail = details[work.id];
  const assets = publishedAssets[work.id];
  return <article className="inner work-detail">
    <a className="mono back" href="#/works">返回作品目录</a>
    <header className="work-header">
      <p className="mono kicker">{work.number} / {categoryFor(work.category)[1]}</p>
      <h1>{work.title}</h1>
      <p className="lead">{detail.lead}</p>
      {detail.note && <p className="work-note">{detail.note}</p>}
    </header>
    <div className="work-body">
      <aside className="work-meta" aria-label="作品信息">
        <dl>
          <dt>类别</dt><dd>{detail.kind ?? categoryFor(work.category)[2]}</dd>
          <dt>个人职责</dt><dd>{detail.role}</dd>
          {detail.methods && <><dt>工具与方法</dt><dd>{detail.methods}</dd></>}
          {detail.theme && <><dt>创作主题</dt><dd>{detail.theme}</dd></>}
          <dt>{work.literaryType ? '篇幅与形式' : '实际交付'}</dt><dd>{detail.deliverable}</dd>
        </dl>
        {detail.github && <a href={detail.github}>GitHub 项目仓库</a>}
      </aside>
      <div className="work-copy">
        {detail.sections.map(([heading, body]) => <section key={heading}>
          <h2>{heading}</h2><p>{body}</p>
        </section>)}
        {detail.figure && <figure className="work-figure">
          <table>
            <caption>整理示意 · {detail.figure.caption}</caption>
            <thead><tr>{detail.figure.columns.map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
            <tbody>{detail.figure.rows.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody>
          </table>
        </figure>}
        {assets && <>
          <section className="visual-evidence" aria-labelledby="evidence-title">
            <h2 id="evidence-title">项目视觉证据</h2>
            {assets.images.map(image => (
              <figure key={image.filename}>
                <a href={imageHref(image)} target="_blank" rel="noopener noreferrer" aria-label={`查看原尺寸：${image.title}`}>
                  <img src={imageHref(image)} alt={image.title} loading="lazy" />
                </a>
                <figcaption><strong>{image.title}</strong><span>{image.caption}</span></figcaption>
              </figure>
            ))}
          </section>
          <ReportReader report={assets.report} />
        </>}
      </div>
    </div>
  </article>;
}
