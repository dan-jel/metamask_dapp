import { Component } from "react";
import Web3 from "web3";
import React from "react";

class App extends Component {
  componentDidMount() {
    this.loadBlockchainData();
  }

  constructor(props) {
    super(props);
    this.state = {
      network: "",
      account: "",
    };
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const network = await web3.eth.net.getNetworkType();
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    this.setState({ network: network });
    console.log(window.ethereum.selectedAddress);
  }

  render() {
    return (
      <div className="App">
        <h3>current network: {this.state.network}</h3>
        <h3>current account: {this.state.account}</h3>
      </div>
    );
  }
}

export default App;
