import styled from "styled-components";
import MetaMaskOnboarding from "@metamask/onboarding";
import { useState } from "react";
import axios from "axios";

const forwarderOrigin = "http://localhost:9010";

const initialize = () => {
  //Basic Actions Section
  const onboardButton = document.getElementById("connectButton");

  const getAccountsButton = document.getElementById("getAccounts");

  const getAccountsResult = document.getElementById("getAccountsResult");
  const getVersionResult = document.getElementById("getVersionResult");
  const getBalanceResult = document.getElementById("getBalanceResult");
  const getTransactionResult = document.getElementById("getTransactionResult");

  const sendMoney = document.getElementById("sendMoney");

  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  const onClickConnect = async () => {
    onboardButton.innerText = "connecting...";
    onboardButton.disabled = true;
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error(error);
    }
    onboardButton.innerText = "connected!";
  };

  const MetaMaskClientCheck = () => {
    //Now we check to see if Metmask is installed
    if (!isMetaMaskInstalled()) {
      //If it isn't installed we ask the user to click to install it
      onboardButton.innerText = "Click here to install MetaMask!";
      //When the button is clicked we call this function
      onboardButton.onclick = onClickInstall;
      //The button is now disabled
      onboardButton.disabled = false;
    } else {
      //If it is installed we change our button text
      onboardButton.innerText = "Connect to Metamask";
      //When the button is clicked we call this function to connect the users MetaMask Wallet
      onboardButton.onclick = onClickConnect;
      //The button is now disabled
      onboardButton.disabled = false;
    }
  };
  MetaMaskClientCheck();

  //We create a new MetaMask onboarding object to use in our app
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

  //This will start the onboarding proccess
  const onClickInstall = () => {
    onboardButton.innerText = "Onboarding in progress";
    onboardButton.disabled = true;
    //On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
  };

  //Eth_Accounts-getAccountsButton
  getAccountsButton.addEventListener("click", async () => {
    //we use eth_accounts because it returns a list of addresses owned by us.
    const version = await window.ethereum.request({ method: "net_version" });
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [accounts[0], "latest"],
    });
    const rawBalane = balance.slice(2);
    const dezBalance = parseInt(rawBalane, 16) / 1000000000000000000;
    //We take the first address in the array of addresses and display it
    getVersionResult.innerHTML = version || "Not able to get version";
    getAccountsResult.innerHTML = accounts[0] || "Not able to get accounts";
    getBalanceResult.innerHTML = dezBalance || "Not able to get balance";
  });

  window.ethereum.on("accountsChanged", (accounts) => {
    // Handle the new accounts, or lack thereof.
    // "accounts" will always be an array, but it can be empty.
    getAccountsButton.click();
  });

  window.ethereum.on("chainChanged", (chainId) => {
    // Handle the new chain.
    // Correctly handling chain changes can be complicated.
    // We recommend reloading the page unless you have good reason not to.
    window.location.reload();
    getAccountsButton.click();
  });

  sendMoney.addEventListener("click", async () => {
    const from = await window.ethereum.request({
      method: "eth_accounts",
    });

    // Calculate the amount from Input String
    const amountRaw = document.getElementById("amount").value;
    const fullAmount = amountRaw * 1000000000000000000;
    const hexAmount = "0x" + fullAmount.toString(16);

    const receiver = document.getElementById("receiver").value;

    const transaction = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: from[0],
          to: receiver,
          value: hexAmount,
        },
      ],
    });
    getTransactionResult.innerHTML = transaction || "transaction failed";
  });
};

window.addEventListener("DOMContentLoaded", initialize);

function App() {
  const [coins, setCoins] = useState([]);
  const [ether, setEther] = useState();
  const [error, setError] = useState(null);

  const Tokens = () => {
    if (error) {
      return <p>{error}</p>;
    } else {
      if (coins !== undefined) {
        return (
          <ul>
            <li>ETH | {ether}</li>
            {coins.map((coin, key) => {
              return (
                <li key={key}>
                  {coin.tokenInfo.symbol} | {coin.balance}
                </li>
              );
            })}
          </ul>
        );
      } else {
        if (ether) {
          return (
            <ul>
              <li>ETH | {ether}</li>
            </ul>
          );
        } else {
          <p>keine Coins vorhanden</p>;
        }
      }
    }
  };

  const loadTokens = async () => {
    const url0 = "https://api.ethplorer.io/getAddressInfo/";
    const addressRAW = await window.ethereum.request({
      method: "eth_accounts",
    });
    const address = addressRAW[0];
    const url1 = "?apiKey=EK-2wdEu-AV4a9wG-91CUN";
    const url = url0 + address + url1;

    try {
      const response = await axios.get(url);
      // Success 🎉
      setEther(response.data.ETH.balance);
      setCoins(response.data.tokens || []);
    } catch (error) {
      // Error 😨
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */

        const err = error.message;
        setError(err);
      } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        setError(error);
        console.log("timeout", error.request);
      } else {
        // Something happened in setting up the request and triggered an Error
        setError(error);
        console.log("Error", error.message);
      }
    }
  };

  return (
    <Container>
      <button id="connectButton">connect!</button>
      <Line />
      <button id="getAccounts" onClick={() => loadTokens()}>
        get account information
      </button>

      <h4 id="title">Chain Version:</h4>
      <p id="getVersionResult"></p>

      <h4 id="title">Account Address:</h4>
      <p id="getAccountsResult"></p>

      <h4 id="title">Current Balance (in eth):</h4>
      <p id="getBalanceResult"></p>

      <Line />

      <h4>amount:</h4>
      <input type="text" id="amount"></input>

      <h4>to:</h4>
      <input type="text" id="receiver"></input>

      <button id="sendMoney">send money!</button>

      <Line />
      <h4>Transaction result:</h4>
      <p id="getTransactionResult"></p>
      <Line />
      <h4>Tokens:</h4>
      <Tokens />
    </Container>
  );
}

const Line = styled.div`
  width: 75%;
  height: 1px;
  background: black;
  margin: 10px 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  button {
    margin: 20px 0;
    width: 200px;
  }
  h4 {
    margin: 5px 0;
  }
  p {
    margin: 5px 0;
  }
`;

export default App;
