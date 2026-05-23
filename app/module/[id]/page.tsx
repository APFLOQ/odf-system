"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { fullModulesContent, modulesList } from "@/data/completeModulesData";
import DiscordGate from "@/app/components/DiscordGate";

const moduleMapping: Record<string, string> = {
  "00": "intro",
  "01": "m1",
  "02": "m2",
  "03": "m3",
  "04": "m4",
  "05": "m5",
  "06": "m6",
  "07": "m7",
  "08": "m8",
  "09": "m9",
  "10": "m10",
};

export default function ModulePage() {
  const params = useParams();
  const moduleId = params?.id as string;
  const contentKey = moduleMapping[moduleId] || moduleId;
  const moduleContent = fullModulesContent[contentKey as keyof typeof fullModulesContent];
  const moduleInfo = modulesList.find(m => m.id === moduleId);

  if (!moduleContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Module not found</h1>
          <Link href="/dashboard" className="text-[var(--color-cosmic-violet)] hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let codeLanguage = '';

    lines.forEach((line, i) => {
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
          codeContent = [];
        } else {
          elements.push(
            <div key={`code-${i}`} className="my-6 rounded-lg overflow-hidden bg-[#0b0e16] border border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#161a26] border-b border-[rgba(255,255,255,0.06)]">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                <span className="ml-auto text-xs text-[var(--color-ghost-gray)] uppercase">{codeLanguage || 'code'}</span>
              </div>
              <pre className="p-4 text-sm text-[var(--color-stardust-gray)] overflow-x-auto font-mono">
                {codeContent.join('\n')}
              </pre>
            </div>
          );
          inCodeBlock = false;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      if (line.startsWith('### ')) {
        elements.push(<h4 key={i} className="text-lg font-semibold text-[var(--color-sunflare-yellow)] mt-6 mb-3">{line.replace('### ', '')}</h4>);
      } else if (line.startsWith('## ')) {
        elements.push(<h3 key={i} className="text-xl font-semibold text-[var(--color-holo-white)] mt-6 mb-3">{line.replace('## ', '')}</h3>);
      } else if (line.startsWith('# ')) {
        elements.push(<h2 key={i} className="text-2xl font-bold text-[var(--color-holo-white)] mt-8 mb-4">{line.replace('# ', '')}</h2>);
      } else if (line.startsWith('- ')) {
        elements.push(<li key={i} className="text-[var(--color-stardust-gray)] ml-6 mb-2">{line.replace('- ', '')}</li>);
      } else if (line.startsWith('|')) {
        const cols = line.split('|').filter(c => c.trim());
        if (cols.length > 1 && !line.includes('---')) {
          elements.push(
            <div key={i} className="flex gap-4 py-2 border-b border-[rgba(255,255,255,0.06)]">
              {cols.map((col, j) => (
                <span key={j} className="flex-1 text-[var(--color-stardust-gray)]">{col.trim()}</span>
              ))}
            </div>
          );
        }
      } else if (line.trim() === '') {
        elements.push(<br key={i} />);
      } else if (line.includes('```')) {
        // Already handled above
      } else {
        elements.push(<p key={i} className="text-[var(--color-stardust-gray)] mb-3 leading-relaxed">{line}</p>);
      }
    });

    return elements;
  };

  return (
    <DiscordGate>
      <main className="min-h-screen py-12 px-8 bg-[var(--color-midnight-void)]">
      <div className="max-w-[1000px] mx-auto">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-[var(--color-ghost-gray)] hover:text-white mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <span className="text-[12px] text-[var(--color-cosmic-violet)] uppercase tracking-wider font-mono">
            {moduleContent.phase}
          </span>
        </div>

        <h1 className="text-[40px] font-bold text-[var(--color-holo-white)] mb-6 tracking-tight">
          {moduleContent.title}
        </h1>

        <p className="text-[18px] text-[var(--color-stardust-gray)] mb-10 leading-relaxed max-w-[800px]">
          {moduleInfo?.title}
        </p>

        <div className="space-y-8">
          {moduleContent.topics?.map((topic: any, idx: number) => (
            <div key={idx} className="bg-[#0c0c10] rounded-2xl border border-[rgba(255,255,255,0.08)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                <h2 className="text-[20px] font-semibold text-[var(--color-holo-white)]">
                  {topic.title}
                </h2>
                <span className={`px-3 py-1 text-[10px] font-semibold rounded uppercase ${
                  topic.tag === 'core' ? 'bg-[rgba(59,130,246,0.15)] text-[var(--color-cosmic-violet)]' :
                  topic.tag === 'advanced' ? 'bg-[rgba(239,68,68,0.15)] text-[#f87171]' :
                  topic.tag === 'quant' ? 'bg-[rgba(16,185,129,0.15)] text-[#34d399]' :
                  topic.tag === 'practice' ? 'bg-[rgba(245,158,11,0.15)] text-[#fbbf24]' :
                  topic.tag === 'intro' ? 'bg-[rgba(128,82,255,0.15)] text-[var(--color-cosmic-violet)]' :
                  'bg-[rgba(255,255,255,0.1)] text-[var(--color-ghost-gray)]'
                }`}>
                  {topic.tag || 'topic'}
                </span>
              </div>
              <div className="p-6">
                {renderContent(topic.content)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
    </DiscordGate>
  );
}