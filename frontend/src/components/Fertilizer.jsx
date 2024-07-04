import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Fertilizer = ({ fertilizer }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/fertilizer/${fertilizer._id}`}>
        <Card.Img src={fertilizer.image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/fertilizer/${fertilizer._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{fertilizer.name}</strong>
          </Card.Title>
        </Link>

      </Card.Body>
    </Card>
  );
};

export default Fertilizer;
