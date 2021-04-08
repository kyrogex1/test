import React, { useState } from 'react';
import BoardColumn from './BoardColumn';
import {v4 as uuid} from 'uuid';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Header from './Header';
import initialColumns from '../initialColumns';
import _ from 'lodash';

const BoardContainer = props => {
    const [columns, setColumns] = useState(initialColumns);
    const [maxCardsIndex, setMaxCardsIndex] = useState(1);

    const addCardToColumn = (columnIndex, cardTitle, cardDescription) => {
        if (columns[columnIndex].cards.length >= props.maxCardsArray[maxCardsIndex]){
            alert(`Cant add anymore cards. This column has reached a limit of  ${props.maxCardsArray[maxCardsIndex]} cards. Please change the limit before adding`)
            return;
        }
        const updatedArray = [...columns[columnIndex].cards, {id : uuid(), title : cardTitle, description : cardDescription}];
        const updatedColumns = [...columns];
        updatedColumns.splice(columnIndex, 1, {...columns[columnIndex], cards : updatedArray});
        setColumns(updatedColumns);
    }

    const modifyCard = (columnIndex, cardTitle, cardDescription, cardIndex) => {
        const updatedColumns = [...columns];
        updatedColumns[columnIndex].cards[cardIndex].title = cardTitle;
        updatedColumns[columnIndex].cards[cardIndex].description = cardDescription;
        console.log(updatedColumns);
        setColumns(updatedColumns);
    }

    const deleteCard = (columnIndex, cardIndex) => {
        const updatedColumns = [...columns];
        updatedColumns[columnIndex].cards.splice(cardIndex, 1);
        setColumns(updatedColumns);
    }

    const modifyColumnName = (columnIndex, columnTitle) => {
        const updatedColumns = _.cloneDeep(columns);
        updatedColumns[columnIndex].columnTitle = columnTitle;
        setColumns(updatedColumns);

    }
    const onDragEnd = (result) => {
        const source = result.source;
        const destination = result.destination;
        const updatedColumns = _.cloneDeep(columns);

        if (!destination)
            return;

        if (result.type === "column"){
            updatedColumns.splice(source.index, 1);
            updatedColumns.splice(destination.index, 0, columns[source.index]);
            setColumns(updatedColumns);
            return;
        }
        
        else {
            const sourceColumn = updatedColumns.find(column => column.id === source.droppableId);
            const sourceItem = sourceColumn.cards[source.index];
            
            if (source.droppableId === destination.droppableId)
                if (source.index === destination.index)
                    return;
                else {
                    sourceColumn.cards.splice(source.index, 1);
                    sourceColumn.cards.splice(destination.index, 0, sourceItem);
                }
            else {
                sourceColumn.cards.splice(source.index, 1);
                const destinationColumn = updatedColumns.find(column => column.id === destination.droppableId);
                destinationColumn.cards.splice(destination.index, 0, sourceItem);
                if (destinationColumn.cards.length > props.maxCardsArray[maxCardsIndex]){
                    alert(`Cant add anymore cards. This column has reached a limit of  ${props.maxCardsArray[maxCardsIndex]} cards. Please change the limit before adding`)
                    return;
                }
            }
            setColumns(updatedColumns);
        }
    }

    const renderColumns = () => {
        return (
            columns.map((column, index) => {
                return (
                    <BoardColumn
                    column={column}
                    columnIndex={index}
                    key={column.id}
                    addCardToColumn={addCardToColumn}
                    modifyCard={modifyCard}
                    deleteCard={deleteCard}
                    deleteColumn={() => deleteColumn(index)}
                    modifyColumnName={(columnTitle) => modifyColumnName(index, columnTitle)}
                    />
                )
            })
        )
    }

    const addNewColumn = () => {
        const newColumn = {
            id : uuid(),
            columnTitle : "New Column",
            cards : [],
        };
        setColumns([...columns, newColumn]);
    }

    const deleteColumn = (columnIndex) => {
        console.log(columnIndex);
        if (window.confirm(`You really want to delete column ${columns[columnIndex].columnTitle}`)) {
            const updatedColumns = [...columns];
            updatedColumns.splice(columnIndex, 1);
            setColumns(updatedColumns);
        }
    }

    const onMaxCardBtnClick = (index) => {
        const maxCards = props.maxCardsArray[index];
        if (columns.find(column => column.cards.length > maxCards) === undefined) // No columns are greater than the new setted value
            setMaxCardsIndex(index)
        else
            alert(`Please Ensure all columns have at most ${props.maxCardsArray[index]} cards`);
        return;
        
    }

    const renderMaxCardsButtons = () => {
        return props.maxCardsArray.map((item, index) => (
            <button
            key={index}
            type="button"
            className={`btn btn-light ${index === maxCardsIndex ? "active" : ""}`}
            onClick={() => onMaxCardBtnClick(index)}
            >
            {item === Infinity ? "No Limit" : String(item)}
            </button>
        ))
        
    }

    return (
        <div>
            <Header>
                <p className="h5 text-white mr-1 mt-1">Max Number Of Cards : </p>
                <div className="btn-group" role="group" aria-label="Basic example">
                    {renderMaxCardsButtons()}
                </div>
            </ Header>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="w-100 d-flex mt-4" style={{overflow : 'auto'}}>
                    <Droppable droppableId="AllColumns" type="column" direction="horizontal"> 
                    {(provided) => (
                        <div className="d-flex" {...provided.droppableProps} ref={provided.innerRef}>      
                            {renderColumns()}
                            {provided.placeholder}
                            <button className="btn btn-outline-success align-self-start" style={{width : "18rem"}} onClick={addNewColumn}>
                                Add New Column
                                <i className="fas fa-plus ml-2" />
                            </button>
                        </div>
                    )}
                    </Droppable>
                </div>
            </DragDropContext>
        </div>
    )
}

BoardContainer.defaultProps = {
    maxCardsArray : [3, 5, 10, Infinity]  
}

export default BoardContainer;