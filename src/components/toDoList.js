import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import { 
  Button, Container, Row, Col, Card, CardBody, CardText,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input
 } from "reactstrap";

const ToDoList = () => {

  // To DO  State
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const toggle = () => setModal(!modal);

  const [formData, setFormData] = useState({
    toDo: "",
    status: 1,
  });

  useEffect(() => {
    fetchData();
  }, []); 

  const fetchData = async () => {
    try {
      
      const response = await fetch(`http://localhost:8080/api/todo?page=${currentPage}&limit=2`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setTasks(result);
      setTotalPages(result.totalPage);
      setTotalCount(result.totalData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleAddTodo = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Fetch the updated todo list after adding a new item
      fetchData();
      // Close the modal after adding a todo
      toggle();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData();
  };



  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch('http://localhost:8080/api/todo/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Fetch the updated todo list after updating status
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };


  return (
    <div>
      <Container className="doTo-heading-bottom">
        <Row xs="1">
          <Col className="bg-light border">

            <h2 className="my-2 text-center">TO DO LIST</h2>

            <Button color="primary" onClick={toggle}>
              Add
            </Button>

            <hr/>

            {tasks && tasks.data && tasks.data.map((item) => (

              <Card
              key={item.id}
              className="my-2"
              color="secondary"
              outline
              >
              <CardBody>
                <CardText>
                  {item.toDo}
                </CardText>

                <Button color={item.status === 1 ? "danger" : "success" }  onClick={() => handleUpdateStatus(item.id, item.status === 1 ? 2 : 1)} >
                  {item.status === 1 ? "Not Completed" : "Completed" }
                </Button>

              </CardBody>
              </Card>

        ))}


<div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index + 1}
                  color={currentPage === index + 1 ? "primary" : "secondary"}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}

            </div>
            <p className="text-end">total entires : { totalCount }</p>

            

 

          </Col>
        </Row>
      </Container>


      {/* Model one */}
      <Modal isOpen={modal} toggle={toggle} >
        <ModalHeader toggle={toggle}>Add To Do</ModalHeader>
        <ModalBody>
        <Form>
                  <FormGroup>
                    <Label for="todo">Todo</Label>
                    <Input
                      type="text"
                      name="toDo"
                      id="todo"
                      placeholder="Enter your todo"
                      value={formData.toDo}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <Button color="primary" onClick={handleAddTodo}>
                    Add Todo
                  </Button>
                </Form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ToDoList;
