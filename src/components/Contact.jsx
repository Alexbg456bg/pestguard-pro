import { useState } from 'react';
import { motion } from 'motion/react';
import Reveal, { MaskLines } from './Reveal.jsx';
import Icon from './Icon.jsx';
import { company } from '../data/content.js';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

export default function Contact() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data.botcheck) return;
    const subject = `Запитване от сайта – ${data.town}`;

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
    <section className="contact" id="contact">
      <div className="contact-bg"><img src="img/warehouse.webp" alt="" loading="lazy" /></div>
      <div className="contact-overlay" />

      <div className="container cta">
        <Reveal className="eyebrow"><span className="eyebrow-no">09</span><span>Контакт</span></Reveal>
        <MaskLines lines={['Имате проблем', <em key="e">с вредители?</em>]} className="cta-title" />
        <Reveal delay={0.2}>
          <a href={company.phoneHref} className="cta-phone">
            <span className="cta-phone-icon"><Icon name="phone" size={26} /></span>
            {company.phone}
          </a>
        </Reveal>
      </div>

      <div className="container contact-grid">
        <Reveal className="contact-info">
          <p className="contact-lead">
            Най-бързо е по телефона. Можете да ни пишете и във Viber – изпратете снимка на проблема и ще ви
            кажем какво е нужно.
          </p>
          <div className="contact-list">
            <a className="contact-item" href={company.phoneHref}>
              <Icon name="phone" />
              <div><small>Телефон · {company.owner}</small><b>{company.phone}</b></div>
            </a>
            <a className="contact-item" href={company.viberHref}>
              <Icon name="chat" />
              <div><small>Viber</small><b>+359 895 493 333</b></div>
            </a>
            <a className="contact-item" href={`mailto:${company.email}`}>
              <Icon name="mail" />
              <div><small>Имейл</small><b>{company.email}</b></div>
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
                <h3>Благодарим ви!</h3>
                <p>Запитването е изпратено. Ще се свържем с вас възможно най-скоро.</p>
                <button className="btn btn-dark" onClick={() => setStatus('idle')}>Ново запитване</button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3>Изпратете запитване</h3>
                <p className="form-sub">Попълнете формата и ще ви се обадим.</p>
                <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
                <div className="field-row">
                  <label className="field">
                    <span>Име</span>
                    <input name="name" required autoComplete="name" />
                  </label>
                  <label className="field">
                    <span>Телефон</span>
                    <input name="phone" type="tel" required autoComplete="tel" />
                  </label>
                </div>
                <label className="field">
                  <span>Населено място</span>
                  <select name="town" defaultValue={company.towns[0]}>
                    {company.towns.map((t) => <option key={t}>{t}</option>)}
                    <option>Друго</option>
                  </select>
                </label>
                <label className="field">
                  <span>Опишете проблема</span>
                  <textarea name="message" rows={4} placeholder="Напр. хлебарки в кухнята, апартамент 70 кв.м." />
                </label>
                <button className="btn btn-gold btn-block" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Изпращане…' : <>Изпрати запитване <Icon name="send" size={18} /></>}
                </button>
                {status === 'error' && (
                  <p className="form-error">Възникна грешка. Моля, обадете се на {company.phone}.</p>
                )}
              </motion.form>
            )}

        </Reveal>
      </div>
    </section>
  );
}
