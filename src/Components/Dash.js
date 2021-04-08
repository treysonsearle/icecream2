import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { updateOrderId } from '../redux/reducer';

//import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import './Dash.css';



class Dash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      myFlavors: true,
      oldestFirst: false,
      flavors: [],
      randomFlavors: [],
      selectedFlavor: ''
    }
    this.grabFlavors = this.grabFlavors.bind(this);
    // this.reset = this.reset.bind(this);
    this.createOrder = this.createOrder.bind(this)

  }

  createOrder() {



    this.props.history.push(`/customize`)
  }

  componentDidMount() {
    this.grabFlavors();
  }
  grabFlavors() {
    let newArray = []
    axios.get('/api/flavors')
      .then(res => {
        console.log(res)
        this.setState({ flavors: res.data })
        for (let i = 0; i < 9; i++) {
          let index = Math.floor(Math.random() * Math.floor(this.state.flavors.length - 1))
          newArray.push(this.state.flavors[index])
          this.setState({ randomFlavors: [...newArray] })
        }
      })
  }
  render() {
    let { randomFlavors } = this.state


    return (
      <div className="container">
        <div className="flavors" >{randomFlavors?.map((e, i) => <div className="flavorImg" key={i}><img src={e.pic} alt="icecream" /><p className="flavor-name">{e?.flavor_name}</p></div>)}</div>


        {/* <div>Selected Icecream  {this.props.orderId}</div> */}
        <button className="appBtn" id="createBtn" onClick={() => this.createOrder()}>Create your own</button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, { updateOrderId })(Dash);