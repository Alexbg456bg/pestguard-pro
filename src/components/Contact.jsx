import { useState } from 'react';
import { motion } from 'motion/react';
import Reveal, { MaskLines } from './Reveal.jsx';
import Icon from './Icon.jsx';
import { company } from '../data/content.js';
import { rich, useLang } from '../i18n/index.jsx';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

export default function Contact() {
  const { t } = useLang();
  const c = t.contact;
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data.botcheck) return;
    // The e-mail to the company is always labelled in Bulgarian; the subject says if it came from the English site
    const subject = `${c.mailSubject} – ${data.town}`;

    // Without a Web3Forms key, fall back to the visitor's e-mail program
    if (!WEB3FORMS_KEY) {
      const body = `Име: ${data.name}\nТелефон: ${data.phone}\nНаселено място: ${data.town}\n\n${data.message}`;
      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject,
          from_name: 'PestGuard Pro – сайт',
          'Име': data.name,
          'Телефон': data.phone,
          'Населено място': data.town,
          'Съобщение': data.message,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="contact" id="contact" data-loop>
      <picture className="contact-bg">
        <source media="(max-width: 640px)" srcSet="img/m-industrial.webp" />
        <img src="img/warehouse-md.webp" alt="" loading="lazy" decoding="async" />
      </picture>
      <div className="contact-overlay" />

      <div className="container cta">
        <Reveal className="eyebrow"><span className="eyebrow-no">09</span><span>{c.eyebrow}</span></Reveal>
        <MaskLines lines={c.lines.map(rich)} className="cta-title" />
        <Reveal delay={0.2}>
          <a href={company.phoneHref} className="cta-phone">
            <span className="cta-phone-icon"><Icon name="phone" size={26} /></span>
            {t.phone}
          </a>
        </Reveal>
      </div>

      <div className="container contact-grid">
        <Reveal className="contact-info">
          <p className="contact-lead">
            {c.lead}
          </p>
          <div className="contact-list">
            <a className="contact-item" href={company.phoneHref}>
              <Icon name="phone" />
              <div><small>{c.phoneLabel} · {t.owner}</small><b>{t.phone}</b></div>
            </a>
            <a className="contact-item" href={company.viberHref}>
              <Icon name="chat" />
              <div><small>Viber</small><b>{company.phoneIntl}</b></div>
            </a>
            <a className="contact-item" href={`mailto:${company.email}`}>
              <Icon name="mail" />
              <div><small>{c.emailLabel}</small><b>{company.email}</b></div>
            </a>
          </div>
        </Reveal>

        <Reveal className="form-card" delay={0.15}>

            {status === 'sent' ? (
              <motion.div
                key="sent"
                className="form-sent"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="sent-icon"><Icon name="check" size={30} /></span>
                <h3>{c.sentTitle}</h3>
                <p>{c.sentText}</p>
                <button className="btn btn-dark" onClick={() => setStatus('idle')}>{c.newRequest}</button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3>{c.formTitle}</h3>
                <p className="form-sub">{c.formSub}</p>
                <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
                <div className="field-row">
                  <label className="field">
                    <span>{c.name}</span>
                    <input name="name" required autoComplete="name" />
                  </label>
                  <label className="field">
                    <span>{c.phone}</span>
                    <input name="phone" type="tel" required autoComplete="tel" />
                  </label>
                </div>
                <label className="field">
                  <span>{c.town}</span>
                  <select name="town" defaultValue={t.townNames[0]} key={t.townNames[0]}>
                    {t.townNames.map((town) => <option key={town}>{town}</option>)}
                    <option>{c.other}</option>
                  </select>
                </label>
                <label className="field">
                  <span>{c.message}</span>
                  <textarea name="message" rows={4} placeholder={c.placeholder} />
                </label>
                <button className="btn btn-gold btn-block" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? c.sending : <>{c.send} <Icon name="send" size={18} /></>}
                </button>
                <p className="form-note">
                  {c.privacy}
                </p>
                {status === 'error' && (
                  <p className="form-error">{c.error} {t.phone}.</p>
                )}
              </motion.form>
            )}

        </Reveal>
      </div>
    </section>
  );
}
