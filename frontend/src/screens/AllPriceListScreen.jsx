import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetPriceListQuery } from '../slices/priceApiSlice';
import PriceCard from '../components/PriceCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';

const AllPriceScreen = () => {
  const { pageNumber, keyword } = useParams();

  const {
    data: priceData,
    isLoading: priceListLoading,
    error: priceListError,
  } = useGetPriceListQuery({
    keyword,
    pageNumber,
  });

  console.log('Price Data:', priceData);

  return (
    <>
      {/* Market Price Section */}
      <h1>Market Price of Crops</h1>
      {priceListLoading ? (
        <Loader />
      ) : priceListError ? (
        <Message variant='danger'>
          {priceListError?.data?.message || priceListError.error}
        </Message>
      ) : priceData && priceData.priceList ? (
        <>
          <Row>
            {priceData.priceList.map((priceItem) => (
              <Col key={priceItem._id} sm={12} md={6} lg={4} xl={3}>
                <PriceCard pricelist={priceItem} />
              </Col>
            ))}
          </Row>
          {priceData.pages > 1 && (
            <Paginate
              pages={priceData.pages}
              page={priceData.page}
              keyword={keyword ? keyword : ''}
            />
          )}
        </>
      ) : (
        <Message>No price data available</Message>
      )}
    </>
  );
};

export default AllPriceScreen;
