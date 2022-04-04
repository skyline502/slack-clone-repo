import { csrfFetch } from "./csrf";

//----------------------------------------------------------------load current view
const LOAD_CURRENTVIEW = "view/LoadCurrentView";

export const loadCurrentView = (view) => {
  return { type: LOAD_CURRENTVIEW, view };
};

export const getCurrentChannel = (channelId) => async (dispatch) => {
  const res = await fetch(`/api/workspaces/channels/${channelId}`);
  const channel = await res.json();
  dispatch(loadCurrentView(channel));
};
export const getCurrentRoom = (roomId) => async (dispatch) => {
  const res = await fetch(`/api/workspaces/dms/${roomId}`);
  const dm_room = await res.json();
  dispatch(loadCurrentView(dm_room));
};

const DELETE_MESSAGE = "view/deleteMessage";
export const removeMessage = (message) => ({
  type: DELETE_MESSAGE,
  message,
});
export const deleteMessage = (message) => async (dispatch) => {
  const res = await csrfFetch(`/api/messages/${message.id}`, {
    method: "DELETE",
  });
  const deletedMessage = await res.json();
  if (!message.socket) dispatch(removeMessage(deletedMessage));
};
//-------------------------------------- edit message
const UPDATE_MESSAGE = "view/UpdateMessage";
export const updateMessage = (message) => ({
  type: UPDATE_MESSAGE,
  message,
});
export const putMessage = (message) => async (dispatch) => {
  const res = await csrfFetch(`/api/messages/${message.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  const updatedMessage = await res.json();
  if (!message.socket) dispatch(updateMessage(updatedMessage));
};
//-----------------------------add channel message
export const postChannelMessage = (message) => async (dispatch) => {
  console.log(message);
  const res = await csrfFetch(`/api/messages/channels/${message.channel_id}`, {
    method: "POST",
    body: JSON.stringify(message),
  });
  const newMessage = await res.json();
  return newMessage;
};
export const postDirectMessage = (message) => async (dispatch) => {
  const res = await csrfFetch(`/api/messages/dm_rooms/${message.room_id}`, {
    method: "POST",
    body: JSON.stringify(message),
  });
  const newMessage = await res.json();
  return newMessage;
};

//------------------------------------------- delete messages ------------------------------------------------------------------

const currentViewReducer = (state = {}, action) => {
  let newState = { ...state };

  switch (action.type) {
    case LOAD_CURRENTVIEW: {
      newState = action.view;
      console.log(newState.messages);
      return newState;
    }
    case UPDATE_MESSAGE: {
      newState.messages = newState.messages.map(message => action.message.id === message.id ? action.message : message);
      return newState;
    }
    case DELETE_MESSAGE: {
      // delete newState.messages[action.messageId];
      newState.messages = newState.messages.filter(message => action.message.message_id !== message.id);
      return newState;
    }
    default:
      return state;
  }
};

export default currentViewReducer;
