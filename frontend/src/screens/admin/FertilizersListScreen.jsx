import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetFertilizersQuery,
  useDeleteFertilizerMutation,
  useCreateFertilizerMutation,
} from '../../slices/fertilizerApiSlice';
import { toast } from 'react-toastify';

const FertilizerListScreen = () => {
  const { pageNumber } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetFertilizersQuery({
    pageNumber,
  });

  console.log(data);

  const [deleteFertilizer, { isLoading: loadingDelete }] = useDeleteFertilizerMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteFertilizer(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createFertilizer, { isLoading: loadingCreate }] = useCreateFertilizerMutation();

  const createFertilizerHandler = async () => {
    if (window.confirm('Are you sure you want to create a new fertilizer?')) {
      try {
        const newFertilizer = await createFertilizer().unwrap();
        refetch();
        navigate(`/admin/fertilizer/${newFertilizer._id}/edit`);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Fertilizers</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createFertilizerHandler}>
            <FaPlus /> Create Fertilizer
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data && data.fertilizers && data.fertilizers.length > 0 ? (
                data.fertilizers.map((fertilizer) => (
                  <tr key={fertilizer._id}>
                    <td>{fertilizer._id}</td>
                    <td>{fertilizer.name}</td>
                    <td>
                      <LinkContainer to={`/admin/fertilizer/${fertilizer._id}/edit`}>
                        <Button variant='light' className='btn-sm mx-2'>
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(fertilizer._id)}
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No fertilizers found</td>
                </tr>
              )}
            </tbody>
          </Table>
          {data && data.pages && data.pages > 1 && (
            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
          )}
        </>
      )}
    </>
  );
};

export default FertilizerListScreen;
