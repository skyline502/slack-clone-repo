import { useHistory } from "react-router-dom";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateChannelModal from "../ChannelForm/CreateChannelModal";
import "./channels.css";
import { useParams } from "react-router-dom";

const Channels = () => {
  const dispatch = useDispatch();
  let history = useHistory();
  const { workspaceId } = useParams();

  const user = useSelector((state) => state.session.user);
  const channelsObj = useSelector((state) => state.channels);
  const userChannels = Object.values(channelsObj.userChannels);
  useEffect(() => {
    setLoaded(true);
  }, [dispatch, channelsObj, user]);

  const [loaded, setLoaded] = useState(false);
  const [showChannels, setShowChannels] = useState(true);
  const channelRoom = (id) => {
    history.push(`/workspaces/${workspaceId}/channels/${id}`);
  };

  return (
    loaded && (
      <div id="channels-tab-main">
        <span id="channels-tab-child">
          <button onClick={() => setShowChannels(!showChannels)}>
            {userChannels ? <i className="fas fa-caret-down"></i>
              : <i className="fas fa-caret-right"></i>
            }
          </button>
          <p>Channels</p>
        </span>
        {showChannels &&
          userChannels.map((channel) => channel.channel_data ? (
            <div key={channel.channel_id}>
              <div className='channel-name' onClick={() => channelRoom(channel.channel_id)}>
                # <div style={{marginLeft: 10}}>{channel.channel_data.name}</div>
              </div>
            </div>
          ) : null)}
        <div className="add-channel-btn">
          <CreateChannelModal></CreateChannelModal>
          Add channels
        </div>
      </div>
    )
  );
};

export default Channels;
