import { GET_RECIPE, RECEIVE_RECIPE, FAIL_RECIPE } from "../actions"

const initialState = {
  recipe: null,
  isLoading: false,
  error: null,
}

const recipeFetching = (state) => {
  return { ...state, isLoading: true }
}

const recipeFetched = (state, recipe) => {
  return { ...state, isLoading: false, recipe }
}

const recipeFetchFailed= (state, error) => {
  return { ...state, isLoading: false, recipe: null, error }
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_RECIPE:
      return recipeFetching()
    case RECEIVE_RECIPE:
      return recipeFetched(state, payload)
    case FAIL_RECIPE:
      return recipeFetchFailed(state, payload)
    default:
      return state
  }
}
