import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

interface QuestionGroup {
  category: string;
  items: string[];
}

const groups: QuestionGroup[] = [
  {
    category: 'Identity and Application Details',
    items: [
      'What is your full name?',
      'What is your date of birth?',
      'What is your passport number?',
      'What is your contact number?',
      'What is your application number?',
      'What is your client number?',
      "What is your father's name?",
      "What is your mother's name?",
      "What are your parents' dates of birth and passport numbers?",
      'When did you submit your visa application?',
      'Which course have you applied for?',
      'Which institute have you applied to?',
    ],
  },
  {
    category: 'Academic Background',
    items: [
      'What is your highest academic qualification?',
      'When did you complete your previous studies?',
      'When were your exam results published?',
      'What were your grades, GPA, or CGPA?',
      'Can you explain your educational background?',
      'How is your selected course related to your previous studies?',
      'Did you have any study gap?',
      'What did you do during your study gap?',
      'Do you think you can successfully complete this course?',
    ],
  },
  {
    category: 'English Language Ability',
    items: [
      'Have you taken IELTS, PTE, TOEFL, or any other English language test?',
      'What was your English test score?',
      'When was your test result published?',
      'How will you manage your studies in English?',
    ],
  },
  {
    category: 'Current Employment and Work Experience',
    items: [
      'What are you currently doing?',
      'Are you currently working?',
      'How long have you been working?',
      'What are your job responsibilities?',
      'How is this course relevant to your current work?',
      'How will this course improve your future career plan?',
      'How many employees work in your company?',
      'How many team members work under your supervision?',
      'How many senior team members or supervisors are above you?',
      'Do you receive your salary in cash, by cheque, or through a bank account?',
      'Why do you receive your salary in cash or by cheque?',
      'Who provides your salary?',
      'Do you receive payslips?',
      'Does your employer sign your salary documents before giving them to you or in front of you?',
    ],
  },
  {
    category: 'Country, Institute, and Course Selection',
    items: [
      'Why do you want to study in New Zealand?',
      'Why did you choose New Zealand instead of your home country?',
      'Did you consider any other countries?',
      'Why did you choose this institute?',
      'What do you know about this institute?',
      'Why did you choose this program?',
      'What subjects will you study in this program?',
      'What are the course modules?',
      'What is the duration of the course?',
      'How many credits does the course have?',
      'How many subjects are included in the course?',
      'How many semesters are included in the course?',
      'Which subject or module do you find most interesting?',
      'How is this course connected to your future career plan?',
    ],
  },
  {
    category: 'Offer Letter, Documents, and Application Preparation',
    items: [
      'Who helped you get the offer letter?',
      'Did you receive any immigration advice from anyone?',
      'Did anyone help you arrange your documents?',
      'Did you write your Statement of Purpose yourself?',
      'Do you remember the questions or points you considered before writing your SOP?',
      'Did you pay the application fee yourself?',
      'How did you pay the application fee?',
    ],
  },
  {
    category: 'Financial Support and Sponsorship',
    items: [
      'Who will sponsor your education?',
      'What is the relationship between you and your sponsor?',
      'What does your sponsor do?',
      "What is your sponsor's income?",
      'How will you pay your tuition fees?',
      'How will you pay your living expenses?',
      'How will you cover your overall expenses in New Zealand?',
      'Do you have a bank statement?',
      'Can you explain your financial documents?',
      'Can you explain the source of funds?',
    ],
  },
  {
    category: 'Accommodation and Living Arrangements',
    items: [
      'Where will you stay in New Zealand?',
      'Have you arranged accommodation?',
      'Do you know the cost of living in New Zealand?',
      'How will you manage your living costs?',
      'Do you have any relatives or friends in New Zealand?',
    ],
  },
  {
    category: 'Travel and Immigration History',
    items: [
      'Have you travelled abroad before?',
      'Have you ever been refused a visa?',
      'Have you ever overstayed a visa?',
      'Have you applied for a visa to any other country before?',
    ],
  },
  {
    category: 'Future Plans and Career Goals',
    items: [
      'What are your plans after graduation?',
      'Do you plan to return to your home country after completing your studies?',
      'What job do you want after your studies?',
      'How will this degree help your career?',
      'How will this course help you achieve your future goals?',
    ],
  },
  {
    category: 'Final or General Questions',
    items: [
      'Can you introduce yourself?',
      'Why should we grant you this visa?',
      'What will you do if your visa is rejected?',
      'How confident are you about your study plan?',
      'Is there anything else you would like to explain about your application?',
    ],
  },
];

export default function InterviewQuestionsPage() {
  return (
    <>
      <Head>
        <title>NZ Student Visa Interview Questions — NZ Study Agent Directory Bangladesh</title>
        <meta
          name="description"
          content="Sample questions a visa or case officer may ask Bangladeshi students during a New Zealand student visa interview, grouped by topic to help you prepare."
        />
      </Head>
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="section-title mb-3">NZ student visa interview questions</h1>
          <p className="mb-6 text-sm text-gray-600 leading-relaxed">
            These are common types of questions that a visa officer or case officer may ask during a
            student visa interview or assessment. The questions may vary depending on the applicant&apos;s
            profile, course, financial documents, sponsor, and future plans.
          </p>

          <div className="space-y-8">
            {groups.map((group, index) => (
              <section key={group.category}>
                <h2 className="text-base font-semibold text-gray-900">
                  {index + 1}. {group.category}
                </h2>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-gray-700 leading-relaxed">
                  {group.items.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ol>
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            <p>
              These are <strong>sample preparation questions only</strong> — not official questions and
              not a guarantee of what you will be asked. Always answer honestly and in your own words,
              based on your genuine study plans and documents.
            </p>
          </section>
        </div>
      </Layout>
    </>
  );
}
