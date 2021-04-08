import React, { useState } from 'react';
import BoardCard from './BoardCard';
import { Modal, Button } from 'react-bootstrap';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const BoardColumn = props => {

    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [show, setShow] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const [showEditColumn, setShowEditColumn] = useState(false);
    const [newEditTitle, setNewEditTitle] = useState("")
    
    const renderBoardCards = () => {
        if (props.column.cards.length === 0)
            return (
                <p className="text-center h5 mt-3">This column is empty</p>
            )

        return (
            props.column.cards.map((card, index) => {
                return (
                    <BoardCard
                    key={card.id}
                    card={card}
                    index={index}
                    modifyCard={(cardTitle, cardDescription) => {
                        props.modifyCard(props.columnIndex, cardTitle, cardDescription, index)
                    }}
                    deleteCard={() => props.deleteCard(props.columnIndex, index)}
                    />
                ) 
            })
        )
    }

    const handleAddCardToColumn = () => {
        setShow(false);
        setNewTitle("");
        setNewDescription("");

        props.addCardToColumn(props.columnIndex, newTitle, newDescription);
    }

    const droppableFunc = (provided, snapshot) => {
        setIsDraggingOver(snapshot.isDraggingOver);

        return (
            <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            >
                {renderBoardCards()}
            {provided.placeholder}
            </div>
        )
    }

    const draggableFunc = (provided) => {
        const style = {
            width : "18rem",
            transition : "background-color 1s ease",
            ...provided.draggableProps.style,
        };

        return (
            <div className={`card ${isDraggingOver ? "bg-warning" : "bg-light"}`} {...provided.draggableProps} style={style}  ref={provided.innerRef} >
                <div className="card-body">
                    <div className="d-flex">
                        <h5 className="card-title mb-2 flex-grow-1" {...provided.dragHandleProps}>{props.column.columnTitle}</h5>
                        <div className="btn-group-sm btnGroupVisibleOnHover flex-shrink-0">
                            <button className="btn" onClick={props.deleteColumn}>
                                <i className="far fa-trash-alt my-auto"
                                style={{color : "red"}}
                                />
                            </button>
                            <button className="btn" onClick={handleEditColumn} >
                                <i className="fas fa-pencil-alt my-auto ml-2"
                                style={{color : "blue"}}
                                />
                            </button>
                        </div>
                    </div>
                    <Droppable droppableId={props.column.id} index={props.columnIndex}>
                        {droppableFunc}
                    </Droppable>
                    <button className="btn btn-block btn-outline-success mt-3" onClick={() => setShow(true)}>
                        Add New Card
                        <i className="fas fa-plus ml-2" />
                    </button>
                </div>
            </div>
        )
    }

    const handleEditColumn = () => {
        setNewEditTitle(props.column.columnTitle);
        setShowEditColumn(true)
        return;
    }

    const editColumnTitleSubmit = () => {
        setShowEditColumn(false);
        props.modifyColumnName(newEditTitle);
    }

    return (
        <div className="mx-3">
            <Draggable draggableId={props.column.id} index={props.columnIndex}>
                {draggableFunc}
            </Draggable>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{`New card to ${props.column.columnTitle}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Card Title</label>
                        <input className="form-control" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Card Description</label>
                        <input className="form-control" value={newDescription} onChange={e => setNewDescription(e.target.value)} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddCardToColumn}>
                        Add Card
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEditColumn} onHide={() => setShowEditColumn(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Editting ${props.column.columnTitle}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Column Title</label>
                        <input className="form-control" value={newEditTitle} onChange={e => setNewEditTitle(e.target.value)} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editColumnTitleSubmit}>
                        Submit New Title
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default BoardColumn;