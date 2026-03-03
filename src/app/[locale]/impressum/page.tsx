export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">Impressum</h1>

      <div className="mt-6 space-y-6 text-slate-700 text-sm leading-7">
        
        <section>
          <h2 className="font-semibold text-slate-900">
            Angaben gemäß § 5 TMG
          </h2>
          <p className="mt-2">
            Change-Werkstatt Sahil<br />
            Seref Sahil<br />
            Wiesendorfstraße 6<br />
            73433 Aalen<br />
            Deutschland
          </p>
        </section>

        <section>
          <p>
            <strong>Telefon:</strong> +49 176 84076507<br />
            <strong>E-Mail:</strong>{" "}
            <a
              href="mailto:seref.sahil@change-werkstatt-sahil.com"
              className="underline"
            >
              seref.sahil@change-werkstatt-sahil.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">
            Freiberufliche Tätigkeit
          </h2>
          <p className="mt-2">
            Freiberufliche Beratung zu Organisationsentwicklung, Führung und
            Transformationsprozessen.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">
            Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG
          </h2>
          <p className="mt-2">DE460120074</p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p className="mt-2">
            Seref Sahil<br />
            Wiesendorfstraße 6<br />
            73433 Aalen
          </p>
        </section>

      </div>
    </div>
  );
}
