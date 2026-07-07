import Alert from './Alert';

export default function Disclaimer() {
  return (
    <Alert variant="info" title="Important — verify before you pay">
      This directory collects publicly available information from official New Zealand institute
      websites. Agent authorizations can change at any time.{' '}
      <strong className="text-ink-900">
        Always confirm an agent&apos;s authorization directly with the institute
      </strong>{' '}
      before signing agreements or making payments.
    </Alert>
  );
}
