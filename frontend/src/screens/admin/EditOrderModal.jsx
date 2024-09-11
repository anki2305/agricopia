import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { usePayOrderMutation, useDeliverOrderMutation } from '../../slices/ordersApiSlice';
import { toast } from 'react-toastify';

const EditOrderModal = ({ show, onHide, order }) => {
  const [isPaid, setIsPaid] = useState(order.isPaid);
  const [isDelivered, setIsDelivered] = useState(order.isDelivered);

  const [payOrder, { isLoading: isPayLoading }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: isDeliverLoading }] = useDeliverOrderMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!order.isPaid && isPaid) {
        console.log('paying order', order._id)
        await payOrder(order._id).unwrap();
      }
      if (!order.isDelivered && isDelivered) {
        await deliverOrder(order._id).unwrap();
      }
      toast.success('Order updated successfully');
      onHide();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Order Status</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="isPaid">
            <Form.Check
              type="checkbox"
              label="Is Paid"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
              disabled={order.isPaid}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="isDelivered">
            <Form.Check
              type="checkbox"
              label="Is Delivered"
              checked={isDelivered}
              onChange={(e) => setIsDelivered(e.target.checked)}
              disabled={!isPaid || order.isDelivered}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isPayLoading || isDeliverLoading || (isPaid === order.isPaid && isDelivered === order.isDelivered)}
          >
            {isPayLoading || isDeliverLoading ? 'Updating...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditOrderModal;