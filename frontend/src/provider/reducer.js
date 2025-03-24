export const initialState = {
    user: null,
    toast: null
  };
  
  const reducer = (state, action) => {
    switch (action.type) {
      // Add User:
      case "ADD_USER":
        return {
          ...state,
          user: action.user,
        };
  
      case "TOAST_MESSAGE":
        return {
          ...state,
          toast: action.toast,
        };
  
      // Default:
      default:
        return state;
    }
  };
  
  export default reducer;
  