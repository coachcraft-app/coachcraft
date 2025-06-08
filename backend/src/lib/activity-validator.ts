import { body, param } from "express-validator";

//TODO: add extra optional validators for put
//TODO: use addMessage from express-validator to make errors clearer

export function validateActivityId() {
    return param("id").toInt().isInt();
}

export function validateActivityTitle() {
    return body("name").notEmpty().isString().trim();
}

export function validateActivityDescription() {
    return body("description").isString().trim();
}