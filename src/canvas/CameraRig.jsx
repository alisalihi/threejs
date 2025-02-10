import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import state from '../store';

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const updateSize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useFrame((state, delta) => {
    const isBreakpoint = screenSize <= 1260;
    const isMobile = screenSize <= 600;

    let targetPosition = [-0.4, 0, 2];
    if (snap.intro) {
      if (isBreakpoint) targetPosition = [0, 0, 2];
      if (isMobile) targetPosition = [0, 0.2, 2.5];
    } else {
      targetPosition = isMobile ? [0, 0, 2.5] : [0, 0, 2];
    }

    easing.damp3(state.camera.position, targetPosition, 0.25, delta);
    easing.dampE(
      group.current.rotation,
      [state.pointer.y / 10, -state.pointer.x / 5, 0],
      0.25,
      delta
    );
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
