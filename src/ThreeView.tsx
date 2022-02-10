import './ThreeView.scss';

import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useRafLoop } from 'react-use';
import { Vector2 } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

import { SceneConfig } from './3d/config';
import createRenderer, { RenderContext } from './3d/render';
import { CubeScene } from './3d/scene';
import { Axis } from './domain/axis';
import { Direction } from './domain/direction';
import { Move } from './domain/move';
import { useElementSize } from './hooks/useElementSize';

export function ThreeView(): JSX.Element {
  const mount = useRef<HTMLDivElement>(null);

  const [context, setContext] = useState<RenderContext>();
  const [autoRotate, setAutoRotate] = useState(SceneConfig.autoRotate);

  const { width, height } = useElementSize(mount.current);

  const [stats] = useState(() => {
    const s = Stats();
    s.domElement.classList.add('stats');
    return s;
  });

  const [scene, setScene] = useState<CubeScene | null>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) {
      throw new Error('No element mounted');
    }
    el.focus();
  }, []);

  useEffect(() => {
    const el = mount.current;
    if (!el) {
      throw new Error('No element mounted');
    }
    el.appendChild(stats.domElement);
    return () => {
      el.removeChild(stats.domElement);
    };
  }, [stats]);

  // Initialize render context
  useEffect(() => {
    const el = mount.current;
    if (!el) {
      throw new Error('No element mounted');
    }

    const cubeScene = new CubeScene();
    setScene(cubeScene);

    const ctxt = createRenderer(el.clientWidth, el.clientHeight, cubeScene);
    el.appendChild(ctxt.renderElement);
    el.appendChild(ctxt.guiElement);
    setContext(ctxt);

    ctxt.renderElement.addEventListener('mouseup', e => {
      const { offsetX, offsetY } = e;

      ctxt.onClick(new Vector2(offsetX, offsetY));
    });

    return () => {
      cubeScene.destroy();
      el.removeChild(ctxt.renderElement);
      el.removeChild(ctxt.guiElement);
      ctxt.destroy();
      setContext(undefined);
    };
  }, []);

  // Handle auto rotation
  useEffect(() => {
    if (context) {
      context.autoRotate = autoRotate;
    }
  }, [autoRotate, context]);

  // Handle window resizing
  useEffect(() => {
    context?.onResize(width, height);
  }, [context, width, height]);

  // Handle rendering
  const rafCallback = useCallback(() => {
    stats.begin();
    context?.render();
    stats.end();
  }, [context, stats]);

  useRafLoop(rafCallback);

  function handleKey(e: React.KeyboardEvent<HTMLDivElement>): void {
    if (!context) {
      return;
    }
    const { key } = e;

    switch (key) {
      case ' ':
        setAutoRotate(val => !val);
        e.preventDefault();
        break;
      case 'ArrowUp':
        if (e.altKey) {
          startMove({
            axisName: Axis.X,
            clockwise: e.shiftKey,
          });
        } else {
          startMove({
            side: Direction.PosY,
            clockwise: !e.shiftKey,
          });
        }
        e.preventDefault();
        break;
      case 'ArrowDown':
        if (e.altKey) {
          startMove({
            axisName: Axis.X,
            clockwise: !e.shiftKey,
          });
        } else {
          startMove({
            side: Direction.NegY,
            clockwise: !e.shiftKey,
          });
          e.preventDefault();
        }
        break;
      case 'ArrowRight':
        if (e.altKey) {
          startMove({
            axisName: Axis.Y,
            clockwise: !e.shiftKey,
          });
        } else {
          startMove({
            side: context.rightFacingAxis,
            clockwise: !e.shiftKey,
          });
        }
        e.preventDefault();
        break;
      case 'ArrowLeft':
        if (e.altKey) {
          startMove({
            axisName: Axis.Y,
            clockwise: e.shiftKey,
          });
        } else {
          startMove({
            side: context.leftFacingAxis,
            clockwise: e.shiftKey,
          });
        }
        e.preventDefault();
        break;
      default: {
        // unhandled
        break;
      }
    }
  }

  function startMove(move: Move): void {
    scene?.queueMove(move);
  }

  return (
    <div
      className="ThreeView h-100"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      ref={mount}
      role="img"
      onKeyDown={handleKey}
    >
      <Button
        variant="dark"
        className="fullscreen-button position-absolute end-0 bottom-0 m-2"
        style={{ zIndex: 10000 }}
        onClick={() => {
          mount.current?.requestFullscreen();
          mount.current?.focus();
        }}
      >
        <FontAwesomeIcon icon={faExpand} />
      </Button>
      <Button
        variant="dark"
        className="exit-fullscreen-button position-absolute end-0 bottom-0 m-2"
        style={{ zIndex: 10000 }}
        onClick={() => {
          document.exitFullscreen();
        }}
      >
        <FontAwesomeIcon icon={faCompress} />
      </Button>
    </div>
  );
}
