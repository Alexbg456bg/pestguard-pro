import { motion } from 'motion/react';

export const ease = [0.22, 1, 0.36, 1];

// Fades an element up into view once, when it scrolls into the viewport.
export default function Reveal({ as = 'div', delay = 0, y = 28, className, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.9, delay, ease }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// A group whose items fade up one after another as soon as the group scrolls into view.
// Used for rows of cards (also horizontally swipeable ones, whose off-screen items would
// otherwise wait invisible until each one is swiped in).
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export function RevealGroup({ as = 'div', className, stagger = 0.08, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ staggerChildren: stagger }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({ as = 'div', className, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={itemVariants} {...rest}>
      {children}
    </Tag>
  );
}

// Headline whose lines slide up from behind a mask. `lines` is an array of strings/nodes.
// The trigger sits on the visible heading, not on the masked lines (those start clipped,
// so they would never be reported as "in view").
export function MaskLines({ lines, as = 'h2', className, delay = 0, animate }) {
  const Tag = motion[as];
  const trigger = animate === undefined
    ? { whileInView: 'show', viewport: { once: true, margin: '0px 0px -40px 0px' } }
    : { animate: animate ? 'show' : 'hidden' };
  return (
    <Tag className={className} initial="hidden" {...trigger}>
      {lines.map((line, i) => (
        <span className="mask-line" key={i}>
          <motion.span
            className="mask-inner"
            variants={{ hidden: { y: '110%' }, show: { y: '0%' } }}
            transition={{ duration: 1.1, delay: delay + i * 0.1, ease }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function SectionHead({ no, eyebrow, lines, text, center, light, className = '' }) {
  return (
    <div className={`section-head${center ? ' center' : ''}${light ? ' light' : ''} ${className}`}>
      <Reveal className="eyebrow">
        {no && <span className="eyebrow-no">{no}</span>}
        <span>{eyebrow}</span>
      </Reveal>
      <MaskLines lines={lines} />
      {text && <Reveal as="p" delay={0.2}>{text}</Reveal>}
    </div>
  );
}
