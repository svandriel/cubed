import './App.scss';

import { Card, Container, Row, Col } from 'react-bootstrap';

import { ThreeView } from './ThreeView';

function App(): JSX.Element {
  return (
    <div className="App py-3">
      <Container className="h-100">
        <Card bg="dark" text="light" className="h-100">
          <Card.Header as={Row}>
            <Col xs={4}>
              <h1>Cubed</h1>
              <p className="text-muted my-0 small">
                A Rubik&apos;s cube simulation in Three.js.
                <br />
                <a href="https://github.com/svandriel/cubed" target="_blank" rel="noreferrer">
                  Github source
                </a>
              </p>
            </Col>
            <Col
              className="text-end"
              style={{
                fontSize: '0.7rem',
              }}
            >
              <p className="my-0">
                <span className="text-muted">Arrow keys:</span> Rotate sides
              </p>
              <p className="my-0">
                <span className="text-muted">Shift+arrow keys:</span> Inverse side rotation
              </p>
              <p className="my-0">
                <span className="text-muted">Alt+arrow keys:</span> Rotate entire cube
              </p>
              <p className="my-0">
                <span className="text-muted">Autoscramble:</span> Use the <em>Controls</em> menu
              </p>
              <p className="my-0">
                <span className="text-muted">Cubemap credit:</span>{' '}
                <a
                  href="https://humus.name/index.php?page=Textures&ID=139"
                  target="_blank"
                  rel="noreferrer"
                >
                  Humus
                </a>
              </p>
            </Col>
          </Card.Header>
          <Card.Body>
            <ThreeView />
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default App;
