import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useGetFertilizersQuery } from '../slices/fertilizerApiSlice';
import { useGetPriceListQuery } from '../slices/priceApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Fertilizer from '../components/Fertilizer';
import PriceCard from '../components/PriceCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const {
    data: fertilizersData,
    isLoading: fertilizersLoading,
    error: fertilizersError,
  } = useGetFertilizersQuery({
    keyword,
    pageNumber,
  });

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
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      <Meta />

      {/* Market Demanded Crops Section */}
      <h1>Market Demanded Crops</h1>
      {productsLoading ? (
        <Loader />
      ) : productsError ? (
        <Message variant='danger'>
          {productsError?.data?.message || productsError.error}
        </Message>
      ) : (
        <>
          <Row>
            {productsData.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={productsData.pages}
            page={productsData.page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}

      {/* Fertilizers Section */}
      <h1>Fertilizers</h1>
      {fertilizersLoading ? (
        <Loader />
      ) : fertilizersError ? (
        <Message variant='danger'>
          {fertilizersError?.data?.message || fertilizersError.error}
        </Message>
      ) : (
        <>
          <Row>
            {fertilizersData.fertilizers.map((fertilizer) => (
              <Col key={fertilizer._id} sm={12} md={6} lg={4} xl={3}>
                <Fertilizer fertilizer={fertilizer} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={fertilizersData.pages}
            page={fertilizersData.page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}

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

export default HomeScreen;
