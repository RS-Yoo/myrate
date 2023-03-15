import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import Tooltip from "@material-ui/core/Tooltip";

function HorizontalExample() {
    return (
        <Form>
            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">        
            <Col sm={10}>
                <Form.Control type="email" placeholder="Goal Name" />
            </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                <Col sm={10}>
                    <Form.Select aria-label="Default select example">
                        <option>Media Type</option>
                        <option value="Books">Books</option>
                        <option value="Movies">Movies</option>
                        <option value="TV Shows">TV Shows</option>
                    </Form.Select>
                </Col>
            </Form.Group>
            <fieldset>
                <Form.Group as={Row} className="mb-3">
                    <Col sm={10}>
                        <Form.Check
                            type="radio"
                            label="Yearly"
                            name="formHorizontalRadios"
                            id="formHorizontalRadios1"
                        />
                        <Form.Check
                            type="radio"
                            label="Monthly"
                            name="formHorizontalRadios"
                            id="formHorizontalRadios2"
                        />
                        <Form.Check
                            type="radio"
                            label="Daily"
                            name="formHorizontalRadios"
                            id="formHorizontalRadios3"
                        />
                    </Col>
                </Form.Group>
            </fieldset>
            <Tooltip title="Select if this a goal you WANT to achieve. If this is a goal you want to avoid do not select.">
                <Form.Group as={Row} className="mb-3" controlId="formHorizontalCheck">
                    <Col sm={10}>
                        <Form.Check label="Positive Goal" />
                    </Col>
                </Form.Group>
            </Tooltip>

            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">        
            <Col sm={10}>
                <Form.Control type="email" placeholder="Amount" />
            </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                <Col sm={10}>
                    <Form.Select aria-label="Default select example">
                        <option>Measurement</option>
                        <option value="Books">Media Count</option>
                        <option value="Minutes">Minutes</option>
                        <option value="Hours">Hours</option>
                    </Form.Select>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
                <Col sm={{ span: 10, offset: 2 }}>
                    <Button type="submit">Add</Button>
                </Col>
            </Form.Group>
        </Form>
    );
}

export default HorizontalExample;