import React, { useEffect, useState } from 'react';
import {
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
} from './mockSanityLight';

/**
 * React hooks to consume the mock Sanity/Light state.
 *
 * Example:
 * const [sanity, setSanity, toggleSanity] = useSanity();
 * const [light, setLight, inc, dec] = useLight();
 */

export function useSanity(): readonly [boolean, (v: boolean) => void, () => void] {
  const [sanity, setSanityState] = useState<boolean>(getSanity());

  useEffect(() => {
    const unsub = onSanityChange((v) => setSanityState(v));
    return unsub;
  }, []);

  return [sanity, setSanity, toggleSanity] as const;
}

export function useLight(): readonly [number, (v: number) => void, (d?: number) => void, (d?: number) => void] {
  const [light, setLightState] = useState<number>(getLight());

  useEffect(() => {
    const unsub = onLightChange((v) => setLightState(v));
    return unsub;
  }, []);

  return [light, setLight, increaseLight, decreaseLight] as const;
}

export function MockControls(): JSX.Element {
  const [sanity, setSanityVal, toggle] = useSanity();
  const [light, setLightVal, inc, dec] = useLight();

  return (
    <div style={{ padding: 12, border: '1px solid #ccc', borderRadius: 6, display: 'inline-block' }}>
      <div style={{ marginBottom: 8 }}>
        <strong>Sanity:</strong> {sanity ? 'true' : 'false'}
        <div style={{ marginTop: 6 }}>
          <button onClick={() => setSanityVal(true)} style={{ marginRight: 6 }}>Set True</button>
          <button onClick={() => setSanityVal(false)} style={{ marginRight: 6 }}>Set False</button>
          <button onClick={toggle}>Toggle</button>
        </div>
      </div>

      <div>
        <strong>Light:</strong> {light}
        <div style={{ marginTop: 6 }}>
          <button onClick={() => dec(5)} style={{ marginRight: 6 }}>-5</button>
          <button onClick={() => dec()} style={{ marginRight: 6 }}>-1</button>
          <button onClick={() => inc()} style={{ marginRight: 6 }}>+1</button>
          <button onClick={() => inc(5)} style={{ marginRight: 6 }}>+5</button>
          <button onClick={() => setLightVal(50)} style={{ marginLeft: 6 }}>Set 50</button>
        </div>
      </div>
    </div>
  );
}

export { resetMock };
