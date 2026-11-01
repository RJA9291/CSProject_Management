// "Scene clock": a scene authored at its design length is played back stretched by k, so
// camera moves and beats keep their choreography while fitting the narration.
import React, {createContext, useContext} from 'react';
import {useCurrentFrame} from 'remotion';

const Clock = createContext(1);

export const SceneClock: React.FC<{k: number; children: React.ReactNode}> = ({k, children}) => <Clock.Provider value={k}>{children}</Clock.Provider>;

/** Current frame in the scene's design timeline (may be fractional). */
export const useSceneFrame = () => {
  const f = useCurrentFrame();
  const k = useContext(Clock);
  return f / k;
};
