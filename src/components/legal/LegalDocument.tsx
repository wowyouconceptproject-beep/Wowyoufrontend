import type { ReactNode } from "react";

export interface LegalSection {
  title: string;
  content?: ReactNode;
  paragraphs?: string[];
  bullets?: string[];
}

interface LegalDocumentProps {
  sections: LegalSection[];
}

export function LegalDocument({
  sections,
}: LegalDocumentProps) {
  return (
    <div className="space-y-12">
      {sections.map((section, index) => (
        <section
          key={`${section.title}-${index}`}
          className="scroll-mt-24"
        >
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {section.title}
          </h2>

          {section.content && (
            <div className="mt-5">
              {section.content}
            </div>
          )}

          {section.paragraphs?.map(
            (paragraph, paragraphIndex) => (
              <p
                key={paragraphIndex}
                className="mt-5 text-[15px] leading-7 text-white/65"
              >
                {paragraph}
              </p>
            ),
          )}

          {section.bullets &&
            section.bullets.length > 0 && (
              <ul className="mt-5 list-disc space-y-3 pl-6 text-[15px] leading-7 text-white/65">
                {section.bullets.map(
                  (bullet, bulletIndex) => (
                    <li key={bulletIndex}>
                      {bullet}
                    </li>
                  ),
                )}
              </ul>
            )}
        </section>
      ))}
    </div>
  );
}