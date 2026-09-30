export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // JSON.stringify doesn't escape `<`, so a field value containing the
  // literal text "</script>" (e.g. an admin-entered provider bio or
  // organization description) would close this tag early and let anything
  // after it be parsed as HTML/script. Escaping `<` keeps the payload
  // inside the script element while remaining valid JSON (`<` decodes
  // back to `<` for any JSON-LD consumer).
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
