const tokensReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD":
      return [...state, action.token];
    case "SET":
      return action.token;
    default:
      return state;
  }
};

export default tokensReducer;
