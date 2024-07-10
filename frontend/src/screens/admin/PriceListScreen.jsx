import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';

import {
  useGetPriceListQuery,
  useCreatePriceListMutation,
  useDeletePriceListMutation,
} from '../../slices/priceApiSlice';

import { toast } from 'react-toastify';

const PriceListScreen = () => {
  const { pageNumber } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetPriceListQuery({
    pageNumber,
  });

  console.log(data);

  const [deleteProduct, { isLoading: loadingDelete }] = useDeletePriceListMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createProduct, { isLoading: loadingCreate }] = useCreatePriceListMutation();

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to add a new Price?')) {
      try {
        const newPrice = await createProduct().unwrap();
        refetch();
        navigate(`/admin/price/${newPrice._id}/edit`);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Price List</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <FaPlus /> Add Price
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
                <th>DESCRIPTION</th>
                <th>PRICE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data && data.priceList && data.priceList.length > 0 ? (
                data.priceList.map((priceList) => (
                  <tr key={priceList._id}>
                    <td>{priceList._id}</td>
                    <td>{priceList.name}</td>
                    <td>{priceList.description}</td>
                    <td>₹{priceList.price}</td>
                    <td>
                      <LinkContainer to={`/admin/price/${priceList._id}/edit`}>
                        <Button variant='light' className='btn-sm mx-2'>
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(priceList._id)}
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No Price List found</td> {/* Updated colspan to match the number of columns */}
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

export default PriceListScreen;
