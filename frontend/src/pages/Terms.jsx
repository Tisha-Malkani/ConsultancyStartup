import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-slate-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Terms of Service</h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Commercial usage terms for NovaConsult website visitors and client portal users.
        </p>
      </section>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm space-y-8">
          {[
            ['Website use', 'The site is intended to present NovaConsult services, simulated case studies, insights, consultation booking, ESG estimates, and client portal functionality.'],
            ['Consultation requests', 'Submitting a request does not create a binding consulting engagement. Engagement terms, scope, fees, and deliverables must be agreed separately in writing.'],
            ['Calculator outputs', 'ESG and performance calculations are indicative estimates based on simplified assumptions. They should not be treated as audited financial, legal, or sustainability advice.'],
            ['Content ownership', 'Website content, brand materials, whitepapers, page design, and simulated assets are provided for NovaConsult presentation and demonstration purposes.'],
            ['Account responsibility', 'Users are responsible for maintaining accurate account details and protecting login credentials. Unauthorized use should be reported promptly.'],
            ['Limitation', 'NovaConsult is not liable for decisions made solely from website content or calculator estimates without a formal advisory engagement.'],
          ].map(([title, text]) => (
            <div key={title}>
              <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
              <p className="text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
          <div className="pt-4">
            <Link to="/services" className="inline-flex bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700">
              Review Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
