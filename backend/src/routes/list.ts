import {Router} from "express";
import {getAllLists, getList, postList, putList, deleteList} from "../handlers/list.js";

const list = Router();

list.get("/list/:id", getList);
list.get("/list", getAllLists);
list.post("/list", postList);
list.put("/list/:id", putList);
list.delete("/list/:id", deleteList);

export default list;