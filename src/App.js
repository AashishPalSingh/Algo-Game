import React from 'react';
import './App.css';
import styled from 'styled-components'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const Button = styled.div`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: 0 1em;
  width: 50px;
    height: 30px;
  padding: 0.25em 1em;`

const Inputs = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-basis: 100%;
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: 0 1em;
  justify-content: space-around;
  padding: 0.25em 1em;`

const LS = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 500px;
  flex-direction: column;
  align-content: center;
  align-items: center;
  flex: 2;
  background: transparent;
  border-radius: 3px;
  border: 2px solid blue;
  color: palevioletred;
  margin: 0 1em;
  padding: 0.25em 1em;`

const RS = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 500px;
  flex-direction: column;
  align-content: center;
  align-items: center;
  flex: 2;
  background: transparent;
  border-radius: 3px;
  border: 2px solid green;
  color: palevioletred;
  margin: 0 1em;
  padding: 0.25em 1em;`

const Game = styled.div`
  display: flex;
  flex-wrap: wrap;`

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: 10,
  margin: `0 0 ${10}px 0`,


  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle
});

const reorder = (list, startIndex, endIndex, droppableId, initial) => {
  if (droppableId === "droppable") {
    let results = [];
    initial.forEach(function (key) {
      let found = false;
      list = list.filter(function (item) {
        if (!found && item === key) {
          results.push(item);
          found = true;
          return false;
        } else
          return true;
      })
    })
    return results;
  }
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: 10,
  width: 250,
  margin: "5px 5px",
});
const getButtonStyle = () => ({ width: 80, margin: 0, "background-color": "white" });
const getParaStyle = () => ({ margin: 0, "font-size": "small" });
const getItems = () => {
  return {
    increasing: [],
    decreasing: [],
    inputs: [7, 8, 1, 2, 4, 6, 3, 5, 2, 1, 8, 7],
  }
}

class App extends React.Component {
  state = getItems();

  initial = [7, 8, 1, 2, 4, 6, 3, 5, 2, 1, 8, 7];

  id2List = {
    droppable: 'inputs',
    droppable2: 'increasing',
    droppable3: 'decreasing'
  };

  getList = id => this.state[this.id2List[id]];

  onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index,
        source.droppableId,
        this.initial
      );

      let state = { items };

      if (source.droppableId === 'droppable2') {
        state = { selected: items };
      }

      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );
      if (destination.droppableId === "droppable") {
        let resultDropable = result.droppable;
        let results = [];
        this.initial.forEach(function (key) {
          let found = false;
          resultDropable = resultDropable.filter(function (item) {
            if (!found && item === key) {
              results.push(item);
              found = true;
              return false;
            } else
              return true;
          })
        });
        result.droppable = results;
      }
      this.setState({
        increasing: result.droppable2 || this.state[this.id2List["droppable2"]],
        decreasing: result.droppable3 || this.state[this.id2List["droppable3"]],
        inputs: result.droppable || this.state[this.id2List["droppable"]],
      });
    }
  };


  render() {
    return (
      <div className="App">

        <Game>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <Inputs ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}>
                  {this.state.inputs.map((item, index) => (
                    <Draggable key={`droppable-${index}-item-${item}`}
                      draggableId={`droppable-${index}-item-${item}`}
                      index={index}>
                      {(provided, snapshot) => (
                        <Button ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}>{item}</Button>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Inputs>
              )}
            </Droppable>
            <Droppable droppableId="droppable2">
              {(provided, snapshot) => (
                <LS ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}>
                  <Button style={getButtonStyle()}> <p style={getParaStyle()}>Increasing Subsequence</p></Button>
                  {this.state.increasing.map((item, index) => (
                    <Draggable key={`droppable2-${index}-item-${item}`}
                      draggableId={`droppable2-${index}-item-${item}`}
                      index={index}>
                      {(provided, snapshot) => (
                        <Button ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}>{item}</Button>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </LS>
              )}
            </Droppable>
            <Droppable droppableId="droppable3">
              {(provided, snapshot) => (
                <RS ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}>
                  <Button style={getButtonStyle()}> <p style={getParaStyle()}>Decreasing Subsequence</p></Button>
                  {this.state.decreasing.map((item, index) => (
                    <Draggable key={`droppable3-${index}-item-${item}`}
                      draggableId={`droppable3--${index}-item-${item}`}
                      index={index}>
                      {(provided, snapshot) => (
                        <Button ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}>{item}</Button>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </RS>
              )}
            </Droppable>
          </DragDropContext>
        </Game>
      </div >
    );
  }
}

export default App;
