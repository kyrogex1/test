import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Draggable } from 'react-beautiful-dnd';

const BoardCard = props => {

    const [showEditModal, setShowEditModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [newTitle, setNewTitle] = useState(props.card.title);
    const [newDescription, setNewDescription] = useState(props.card.description);

    const handleOnEditClick = (e) => {
        e.stopPropagation();
        setNewTitle(props.card.title);
        setNewDescription(props.card.description);
        setShowEditModal(true);
    }

    const handleOnEditSave = () => {
        setShowEditModal(false);
        props.modifyCard(newTitle, newDescription);
    }

    const handleOnDeleteClick = (e) => {
        e.stopPropagation();
        if (window.confirm("Confirm delete this entry ?")) {
            props.deleteCard();
        }
    }

    const draggableFunc = (provided, snapshot) => {
        
        return (
            <div 
            className={`card mb-3 p-2 ${snapshot.isDragging ? "bg-success text-white" : ""} boardCard`}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={() => setShowInfoModal(true)}
            >
                <div className="d-flex">
                    <h6 className="card-title my-1 mr-auto flex-grow-1">{props.card.title}</h6>
                    <div className="btn-group-sm btnGroupVisibleOnHover flex-shrink-0">
                        <button className="btn" onClick={handleOnDeleteClick}>
                            <i className="far fa-trash-alt my-auto"
                            style={{color : "red"}}
                            />
                        </button>
                        <button className="btn" onClick={handleOnEditClick} >
                            <i className="fas fa-pencil-alt my-auto ml-2"
                            style={{color : "blue"}}
                            />
                        </button>
                    </div>
                </div>
            </div>

        )
    }

    return (
        <React.Fragment>
            <Draggable draggableId={props.card.id} index={props.index}>
                {draggableFunc}
            </Draggable>
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Editting ${newTitle}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Card Title</label>
                        <input className="form-control" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Card Description</label>
                        <textarea className="form-control" rows="6" value={newDescription} onChange={e => setNewDescription(e.target.value)}></textarea>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleOnEditSave}>
                        Edit Card
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.card.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <div className="row">
                            <div className="col-8">
                                <p className="font-weight-bold">Card Description</p>
                                <div className="card">
                                    <div className="card-body">
                                        <p className="card-text">
                                            {props.card.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 d-flex flex-column">
                                <div className="mb-3">
                                    <p className="font-weight-bold mb-0">Priority</p>
                                    <h5><span className="badge badge-primary">Low</span></h5>
                                </div>
                                <div className="mb-3">
                                    <p className="font-weight-bold mb-0">Date Added : </p>
                                    <p>29/09/2021 18:50</p>
                                </div>
                            </div>
                        </div>

                </Modal.Body>
            </Modal>
        </ React.Fragment>
    );
}

export default BoardCard;