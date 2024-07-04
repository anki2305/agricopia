import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
} from 'react-bootstrap';

import {
 useGetPriceListDetailsQuery,

} from '../slices/priceApiSlice';

import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

const PriceScreen = () => {
  const { id: priceId } = useParams();

  const {
    data: priceData,
    isLoading,
    refetch,
    error,
  } = useGetPriceListDetailsQuery(priceId);

console.log('price screen');
  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={priceData.name} description={priceData.description} />
          <Row>
            <Col md={6}>
              <Image src={priceData.image} alt={priceData.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{priceData.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  Description: {priceData.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default PriceScreen;
