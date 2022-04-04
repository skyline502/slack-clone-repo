import "./OneWorkspace.css";

import { getOneWorkspace } from "../../store/workspace";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import MainContent from "./MainContent.js";
import { BrowserRouter, Switch } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";

const OneWorkspace = () => {
  let { workspaceId } = useParams();
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const workspace = useSelector((state) => state.workspace.currentWorkspace);
  //   console.log(workspace);
  useEffect(() => {
    dispatch(getOneWorkspace(workspaceId)).then(() => setLoaded(true));
  }, [dispatch, workspaceId]);

  return (
    loaded && (
      <div>
        <LeftSideBar workspace={workspace}></LeftSideBar>
        <BrowserRouter>
          <Switch>
            <ProtectedRoute
              path={`/workspaces/:workspaceId/messages/channels/:id`}
            >
              <MainContent />
            </ProtectedRoute>
            <ProtectedRoute
              path={`/workspaces/:workspaceId/messages/dm_rooms/:id`}
            >
              <MainContent />
            </ProtectedRoute>
          </Switch>
        </BrowserRouter>

        <RightSideBar></RightSideBar>
      </div>
    )
  );
};

export default OneWorkspace;