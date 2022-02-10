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
              <p className="my-0 small">A Rubik&apos;s cube simulation in Three.js.</p>
            </Col>
            <Col className="small text-end">
              <p className="my-0">Drag to rotate, use arrow keys to rotate sides.</p>
              <p className="my-0">Shift+arrow key: inverse side rotation</p>
              <p className="my-0">Alt+arrow key: rotate entire cube</p>
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
