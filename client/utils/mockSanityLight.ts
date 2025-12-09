/**
 * TypeScript mock module for `Sanity` and `Light` variables.
 * Provides typed API for programmatic tests and subscriptions.
 *
 * Exports:
 * - getSanity(), setSanity(), toggleSanity(), onSanityChange()
 * - getLight(), setLight(), increaseLight(), decreaseLight(), onLightChange()
 * - resetMock()
 */

export type Sanity = boolean;
export type Light = number;

type SanityCb = (v: Sanity) => void;
type LightCb = (v: Light) => void;

const state: { sanity: Sanity; light: Light } = {
  sanity: true,
  light: 100,
};

const sanitySubscribers = new Set<SanityCb>();
const lightSubscribers = new Set<LightCb>();

function notify<T>(subs: Set<(v: T) => void>, value: T) {
  for (const cb of Array.from(subs)) {
    try {
      cb(value);
    } catch (e) {
      // swallow subscriber errors intentionally
    }
  }
}

// Sanity API
export function getSanity(): Sanity {
  return state.sanity;
}

export function setSanity(value: unknown): void {
  const normalized = Boolean(value) as Sanity;
  if (state.sanity === normalized) return;
  state.sanity = normalized;
  notify<Sanity>(sanitySubscribers, state.sanity);
}

export function toggleSanity(): void {
  setSanity(!state.sanity);
}

export function onSanityChange(cb: SanityCb): () => void {
  sanitySubscribers.add(cb);
  try {
    cb(state.sanity);
  } catch (e) {
    // ignore
  }
  return () => {
    sanitySubscribers.delete(cb);
  };
}

// Light API
export function getLight(): Light {
  return state.light;
}

export function setLight(value: unknown): void {
  const n = Number(value);
  if (Number.isNaN(n)) return;
  const v = Math.max(0, Math.min(100, Math.round(n))) as Light;
  if (state.light === v) return;
  state.light = v;
  notify<Light>(lightSubscribers, state.light);
}

export function increaseLight(delta = 1): void {
  setLight(state.light + Number(delta || 0));
}

export function decreaseLight(delta = 1): void {
  setLight(state.light - Number(delta || 0));
}

export function onLightChange(cb: LightCb): () => void {
  lightSubscribers.add(cb);
  try {
    cb(state.light);
  } catch (e) {
    // ignore
  }
  return () => {
    lightSubscribers.delete(cb);
  };
}

export function resetMock(opts?: { sanity?: Sanity; light?: Light }): void {
  const { sanity = true, light = 100 } = opts || {};
  state.sanity = Boolean(sanity);
  state.light = Math.max(0, Math.min(100, Math.round(Number(light || 0))));
  notify<Sanity>(sanitySubscribers, state.sanity);
  notify<Light>(lightSubscribers, state.light);
}

const defaultExport = {
  getSanity,
  setSanity,
  toggleSanity,
  onSanityChange,
  getLight,
  setLight,
  increaseLight,
  decreaseLight,
  onLightChange,
  resetMock,
} as const;

export default defaultExport;
