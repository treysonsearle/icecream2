import React, { Component } from 'react';
import axios from 'axios';

import { connect } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout'
import { setFlavorId, clearFlavorId, subFromTotal, addNewFlavor, addToTotal, clearTotal, updateOrderId } from '../redux/reducer.js';
import './Order.css';



class Order extends Component {
    constructor(props) {
        super(props)
        this.handleToken = this.handleToken.bind(this)
        this.removeFlavorFromBag = this.removeFlavorFromBag.bind(this)
        this.getFlavorIds = this.getFlavorIds.bind(this)
    }

    removeFlavorFromBag(id) {
        axios.delete(`/api/bagList/${id}`)
            .then(res => {
                this.getFlavorIds(res.data)
            }).catch(
                err => console.log(err)
            )
    }

    getFlavorIds(arr) {
        let refreshedFlavorIds = arr.map(e => e.flavor_id)
        this.props.clearFlavorId()
        this.props.clearTotal()
        refreshedFlavorIds.map(e => axios.get(`/api/flavor/${e}`)
            .then(res => {
                this.props.addToTotal(res.data.price)
                let obj = {
                    id: res.data.id,
                    name: res.data.flavor_name,
                    amount: res.data.price,
                    pic: res.data.pic
                }
                this.props.addNewFlavor(obj)
            }))
    }




    async handleToken(token, addresses) {
        let { total } = this.props
        const response = await axios.post(
            "/api/checkout",
            { token, total }
        );
        const { status } = response.data;
        if (status === "success") {

            alert("Success! Check email for details", { type: "success" });
            axios.put(`/api/bag/${this.props.orderId}`)
            axios.post('/api/bag').then(res => {
                this.props.updateOrderId(res.data.id).then(res => {
                    axios.post('/api/bag').then(res => {
                        this.props.updateOrderId(res.data.id)
                    })
                        .catch(err => {
                            console.log(err)
                        })
                })

            })
                .catch(err => {
                    console.log(err)
                })
        } else {

            alert("Something went wrong", { type: "error" });
        }
    }


    render() {
        const { flavorsIds } = this.props
        return (
            <div className="container">
                <h1>Your Order</h1>
                <div>
                    <div>{flavorsIds?.map((e, i) => <div key={e.id}>{e.name} <img src={e.pic} alt="icecream" /> <p>Price: {e.amount}</p>   <button className="appBtn" value={e.id} onClick={() => this.removeFlavorFromBag(e.id)}>Remove</button></div>)}</div>
                    <div>Total: {this.props.total}</div>
                </div>
                <StripeCheckout
                    stripeKey='pk_test_51IGYRdBdX1pC86gACqjFd3cB4kTeGGmMTBpgtkkELehitJHzGlUQRB8Cm6AJr0cS1zr1FCX5qo3eEHWmrI5GUhRc00BeWPHV78'
                    token={this.handleToken}
                    billingAddress
                    shippingAddress
                    amount={this.props.total * 100}
                />
            </div>
        )

    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, { setFlavorId, clearFlavorId, subFromTotal, addNewFlavor, addToTotal, updateOrderId, clearTotal })(Order)