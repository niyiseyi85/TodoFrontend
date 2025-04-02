import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Spinner, Navbar, Nav } from "react-bootstrap";
import { Pencil, Trash, CheckCircle, PersonCircle, BoxArrowRight } from "react-bootstrap-icons";
import AddTodoDialog from "./AddTodoDialog";
import EditTodoDialog from "./EditTodoDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import api from "../services/api";
import "./TodoList.css"; // Custom CSS for additional styling

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
    fetchCurrentUser(); // Fetch current user from localStorage
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get("/todos");
      setTodos(response.data.items);
    } catch (err) {
      console.error("Failed to fetch todos", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = () => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (userId && userName && userEmail) {
      setCurrentUser({
        id: userId,
        name: userName,
        email: userEmail,
      });
    } else {
      console.error("User information not found in localStorage");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("userId"); // Remove user ID
    localStorage.removeItem("userName"); // Remove user name
    localStorage.removeItem("userEmail"); // Remove user email
    navigate("/"); // Redirect to login page
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Failed to delete todo", err);
    }
  };

  const handleMarkAsCompleted = async (id) => {
    try {
      await api.put(`/todos/${id}/complete`);
      fetchTodos();
    } catch (err) {
      console.error("Failed to mark todo as completed", err);
    }
  };

  return (
    <div className="todo-list-container">
      <Navbar bg="light" expand="lg" className="mb-4">
        <Navbar.Brand>Todo List</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {currentUser && (
              <Nav.Item className="d-flex align-items-center">
                <PersonCircle className="mr-2" />
                {currentUser.name}
              </Nav.Item>
            )}
            <Nav.Item>
              <Button variant="outline-danger" onClick={handleLogout} className="ml-3">
                <BoxArrowRight /> Logout
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="todo-list-header">
        <h2>Todo List</h2>
        <Button variant="primary" onClick={() => setOpenAddDialog(true)}>
          Add Todo
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.title}</td>
                <td>{todo.description}</td>
                <td>{todo.isCompleted ? "Completed" : "Pending"}</td>
                <td>
                  <Button
                    variant="outline-secondary"
                    onClick={() => { setSelectedTodo(todo); setOpenEditDialog(true); }}
                  >
                    <Pencil />
                  </Button>{" "}
                  <Button
                    variant="outline-secondary"
                    onClick={() => { setTodoToDelete(todo.id); setOpenDeleteDialog(true); }}
                  >
                    <Trash />
                  </Button>{" "}
                  {!todo.isCompleted && (
                    <Button
                      variant="outline-success"
                      onClick={() => handleMarkAsCompleted(todo.id)}
                    >
                      <CheckCircle /> Mark as Completed
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <AddTodoDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onSave={fetchTodos} />
      <EditTodoDialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} onSave={fetchTodos} todo={selectedTodo} />
      <DeleteConfirmationDialog
        show={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={() => {
          handleDelete(todoToDelete);
          setOpenDeleteDialog(false);
        }}
      />
    </div>
  );
};

export default TodoList;