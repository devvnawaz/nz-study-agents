import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Alert from '@/components/Alert';
import { ChevronDownIcon, ExternalIcon } from '@/components/icons';

interface Source {
  label: string;
  url: string;
}

interface FaqItem {
  question: string;
  answer: string;
  sources?: Source[];
}

interface FaqCategory {
  category: string;
  items: FaqItem[];
}

const INZ = 'Source: Immigration New Zealand';
const SWNZ = 'Source: Study with New Zealand';
const NZTD = 'Source: New Zealand Traveller Declaration';

const SRC = {
  feePaying: { label: INZ, url: 'https://www.immigration.govt.nz/visas/fee-paying-student-visa/' },
  feePanel: { label: INZ, url: 'https://www.immigration.govt.nz/visas/fee-paying-student-visa/#info-panel-1260' },
  family: {
    label: INZ,
    url: 'https://www.immigration.govt.nz/process-to-apply/once-you-have-a-visa/bringing-family-to-new-zealand/bringing-family-on-a-student-visa/',
  },
  offerOfPlace: {
    label: INZ,
    url: 'https://www.immigration.govt.nz/study/for-education-providers/offering-a-place-to-a-student/',
  },
  conditions: {
    label: INZ,
    url: 'https://www.immigration.govt.nz/study/once-you-have-a-student-visa/check-or-change-your-student-visa-conditions/',
  },
  working: {
    label: INZ,
    url: 'https://www.immigration.govt.nz/study/once-you-have-a-student-visa/working-on-a-student-visa/',
  },
  funds: {
    label: INZ,
    url: 'https://www.immigration.govt.nz/process-to-apply/applying-for-a-visa/providing-evidence-and-documents-to-support-your-visa-application/student-fund-requirements/',
  },
  costOfLiving: {
    label: SWNZ,
    url: 'http://naumainz.studywithnewzealand.govt.nz/studying-in-nz/before-your-arrival/cost-of-living',
  },
  traveller: { label: NZTD, url: 'https://www.travellerdeclaration.govt.nz/' },
} satisfies Record<string, Source>;

const categories: FaqCategory[] = [
  {
    category: 'Student Visa Basics',
    items: [
      {
        question: 'What is a Fee Paying Student Visa?',
        answer:
          'A Fee Paying Student Visa generally lets you study full-time in New Zealand at a course you have paid for at an approved education provider. It is one of the common visa options for international students. The exact rules and eligibility can change, so check the official source for the latest details.',
        sources: [SRC.feePaying],
      },
      {
        question: 'Who can apply for a New Zealand student visa?',
        answer:
          'Students who have an offer of place from an approved provider and can usually meet health, character, and financial requirements may be able to apply. Requirements vary by course and situation. Always confirm your eligibility with the official source before applying.',
        sources: [SRC.feePaying],
      },
      {
        question: 'Do I need an offer of place before applying?',
        answer:
          'Generally, you need an offer of place from an approved New Zealand education provider before you apply for a student visa. The offer helps show what you will study and where. Check the official source, as document requirements may change.',
        sources: [SRC.offerOfPlace, SRC.feePaying],
      },
      {
        question: 'How long can I stay on a student visa?',
        answer:
          'The length of a student visa usually depends on your course length and other factors set by Immigration New Zealand. It is not a fixed number for everyone. Check the official source for how visa length is decided.',
        sources: [SRC.feePaying],
      },
      {
        question: 'Can I change my course or institution after getting a visa?',
        answer:
          'You may be able to change your course or provider, but there are usually conditions, and some changes may require a new application or approval. Do not assume a change is automatically allowed. Check or update your visa conditions through the official source first.',
        sources: [SRC.conditions],
      },
    ],
  },
  {
    category: 'Offer of Place and Institution',
    items: [
      {
        question: 'What is an offer of place?',
        answer:
          'An offer of place is generally a formal document from an education provider confirming you have been accepted into a course. It usually includes course and fee details. Check the official source for what a valid offer should contain.',
        sources: [SRC.offerOfPlace],
      },
      {
        question: 'Does the offer need to come from an approved New Zealand education provider?',
        answer:
          'Generally, the offer of place should come from a provider that is approved to enrol international students. This helps your visa application. Confirm provider approval and requirements from the official source.',
        sources: [SRC.offerOfPlace],
      },
      {
        question: 'What should I check before accepting an offer?',
        answer:
          'Before accepting, it is usually wise to check the course details, tuition fees, start dates, and refund terms. Make sure the provider and course match your study plans. When in doubt, verify details directly with the institution.',
        sources: [SRC.offerOfPlace],
      },
      {
        question: 'Should I verify my education agent from the institution’s official website?',
        answer:
          'Yes — it is generally safer to confirm that an agent is authorised by checking the institution’s own official website. Our directory is built from publicly available authorised-agent information, but institutions are the primary source. If you are unsure, verify directly with the institution before making any payment.',
        sources: [SRC.offerOfPlace],
      },
    ],
  },
  {
    category: 'Financial Requirements',
    items: [
      {
        question: 'How much money do I need to show for a New Zealand student visa?',
        answer:
          'The amount usually depends on your course length, tuition, and living costs, and these figures can change. There is no single number that applies to everyone. Check the official student fund requirements for the current amounts.',
        sources: [SRC.funds, SRC.feePanel],
      },
      {
        question: 'What financial documents may be needed?',
        answer:
          'You may need to provide evidence such as bank statements, proof of funds, or sponsorship documents. The exact documents can vary by application. Check the official source for the current list of accepted evidence.',
        sources: [SRC.funds],
      },
      {
        question: 'Can my parents or relatives sponsor me?',
        answer:
          'In many cases a parent or relative may act as a sponsor or provide funds, but there are usually rules about who can sponsor and what evidence is required. Sponsorship is not automatically accepted. Confirm the current rules from the official source.',
        sources: [SRC.funds],
      },
      {
        question: 'How do I prove the source of funds?',
        answer:
          'You generally need to show where your money comes from, such as savings, income, or a sponsor’s funds, with supporting documents. Clear and genuine evidence is usually important. Check the official source for what evidence is accepted.',
        sources: [SRC.funds],
      },
      {
        question: 'Do living costs and tuition fees both need to be considered?',
        answer:
          'Yes — students usually need to account for both tuition fees and living costs when planning finances. Budgeting for only one is generally not enough. Check the official sources for tuition and living cost guidance.',
        sources: [SRC.funds, SRC.costOfLiving],
      },
    ],
  },
  {
    category: 'Work Rights',
    items: [
      {
        question: 'Can I work while studying in New Zealand?',
        answer:
          'Some student visas may allow limited work, but this depends on your visa conditions and course. Not every student is allowed to work. Always check your specific visa conditions from the official source.',
        sources: [SRC.working],
      },
      {
        question: 'How many hours can I work on a student visa?',
        answer:
          'Work hour limits can apply and may change over time, so there is no fixed number that applies to everyone. Your own visa conditions state what you are allowed to do. Check the official source for current work-hour rules.',
        sources: [SRC.working],
      },
      {
        question: 'Can I work full-time during holidays?',
        answer:
          'Some students may be able to work more during scheduled breaks, but this depends on eligibility and visa conditions. It is not guaranteed for everyone. Confirm the current rules from the official source.',
        sources: [SRC.working],
      },
      {
        question: 'Where can I check my visa work conditions?',
        answer:
          'Your work rights are usually shown in your visa conditions. You can check or confirm these through Immigration New Zealand. Use the official source to see the conditions that apply to you.',
        sources: [SRC.conditions, SRC.working],
      },
    ],
  },
  {
    category: 'Bringing Family',
    items: [
      {
        question: 'Can I bring my spouse or partner to New Zealand on a student visa?',
        answer:
          'In some situations a partner may be able to join you, but this depends on your course, visa type, and eligibility. It is not available to every student. Check the official source for family visa rules.',
        sources: [SRC.family],
      },
      {
        question: 'Can my children come with me?',
        answer:
          'Dependent children may be able to come in some cases, but there are usually conditions to meet. This is not automatic for all students. Confirm the current rules from the official source.',
        sources: [SRC.family],
      },
      {
        question: 'Does every student visa allow family members to come?',
        answer:
          'No — not every student visa allows family members to join, and eligibility usually depends on your specific situation. Do not assume family can come without checking. Verify the rules from the official source.',
        sources: [SRC.family],
      },
      {
        question: 'Where should I check family visa rules?',
        answer:
          'The best place to check is Immigration New Zealand’s official guidance on bringing family on a student visa. Rules may change over time. Use the official source for the latest information.',
        sources: [SRC.family],
      },
    ],
  },
  {
    category: 'Visa Conditions',
    items: [
      {
        question: 'What are student visa conditions?',
        answer:
          'Visa conditions are generally the rules attached to your visa, such as where you can study, work limits, and how long you can stay. Following these conditions is usually important. Check the official source to understand your conditions.',
        sources: [SRC.conditions],
      },
      {
        question: 'How can I check my visa conditions?',
        answer:
          'You can usually check your visa conditions through Immigration New Zealand’s official tools and guidance. Your conditions are specific to your visa. Use the official source to view or confirm them.',
        sources: [SRC.conditions],
      },
      {
        question: 'What should I do if I want to change my course, provider, or conditions?',
        answer:
          'If you want to change your course, provider, or conditions, you may need approval or a new application first. Do not make changes assuming they are allowed. Check or change your conditions through the official source.',
        sources: [SRC.conditions],
      },
      {
        question: 'What happens if I break my visa conditions?',
        answer:
          'Breaking visa conditions can have serious consequences, which may affect your ability to stay or study in New Zealand. It is generally important to follow your conditions carefully. For accurate guidance, check the official source or seek advice from a licensed immigration adviser.',
        sources: [SRC.conditions],
      },
    ],
  },
  {
    category: 'Cost of Living',
    items: [
      {
        question: 'How much does it cost to live in New Zealand as a student?',
        answer:
          'Living costs vary by city, lifestyle, and accommodation, and estimates can change over time. There is no single figure that fits every student. Check the official Study with New Zealand guidance for current estimates.',
        sources: [SRC.costOfLiving],
      },
      {
        question: 'What costs should I budget for besides tuition?',
        answer:
          'Besides tuition, you may need to budget for accommodation, food, transport, insurance, and everyday expenses. Costs differ from person to person. Use the official source to help plan a realistic budget.',
        sources: [SRC.costOfLiving],
      },
      {
        question: 'Should I keep extra funds as a safety buffer?',
        answer:
          'It is generally sensible to keep some extra funds for unexpected expenses. A buffer can help if prices rise or plans change. Check the official cost-of-living guidance to plan responsibly.',
        sources: [SRC.costOfLiving],
      },
      {
        question: 'Where can I check estimated living costs?',
        answer:
          'You can check estimated living costs on the official Study with New Zealand website. These estimates may be updated over time. Use the official source for the latest figures.',
        sources: [SRC.costOfLiving],
      },
    ],
  },
  {
    category: 'Travel and Arrival',
    items: [
      {
        question: 'Do I need to complete a New Zealand Traveller Declaration?',
        answer:
          'Travellers to New Zealand may need to complete a New Zealand Traveller Declaration before or during travel. Requirements can change, so do not assume based on old information. Check the official New Zealand Traveller Declaration website before you travel.',
        sources: [SRC.traveller],
      },
      {
        question: 'What should I prepare before travelling to New Zealand?',
        answer:
          'Before travelling, it usually helps to organise your visa, offer of place, financial documents, and any required declarations. Preparing early can reduce stress at the airport. Check official sources for the latest travel requirements.',
        sources: [SRC.traveller, SRC.feePaying],
      },
      {
        question: 'What documents should I carry when travelling?',
        answer:
          'You may want to carry your passport, visa details, offer of place, and important financial and enrolment documents. Requirements can vary, so keep key documents accessible. Confirm current travel requirements from the official sources.',
        sources: [SRC.traveller],
      },
    ],
  },
  {
    category: 'Bangladesh Applicant Preparation',
    items: [
      {
        question: 'What documents should Bangladeshi students prepare carefully?',
        answer:
          'Students usually prepare academic records, English test results, financial documents, and their offer of place carefully and honestly. Accurate, genuine documents are generally important. Check official sources for the current document requirements.',
        sources: [SRC.feePaying, SRC.funds],
      },
      {
        question: 'Why is source of funds important?',
        answer:
          'Source of funds usually matters because you may need to show where your money genuinely comes from. Clear evidence can support your application. Check the official student fund requirements for accepted evidence.',
        sources: [SRC.funds],
      },
      {
        question: 'Why should students verify authorised agents directly from institution websites?',
        answer:
          'Verifying agents directly from an institution’s official website helps you avoid unauthorised or misleading claims. Institutions are the primary source of who is authorised. Our directory supports this, but always confirm with the institution before paying anyone.',
        sources: [SRC.offerOfPlace],
      },
      {
        question: 'What should students do if their preferred institution is not listed in this directory?',
        answer:
          'If your institution is not listed, please check that institution’s official website directly for its authorised education agents or representatives. Our directory may not include every institution or agency, since some do not publish full lists. You can also browse the institutions we have checked so far on our directory.',
        sources: [SRC.offerOfPlace],
      },
    ],
  },
];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function SourceLinks({ sources }: { sources: Source[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
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

export default function FaqPage() {
  return (
    <>
      <Head>
        <title>New Zealand Student Visa FAQ for Bangladeshi Students</title>
        <meta
          name="description"
          content="Common New Zealand student visa questions for Bangladeshi students, with links to official Immigration New Zealand and Study with New Zealand sources."
        />
      </Head>
      <Layout>
        <PageHeader
          eyebrow="Student visa guidance"
          title="New Zealand Student Visa FAQ for Bangladeshi Students"
          subtitle="General guidance for students planning to apply for a New Zealand student visa. Visa rules and requirements can change, so always check Immigration New Zealand and other official sources before you apply."
        />

        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Disclaimer box */}
          <div className="mb-8">
            <Alert variant="warning" title="Disclaimer">
              This page is for general information only and is not immigration advice. New Zealand visa
              rules, financial requirements, work conditions, fees, and travel requirements can change.
              Always verify details from Immigration New Zealand, Study with New Zealand, your
              institution, or a licensed immigration adviser.
            </Alert>
          </div>

          {/* Category jump list */}
          <nav aria-label="FAQ categories" className="mb-10 rounded-2xl border border-ink-200/70 bg-white p-4 shadow-card">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-400">Jump to a category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, index) => (
                <a
                  key={cat.category}
                  href={`#${slugify(cat.category)}`}
                  className="rounded-full border border-ink-200 bg-ink-50 px-3 py-1.5 text-xs font-medium text-ink-700 transition hover:border-accent-300 hover:bg-accent-50 hover:text-accent-800"
                >
                  {index + 1}. {cat.category}
                </a>
              ))}
            </div>
          </nav>

          <div className="space-y-10">
            {categories.map((cat, index) => (
              <section key={cat.category} id={slugify(cat.category)} className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-semibold text-ink-900">
                  {index + 1}. {cat.category}
                </h2>
                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <details
                      key={item.question}
                      className="group rounded-2xl border border-ink-200/70 bg-white shadow-card transition open:shadow-card-hover hover:shadow-card-hover"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2">
                        <span>{item.question}</span>
                        <ChevronDownIcon className="h-5 w-5 flex-shrink-0 text-ink-400 transition group-open:rotate-180 group-open:text-accent-600" />
                      </summary>
                      <div className="border-t border-ink-100 px-4 py-3.5">
                        <p className="text-sm leading-relaxed text-ink-600">{item.answer}</p>
                        {item.sources && item.sources.length > 0 && <SourceLinks sources={item.sources} />}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-2xl border border-ink-200/70 bg-ink-50/60 p-5 text-sm leading-relaxed text-ink-600">
            <p>
              Looking for authorised agents? Browse the{' '}
              <Link href="/institutes" className="font-medium text-accent-700 hover:underline">
                institutes directory
              </Link>{' '}
              to see authorised education agents published on official institution websites, and always
              verify directly with the institution before making any payment.
            </p>
          </section>
        </div>
      </Layout>
    </>
  );
}
