import { body, param } from "express-validator";

export function validateActivityId() {
    return param("id").toInt().isInt();
}

export function validateActivityTitle() {
    return body("title").notEmpty().isString().trim().escape();
}

export function validateActivityDescription() {
    return body("description").isString().trim().escape();
}