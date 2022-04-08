import "./DmRooms.css";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { deleteDmRoom } from "../../../../store/dmRooms";
import { useParams } from "react-router-dom";
import "./DmRooms.css";

import CreateDmModal from "./DmForm/DmFormModal";
const DmRooms = ({ workspace }) => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const { workspaceId, dmRoomId } = useParams();
  let history = useHistory();
  const user = useSelector((state) => state.session.user);
  const dmRoomsObj = useSelector((state) => state.dmRooms);
  const dmRooms = Object.values(dmRoomsObj.userDmRooms);

  const [showDmRooms, setShowDmRooms] = useState(false);

  const handleDelete = async (e, roomId) => {
    e.preventDefault();
    e.stopPropagation();
    // e.stopImmediatePropagation();
    await dispatch(deleteDmRoom(roomId));
    if (dmRoomId) {
      history.push(`/workspaces/${workspaceId}`);
    }
  };


  useEffect(() => {
    setLoaded(false);
    setLoaded(true);
  }, [user, workspace]);

  const dmRoom = async (e, id) => {
    e.preventDefault();
    history.push(`/workspaces/${workspace.id}/dm_rooms/${id}`);
  };
  return (
    loaded && (
      <div id="dm-rooms-list-main">
        <span id="dm-rooms-list-child">
          <button onClick={() => setShowDmRooms(!showDmRooms)}>
            {showDmRooms ? (
              <i className="fas fa-caret-down"></i>
            ) : (
              <i className="fas fa-caret-right"></i>
            )}
          </button>
          <p>Direct Messages</p>
          <CreateDmModal />
        </span>
        {showDmRooms &&
          dmRooms.map(
            (room) =>
              room.workspace_id === workspaceId * 1 && (
                <div
                  key={room.dm_room_id}
                  onClick={(e) => dmRoom(e, room.dm_room_id)}
                  id={room.id}
                  className="single_dm_room"
                >
                  <div className="single_dm_room_child">
                    <i className="fas fa-user" />
                    {room.neighbors.members.map((member) => (
                      <div className="single_dm_room_child" key={member.id}>
                        {member.username},
                      </div>
                    ))}
                    {user.id === room.user_id && (
                      <button onClick={(e) => handleDelete(e, room.dm_room_id)}>
                        <i className="fas fa-trash-alt" />
                      </button>
                    )}
                  </div>
                </div>
              )
          )}
      </div>
    )
  );
};

export default DmRooms;
