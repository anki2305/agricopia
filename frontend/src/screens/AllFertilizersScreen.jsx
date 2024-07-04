import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetFertilizersQuery } from '../slices/fertilizerApiSlice';
import Fertilizer from '../components/Fertilizer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';


const AllFertilizers = () => {
  const { pageNumber, keyword } = useParams();



  const {
    data: fertilizersData,
    isLoading: fertilizersLoading,
    error: fertilizersError,
  } = useGetFertilizersQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
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

    </>
  );
};

export default AllFertilizers;
