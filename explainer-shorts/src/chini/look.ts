// Visual look shared by the Tasik Chini art: 'comic' (black ink) or 'paper' (paper cut-out storybook).
// Set once per render by the shot component before its panels draw.
export const look = {paper: false, ink: '#141414', sw: 5};
export const setLook = (paper: boolean) => {
  look.paper = paper;
  look.ink = paper ? '#ffffff' : '#141414';
  look.sw = paper ? 7 : 5;
};
// Outline colour, and a soft drop shadow under each paper layer.
export const OUT = () => look.ink;
export const SH = () => (look.paper ? 'url(#pp-shadow)' : undefined);
