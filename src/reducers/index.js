import { combineReducers } from "redux";
import tokensReducer from "./tokensReducer";
// import loggedReducer from "./loggedReducer";

const allReducers = combineReducers({
  tokens: tokensReducer,
});

export default allReducers;
