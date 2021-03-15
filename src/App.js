import styled from "styled-components";
import MetaMaskOnboarding from "@metamask/onboarding";

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

  //------Inserted Code------\\
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
    console.log("onboarding");
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
    //We take the first address in the array of addresses and display it
    getVersionResult.innerHTML = version || "Not able to get version";
    getAccountsResult.innerHTML = accounts[0] || "Not able to get accounts";
    getBalanceResult.innerHTML = balance || "Not able to get balance";
  });

  sendMoney.addEventListener("click", async () => {
    const from = await window.ethereum.request({
      method: "eth_accounts",
    });

    // Calculate the amount from Input String
    const amountRaw = document.getElementById("amount").value;
    const fullAmount = amountRaw * 1000000000000000000;
    const hexAmount = "0x" + fullAmount.toString(16);

    console.log("hexamount", hexAmount);

    const transaction = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: from[0],
          to: "0xF213906f272181f7980eF117c4640D8C67FFA14f",
          value: hexAmount,
        },
      ],
    });
    getTransactionResult.innerHTML = transaction || "transaction failed";
  });
};

window.addEventListener("DOMContentLoaded", initialize);

function App() {
  return (
    <Container>
      <button id="connectButton">connect!</button>
      <button id="getAccounts">get account information</button>
      <Row>
        <p id="title">Chain Version:</p>
        <p id="getVersionResult"></p>
      </Row>
      <Row>
        <p id="title">Account Address:</p>
        <p id="getAccountsResult"></p>
      </Row>
      <Row>
        <p id="title">Current Balance:</p>
        <p id="getBalanceResult"></p>
      </Row>
      <p id="info"></p>
      <input type="text" id="amount"></input>
      <button id="sendMoney">send money!</button>
      <p id="getTransactionResult"></p>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  button {
    margin: 20px 0 0 0;
    width: 200px;
  }
`;

const Row = styled.div`
  display: flex;
  width: 80%;
  height: auto;
  #title {
    width: 125px;
    text-align: end;
    margin-right: 15px;
  }
`;

export default App;
