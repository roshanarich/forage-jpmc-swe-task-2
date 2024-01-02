import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

interface IProps {
  data: ServerRespond[];
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer', null, null);
  }

  componentDidMount() {
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table && elem) {
      elem.load(this.table);
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.table && this.props.data !== prevProps.data) {
      const formattedData: Record<string, (string | number | boolean | Date)[]>[] = [
        this.props.data.map((el: ServerRespond) => ({
          stock: [el.stock], // Wrap the 'stock' value in an array
          top_ask_price: [el.top_ask ? el.top_ask.price : 0], // Wrap the 'top_ask_price' value in an array
          top_bid_price: [el.top_bid ? el.top_bid.price : 0], // Wrap the 'top_bid_price' value in an array
          timestamp: [el.timestamp], // Wrap the 'timestamp' value in an array
        })),
      ];
  
      this.table.update(formattedData);
    }
  }
}
export default Graph;
