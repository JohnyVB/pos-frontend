import { Row, Col, Button } from "react-bootstrap"

interface Props {
  number: string
  addNumber: (number: string) => void
  clear: () => void
}

const Keyboard = ({ number, addNumber, clear }: Props) => {
  return (
    <Row className="g-2 mt-3">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map(n => (
        <Col xs={4} key={n}>
          <Button
            variant="outline-secondary"
            className="w-100 fs-4 py-3 fw-bold shadow-sm"
            onClick={() => addNumber(number + n)}
          >
            {n}
          </Button>
        </Col>
      ))}
      <Col xs={4}>
        <Button 
          variant="danger" 
          className="w-100 fs-4 py-3 fw-bold text-uppercase shadow-sm"
          onClick={clear}
        >
          C
        </Button>
      </Col>
    </Row>
  )
}

export default Keyboard