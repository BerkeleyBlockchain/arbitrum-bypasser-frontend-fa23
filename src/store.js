

import { createStore } from 'redux';

// Initial State
const initialState = {
  connectedAccount: null,
};

// Action Types
const SET_CONNECTED_ACCOUNT = 'SET_CONNECTED_ACCOUNT';

// Reducer
const metamaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONNECTED_ACCOUNT:
      return {
        ...state,
        connectedAccount: action.payload,
      };
    default:
      return state;
  }
};

// Action Creator
export const setConnectedAccount = (account) => ({
  type: SET_CONNECTED_ACCOUNT,
  payload: account,
});

export default createStore(metamaskReducer);
