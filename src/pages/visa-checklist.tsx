import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Alert from '@/components/Alert';
import { ExternalIcon } from '@/components/icons';

type StudyLevel = 'bachelors' | 'masters';
type FamilySituation = 'solo' | 'spouse' | 'spouse-children';

interface Source {
  label: string;
  url: string;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  /** Restrict to study levels; undefined = all levels. */
  levels?: StudyLevel[];
  /** Restrict to family situations; undefined = all situations. */
  family?: FamilySituation[];
  sources?: Source[];
}

interface ChecklistSection {
  section: string;
  /** Section only shown for these family situations; undefined = always. */
  family?: FamilySituation[];
  items: ChecklistItem[];
}

const INZ = 'Source: Immigration New Zealand';
const NZTD = 'Source: New Zealand Traveller Declaration';

const SRC = {
  feePaying: { label: INZ, url: 'https://www.immigration.govt.nz/visas/fee-paying-student-visa/' },
  offerOfPlace: {
    label: INZ,
    url: 'https://www.immigration.govt.nz/study/for-education-providers/offering-a-place-to-a-student/',
  },
  funds: {
    label: INZ,
    url: 'https://www.immigration.govt.nz/process-to-apply/applying-for-a-visa/providing-evidence-and-documents-to-support-your-visa-application/student-fund-requirements/',
  },
  health: {
    label: INZ,
    url: 'https://www.immigration.govt.nz/process-to-apply/applying-for-a-visa/providing-evidence-and-documents-to-support-your-visa-application/health-requirements/who-needs-an-x-ray-or-medical-examination/',
  },
  police: {
    label: INZ,
    url: 'https://www.immigration.govt.nz/process-to-apply/applying-for-a-visa/providing-evidence-and-documents-to-support-your-visa-application/good-character-requirements-and-police-certificates/get-a-police-certificate/',
  },
  working: {
    label: INZ,
    url: 'https://www.immigration.govt.nz/study/once-you-have-a-student-visa/working-on-a-student-visa/',
  },
  family: {
    label: INZ,
    url: 'https://www.immigration.govt.nz/process-to-apply/once-you-have-a-visa/bringing-family-to-new-zealand/bringing-family-on-a-student-visa/',
  },
  partnerWork: { label: INZ, url: 'https://immigration.govt.nz/visas/partner-of-a-student-work-visa' },
  partnerVisitor: { label: INZ, url: 'https://immigration.govt.nz/visas/partner-of-a-student-visitor-visa' },
  childVisitor: { label: INZ, url: 'https://immigration.govt.nz/visas/child-of-a-student-visitor-visa' },
  childStudent: { label: INZ, url: 'https://immigration.govt.nz/visas/dependent-child-student-visa' },
  traveller: { label: NZTD, url: 'https://www.travellerdeclaration.govt.nz/' },
} satisfies Record<string, Source>;

const SECTIONS: ChecklistSection[] = [
  {
    section: 'Identity and Application',
    items: [
      {
        id: 'passport',
        title: 'Valid passport',
        description:
          'Your passport generally needs to be valid for at least 3 months after the date you plan to leave New Zealand. Renew early if it is close to expiring, as airlines may refuse check-in on a near-expiry passport.',
        sources: [SRC.feePaying],
      },
      {
        id: 'photo',
        title: 'Acceptable photo',
        description:
          'You may need a photo that meets New Zealand visa photo requirements for your online application. Check the current photo rules before you upload.',
        sources: [SRC.feePaying],
      },
      {
        id: 'online-account',
        title: 'Online application account',
        description:
          'Student visa applications are generally submitted online, and Immigration New Zealand encourages applying about 3 months before your intended travel date. Set up your online account early and keep your login details safe.',
        sources: [SRC.feePaying],
      },
      {
        id: 'translations',
        title: 'Certified English translations',
        description:
          'Police certificates and medical certificates that are not in English generally need certified English translations, along with scanned copies of the originals. Translating other supporting documents may also help avoid delays.',
        sources: [SRC.feePaying],
      },
    ],
  },
  {
    section: 'Study and Course',
    items: [
      {
        id: 'offer-of-place',
        title: 'Offer of place from an approved provider',
        description:
          'You generally need an offer of place from an approved education provider showing the course name, duration, whether it is full-time, and scheduled holiday dates. The provider usually must be a signatory to the pastoral care Code of Practice.',
        sources: [SRC.feePaying, SRC.offerOfPlace],
      },
      {
        id: 'academic-documents',
        title: 'Academic certificates and transcripts',
        description:
          'Keep your previous academic certificates, transcripts, and mark sheets organised. They may be used to support your academic capability and genuine intention to study.',
        sources: [SRC.feePaying],
      },
      {
        id: 'masters-prior-degree',
        title: "Bachelor's degree documents and study-gap explanation",
        levels: ['masters'],
        description:
          "For master's study, keep your bachelor's degree certificate and full transcripts ready. If you have a gap between finishing your bachelor's and applying, prepare a short, honest explanation of what you did during that time.",
        sources: [SRC.feePaying],
      },
      {
        id: 'english-evidence',
        title: 'English language test results',
        description:
          'English test results (such as IELTS or TOEFL) are generally not mandatory for the visa itself, but they can support your genuine intention to study and are usually required by your institution. Check what your course requires.',
        sources: [SRC.feePaying],
      },
      {
        id: 'genuine-intentions',
        title: 'Evidence of genuine intentions',
        description:
          'You must genuinely intend to study and meet your visa conditions. Be ready to explain your study plan, why you chose your course and New Zealand, and how it fits your future — honestly and in your own words.',
        sources: [SRC.feePaying],
      },
      {
        id: 'work-experience-requirement',
        title: 'Practical work experience evidence (if your course requires it)',
        description:
          'If practical work experience is part of your course, you generally need evidence such as a letter from your provider or a course outline showing the requirement.',
        sources: [SRC.feePaying],
      },
    ],
  },
  {
    section: 'Financial',
    items: [
      {
        id: 'tuition-evidence',
        title: 'Evidence of tuition fees',
        description:
          'You generally need to show you have paid tuition for one course or one year (whichever is shorter), can pay it, or do not need to pay. Evidence can include a provider receipt or letter, or education-loan documents.',
        sources: [SRC.feePaying],
      },
      {
        id: 'living-funds',
        title: 'Funds for living costs',
        description:
          'For tertiary study, Immigration New Zealand generally expects around NZD $20,000 per year (or NZD $1,667 per month for shorter study) — amounts can change, so check the official source. Evidence can include bank statements, fixed-term deposits, a scholarship, or an education loan with its sanction letter.',
        sources: [SRC.funds, SRC.feePaying],
      },
      {
        id: 'source-of-funds',
        title: 'Genuine source of funds',
        description:
          'Your money generally needs to come from a genuine source that can be confirmed. Prepare documents that clearly show where the funds came from, such as income records, savings history, or loan documents.',
        sources: [SRC.funds, SRC.feePaying],
      },
      {
        id: 'sponsor-documents',
        title: 'Sponsorship or financial undertaking documents (if applicable)',
        description:
          'If someone else supports you financially, you may need a sponsor sharing ID or a completed Financial Undertaking for a Student form. Note for Bangladeshi applicants applying in South Asia: generally only immediate family (partner, parents, siblings, grandparents, parents-in-law) can sponsor or provide a financial undertaking.',
        sources: [SRC.feePaying],
      },
      {
        id: 'subsequent-years-plan',
        title: 'Plan for funding later years (multi-year study)',
        description:
          'If your study lasts more than one year, a credible plan for paying future tuition and living costs — for example, evidence of family income — can strengthen your application. You do not generally need to hold all of that money now.',
        sources: [SRC.feePaying],
      },
    ],
  },
  {
    section: 'Health and Character',
    items: [
      {
        id: 'chest-xray',
        title: 'Chest X-ray certificate (if required)',
        description:
          'If you will stay more than 6 months and are from — or have spent time in — a country that is not classed as low-incidence for tuberculosis, you generally need a chest X-ray. Certificates usually must be less than 3 months old when received, so time your appointment carefully.',
        sources: [SRC.health, SRC.feePaying],
      },
      {
        id: 'medical-examination',
        title: 'Medical examination (if required)',
        description:
          'Stays over 12 months may require a medical certificate, and Immigration New Zealand can request one at any time. Use an approved panel physician and keep the eMedical reference code from your clinic.',
        sources: [SRC.health, SRC.feePaying],
      },
      {
        id: 'police-certificate',
        title: 'Police certificate(s) (if required)',
        description:
          'If you are 17 or older and your total time in New Zealand will be 24 months or longer, you generally need police certificates less than 6 months old — from your country of citizenship and any country where you have spent more than 5 years since turning 17.',
        sources: [SRC.police, SRC.feePaying],
      },
    ],
  },
  {
    section: 'Insurance, Travel and Arrival',
    items: [
      {
        id: 'insurance',
        title: 'Medical and travel insurance',
        description:
          'You generally must have insurance acceptable to your education provider covering your whole stay — it is a condition of the visa. Your provider will tell you what the policy must cover or may arrange it for you.',
        sources: [SRC.feePaying],
      },
      {
        id: 'onward-travel',
        title: 'Onward travel ticket or funds',
        description:
          'You generally need a ticket out of New Zealand at the end of your stay, or evidence you can pay for one — and this money must be in addition to your living funds.',
        sources: [SRC.feePaying],
      },
      {
        id: 'traveller-declaration',
        title: 'New Zealand Traveller Declaration',
        description:
          'Everyone entering New Zealand must complete a New Zealand Traveller Declaration. If travelling by air, you can generally submit it from 24 hours before your journey begins.',
        sources: [SRC.traveller, SRC.feePaying],
      },
      {
        id: 'work-conditions',
        title: 'Know your work rights before working',
        description:
          'Student visas generally allow up to 25 hours of work per week during study and full-time work in scheduled holidays, depending on your visa conditions. To get full-time holiday work rights you may need to show your course is worth 120 credits and provide holiday dates.',
        sources: [SRC.working, SRC.feePaying],
      },
    ],
  },
  {
    section: 'Partner / Spouse',
    family: ['spouse', 'spouse-children'],
    items: [
      {
        id: 'family-separate-applications',
        title: 'Understand that your partner applies separately',
        description:
          'You generally cannot include your partner in your student visa application. They apply for their own visa based on their relationship to you, and their visa usually expires at the same time as yours.',
        sources: [SRC.family],
      },
      {
        id: 'partner-visa-option-bachelors',
        title: "Check which visa your partner can apply for (bachelor's)",
        levels: ['bachelors'],
        description:
          "As a bachelor's-level student you can generally support a Partner of a Student Visitor Visa. A Partner of a Student Work Visa is usually only possible if your specific qualification is on certain lists (for example, Green List-related qualifications) — check the official criteria for your exact course.",
        sources: [SRC.family, SRC.partnerVisitor, SRC.partnerWork],
      },
      {
        id: 'partner-visa-option-masters',
        title: "Check which visa your partner can apply for (master's)",
        levels: ['masters'],
        description:
          "If you are studying a level 9 master's degree, you can generally support a Partner of a Student Work Visa, which may let your partner work in New Zealand. A visitor visa based on your relationship is also an option. Confirm the current criteria before planning.",
        sources: [SRC.family, SRC.partnerWork],
      },
      {
        id: 'relationship-evidence',
        title: 'Marriage certificate and relationship evidence',
        description:
          'Prepare your marriage certificate (with certified English translation if needed) and evidence that your relationship is genuine and stable — such as proof of living together, joint finances, photos over time, and communication records.',
        sources: [SRC.family],
      },
      {
        id: 'partner-documents',
        title: "Partner's own documents",
        description:
          "Your partner generally needs their own valid passport, photos, and — depending on their visa and length of stay — their own health documents (X-ray or medical) and police certificates.",
        sources: [SRC.family, SRC.partnerVisitor],
      },
      {
        id: 'partner-funds',
        title: 'Extra funds for your partner',
        description:
          'Plan additional living-cost funds for your partner on top of your own requirement. Check the specific funds requirement listed for the visa your partner applies for.',
        sources: [SRC.family, SRC.partnerVisitor],
      },
    ],
  },
  {
    section: 'Children',
    family: ['spouse-children'],
    items: [
      {
        id: 'children-visa-option-bachelors',
        title: "Check which visas your children can apply for (bachelor's)",
        levels: ['bachelors'],
        description:
          "As a bachelor's-level student you can generally support a Child of a Student Visitor Visa for your children. Dependent Child Student Visas are usually only supportable by PhD or certain scholarship students, or through a partner who holds a work visa — otherwise school-age children may need to enrol as international fee-paying students.",
        sources: [SRC.family, SRC.childVisitor, SRC.childStudent],
      },
      {
        id: 'children-visa-option-masters',
        title: "Check which visas your children can apply for (master's)",
        levels: ['masters'],
        description:
          "Master's students generally cannot support Dependent Child Student Visas directly, but there is a common route: you get your student visa, your partner gets a Partner of a Student Work Visa, and your children can then apply as dependent children of your partner. A Child of a Student Visitor Visa is also an option. Verify the current rules for your case.",
        sources: [SRC.family, SRC.childStudent, SRC.partnerWork],
      },
      {
        id: 'birth-certificates',
        title: "Children's birth certificates",
        description:
          "Prepare each child's birth certificate showing both parents' names, with certified English translations if they are not in English.",
        sources: [SRC.family],
      },
      {
        id: 'children-documents',
        title: "Children's passports, photos, and health documents",
        description:
          'Each child generally needs their own valid passport and photos, and may need health documents such as a chest X-ray or medical examination depending on age, length of stay, and where they have lived.',
        sources: [SRC.family, SRC.health],
      },
      {
        id: 'children-schooling',
        title: 'Schooling plan for school-age children',
        description:
          "If your children will attend school in New Zealand, check with the school and official sources whether they would be treated as domestic or international fee-paying students — this depends on the visas your family holds and can significantly change costs.",
        sources: [SRC.family],
      },
      {
        id: 'children-funds',
        title: 'Additional funds for each child',
        description:
          'Plan extra living-cost funds for each child on top of your own and your partner’s requirements, and check the funds requirement listed for the visa each child applies for.',
        sources: [SRC.family, SRC.childVisitor],
      },
    ],
  },
];

const STORAGE_KEY = 'nzsp-visa-checklist-v1';

const LEVEL_OPTIONS: { value: StudyLevel; label: string }[] = [
  { value: 'bachelors', label: "Bachelor's" },
  { value: 'masters', label: "Master's" },
];

const FAMILY_OPTIONS: { value: FamilySituation; label: string }[] = [
  { value: 'solo', label: 'Just me' },
  { value: 'spouse', label: 'With spouse/partner' },
  { value: 'spouse-children', label: 'With spouse & children' },
];

function itemApplies(item: ChecklistItem, level: StudyLevel, family: FamilySituation): boolean {
  if (item.levels && !item.levels.includes(level)) return false;
  if (item.family && !item.family.includes(family)) return false;
  return true;
}

function SourceLinks({ sources }: { sources: Source[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
      {sources.map((s) => (
        <a
          key={s.url}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-accent-700 hover:text-accent-900 hover:underline"
        >
          <ExternalIcon className="h-3.5 w-3.5 flex-shrink-0" />
          {s.label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ))}
    </div>
  );
}

export default function VisaChecklistPage() {
  const [level, setLevel] = useState<StudyLevel>('bachelors');
  const [family, setFamily] = useState<FamilySituation>('solo');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  // Restore saved profile + ticks (client only, avoids hydration mismatch).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.level === 'bachelors' || saved.level === 'masters') setLevel(saved.level);
        if (['solo', 'spouse', 'spouse-children'].includes(saved.family)) setFamily(saved.family);
        if (saved.checked && typeof saved.checked === 'object') setChecked(saved.checked);
      }
    } catch {
      // Ignore corrupted storage — start fresh.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ level, family, checked }));
    } catch {
      // Storage may be unavailable (private mode) — checklist still works, just not saved.
    }
  }, [level, family, checked, loaded]);

  const visibleSections = useMemo(
    () =>
      SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((item) => itemApplies(item, level, family)),
      })).filter(
        (section) =>
          section.items.length > 0 && (!section.family || section.family.includes(family))
      ),
    [level, family]
  );

  const visibleItems = useMemo(() => visibleSections.flatMap((s) => s.items), [visibleSections]);
  const doneCount = visibleItems.filter((item) => checked[item.id]).length;

  const toggleItem = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetTicks = () => {
    if (window.confirm('Clear all ticked items?')) setChecked({});
  };

  return (
    <>
      <Head>
        <title>NZ Student Visa Checklist for Bangladeshi Students — New Zealand Study Planner - Bangladesh</title>
        <meta
          name="description"
          content="A preparation checklist for the New Zealand Fee Paying Student Visa for Bangladeshi students — tailored for bachelor's and master's applicants, with or without a spouse and children, linked to official Immigration New Zealand sources."
        />
      </Head>
      <Layout>
        <PageHeader
          eyebrow="Preparation aid"
          title="NZ Student Visa Checklist"
          subtitle="Select your study level and family situation to see a personalised document-preparation checklist, with links to official Immigration New Zealand sources. Your ticks are saved on this device."
        />

        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Alert variant="warning" title="This is a preparation aid — not an official requirements list">
              This checklist is general information for planning, not immigration advice, and it may not
              cover everything for your case. New Zealand visa requirements can change at any time.
              Always confirm the current requirements on the official Immigration New Zealand website,
              with your institution, or with a licensed immigration adviser before applying.
            </Alert>
          </div>

          {/* Profile selector */}
          <section className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-card sm:p-6">
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-ink-700">Study level</p>
                <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Study level">
                  {LEVEL_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setLevel(option.value)}
                      aria-pressed={level === option.value}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 ${
                        level === option.value
                          ? 'bg-accent-600 text-white shadow-sm'
                          : 'border border-ink-300 bg-white text-ink-700 hover:bg-ink-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-ink-700">Who is coming with you?</p>
                <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Family situation">
                  {FAMILY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFamily(option.value)}
                      aria-pressed={family === option.value}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 ${
                        family === option.value
                          ? 'bg-accent-600 text-white shadow-sm'
                          : 'border border-ink-300 bg-white text-ink-700 hover:bg-ink-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6 border-t border-ink-100 pt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-ink-600">
                  <span className="font-semibold text-ink-900">{doneCount}</span> of{' '}
                  <span className="font-semibold text-ink-900">{visibleItems.length}</span> items prepared
                </p>
                <button
                  type="button"
                  onClick={resetTicks}
                  className="text-xs font-medium text-ink-500 underline transition hover:text-red-600"
                >
                  Reset all ticks
                </button>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-accent-500 transition-all duration-300"
                  style={{ width: visibleItems.length ? `${(doneCount / visibleItems.length) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </section>

          {/* Checklist */}
          <div className="mt-10 space-y-10">
            {visibleSections.map((section, index) => (
              <section key={section.section}>
                <h2 className="mb-3 flex items-center gap-2.5 text-lg font-semibold text-ink-900">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-100 text-xs font-bold text-accent-800">
                    {index + 1}
                  </span>
                  {section.section}
                </h2>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-2xl border bg-white p-4 shadow-card transition sm:p-5 ${
                        checked[item.id] ? 'border-accent-200 bg-accent-50/40' : 'border-ink-200/70'
                      }`}
                    >
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={Boolean(checked[item.id])}
                          onChange={() => toggleItem(item.id)}
                          className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-ink-300 accent-accent-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
                        />
                        <span className="min-w-0">
                          <span
                            className={`block text-sm font-semibold ${
                              checked[item.id] ? 'text-ink-500 line-through decoration-ink-300' : 'text-ink-900'
                            }`}
                          >
                            {item.title}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-ink-600">
                            {item.description}
                          </span>
                        </span>
                      </label>
                      {item.sources && item.sources.length > 0 && (
                        <div className="pl-8">
                          <SourceLinks sources={item.sources} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Related tools */}
          <section className="mt-10 rounded-2xl border border-ink-200/70 bg-ink-50/60 p-5 text-sm leading-relaxed text-ink-600">
            <p>
              Preparing your finances? Try the{' '}
              <Link href="/cost-calculator" className="font-medium text-accent-700 hover:underline">
                study cost calculator
              </Link>
              , browse common questions in the{' '}
              <Link href="/faq" className="font-medium text-accent-700 hover:underline">
                student visa FAQ
              </Link>
              , or practise with{' '}
              <Link href="/interview-questions" className="font-medium text-accent-700 hover:underline">
                sample interview questions
              </Link>
              . Your case may need more or fewer documents than shown here — always verify with official sources.
            </p>
          </section>
        </div>
      </Layout>
    </>
  );
}
