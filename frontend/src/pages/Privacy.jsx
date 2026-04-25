import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-slate-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Privacy Policy</h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          How NovaConsult handles contact, consultation, account, and dashboard information.
        </p>
      </section>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm space-y-8">
          {[
            ['Information we collect', 'We collect details submitted through forms, including name, work email, phone number, company size, service interest, messages, account details, consultation requests, and ESG calculator inputs.'],
            ['How we use information', 'Information is used to respond to enquiries, schedule consultations, personalize dashboard views, model ESG and operational performance, and improve service quality.'],
            ['Data sharing', 'We do not sell personal information. Data may be shared only with service providers required to operate email, hosting, analytics, or customer support workflows.'],
            ['Retention', 'Consultation and dashboard records are retained for business follow-up, auditability, and client service continuity unless deletion is requested.'],
            ['Security', 'The platform uses account authentication and protected API routes for client dashboard data. Production deployments should use secure hosting, HTTPS, environment secrets, and database access controls.'],
            ['Contact', 'Privacy questions can be sent through the contact page or to partnerships.novaconsult@gmail.com.'],
          ].map(([title, text]) => (
            <div key={title}>
              <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
              <p className="text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
          <div className="pt-4">
            <Link to="/contact" className="inline-flex bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700">
              Contact NovaConsult
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
