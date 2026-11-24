import { useEffect, useState } from 'react';
import type { PublishedReport } from './portfolio-assets';

export function ReportReader({ report }: { report: PublishedReport }) {
  const [status, setStatus] = useState<'checking' | 'missing' | 'ready'>('checking');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal, cache: 'no-store' } as const;

    async function check() {
      try {
        const response = await fetch(report.href, { ...options, method: 'HEAD' });
        if (!response.ok || !response.headers.get('content-type')?.includes('application/pdf')) {
          throw new Error('Report unavailable');
        }
        setStatus('ready');
      } catch {
        if (!controller.signal.aborted) setStatus('missing');
      }
    }

    void check();
    return () => controller.abort();
  }, [report.href]);

  return <section className="report-reader" aria-labelledby="report-title">
    <h2 id="report-title">完整项目报告</h2>
    {status !== 'ready' ? <p role="status">{{
      checking: '正在检查报告文件…',
      missing: '报告文件不可用，可能已缺失或变更。',
    }[status]}</p> : <>
      <p className="report-filename">{report.filename} · {report.pages} 页</p>
      <div className="report-actions">
        <button type="button" className="report-toggle" aria-expanded={expanded} aria-controls="report-preview"
          onClick={() => setExpanded(open => !open)}>{expanded ? '收起报告' : '查看报告'}</button>
        <a href={report.href} target="_blank" rel="noopener noreferrer">在新标签页打开</a>
        <a href={report.href} download={report.filename}>下载报告</a>
      </div>
      <div id="report-preview" hidden={!expanded}>
        {expanded && <>
          <p className="report-fallback">若浏览器无法内嵌 PDF，请使用上方的新标签页入口。</p>
          <iframe className="pdf-frame" src={report.href} title={`PDF · ${report.filename}`} />
        </>}
      </div>
    </>}
  </section>;
}
