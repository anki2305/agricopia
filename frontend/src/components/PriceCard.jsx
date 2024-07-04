import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PriceCard = ({ pricelist }) => {
  console.log(pricelist);

  if (!pricelist) {
    return <Card className='my-3 p-3 rounded'>No price data available</Card>;
  }

  return (
    <Card className='my-3 p-3 rounded'>
      {pricelist._id && (
        <Link to={`/priceList/${pricelist._id}`}>
          {pricelist.image && <Card.Img src={pricelist.image} variant='top' />}
        </Link>
      )}

      <Card.Body>
        {pricelist._id && (
          <Link to={`/pricelist/${pricelist._id}`}>
            <Card.Title as='div' className='product-title'>
              <strong>{pricelist.name || 'Unnamed Product'}</strong>
            </Card.Title>
          </Link>
        )}
      </Card.Body>
    </Card>
  );
};

export default PriceCard;