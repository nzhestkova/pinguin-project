import { ActionReducerMap } from "@ngrx/store";
import { AppState } from "../state/app.state";
import { tasksReducer } from "./tasks.reducer";
import { themeReducer } from "./theme.reducer";
import { userReducer } from "./user.reducer";
import { waitingReducer } from "./waiting.reducer";

export const appReducers: ActionReducerMap<AppState> = {
  user: userReducer,
  theme: themeReducer,
  pleaseWait: waitingReducer,
  onEditTasks: tasksReducer,
};
