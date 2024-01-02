import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[];
  showGraph: boolean;
}

/**
 * The parent element of the react app.
 * It renders title, button, and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph) {
      return (<Graph data={this.state.data}/>);
    }
    return null;
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    let x = 0;
    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        if (serverResponds.length > 0) {
          this.setState((prevState) => ({
            data: [...prevState.data, ...serverResponds],
            showGraph: true,
          }));
        }
      });
      x++;
      if (x > 100) {
        clearInterval(interval);
      }
    }, 100);
  }

  /**
   * Lifecycle method to set attributes on a DOM element
   */
  componentDidMount() {
    // Access the DOM element using refs or querySelector
    const elem = document.getElementById('yourElementId'); // Replace 'yourElementId' with the actual ID of your target element

    if (elem) {
      elem.setAttribute('view', 'Y_Line');
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["top ask_price"]');
      elem.setAttribute('aggregates', JSON.stringify({
        stock: 'distinct count',
        'top ask price': 'avg',
        'top bid_price': 'avg',
        timestamp: 'distinct count'
      }));
    }
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            onClick={() => {
              this.getDataFromServer();
            }}
          >
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;

