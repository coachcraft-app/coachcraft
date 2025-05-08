import { Router, Request, Response } from "express"
import { getActivity, getAllActivities, putActivity, deleteActivity, postActivity } from "../handlers/activity.js";
import { validateActivityId, validateActivityTitle, validateActivityDescription} from "../lib/activity-validator.js";

const activity = Router();

activity.get("/activity/:id", validateActivityId(), getActivity);
activity.get("/activity", getAllActivities);
activity.post("/activity", validateActivityTitle(), validateActivityDescription(), postActivity);
activity.put("/activity/:id", validateActivityId(), validateActivityTitle(), validateActivityDescription(), putActivity);
activity.delete("/activity/:id", validateActivityId(), deleteActivity);

export default activity;