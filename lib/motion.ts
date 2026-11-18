// Motion tokens. Everything animates transform and opacity only.
export const ease = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number], // ease-out-expo, entrances
};
export const dur = { state: 0.2, assemble: 0.7, morph: 0.5 };
export const stagger = 0.06; // section assembly, seconds
export const spring = { stiffness: 300, damping: 30 }; // pointer-driven
export const morphSpring = { type: "spring" as const, stiffness: 300, damping: 34, mass: 0.9 };

export const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: dur.assemble, ease: ease.out, delay: i * stagger } }),
};
