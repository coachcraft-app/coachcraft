import { eq } from "drizzle-orm";
import { Request, Response, NextFunction } from 'express';
import { db } from "../db/db.ts";
import {ActivityTemplateListTable, ActivityTemplatesTable} from "../db/schema.ts";
import { StatusError } from "../lib/status-error.ts";
import {validationResult} from "express-validator";

export async function getAllActivities(req: Request, res: Response, next: NextFunction) {
    try {
        const activities = await db.select().from(ActivityTemplatesTable);
        res.status(200).json({ activities });
    } catch (error) {
        next(new StatusError("Failed to get activities", 500));
    }
}

export async function getActivity(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return next(new StatusError(JSON.stringify(result.array()), 400))
    }
    try {
        const activity = await db
            .select()
            .from(ActivityTemplatesTable)
            .where(eq(ActivityTemplatesTable.id, +req.params.id));

        res.status(200).json({ activity: activity[0] });
    } catch (error) {
        next(new StatusError("Failed to get activity", 500));
    }
}

export async function postActivity(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return next(new StatusError(JSON.stringify(result.array()), 400))
    }
    try {
        const activity = await db.insert(ActivityTemplatesTable).values(req.body).returning();
        await db.insert(ActivityTemplateListTable).values({activityTemplate: activity[0].id, list: 1});
        res.status(201).json({ activity });
    } catch (error) {
        console.log(error);
        next(new StatusError("Failed to post activity", 500));
    }
}

export async function putActivity(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return next(new StatusError(JSON.stringify(result.array()), 400))
    }
    try {
        const activity = await db
            .update(ActivityTemplatesTable)
            .set(req.body)
            .where(eq(ActivityTemplatesTable.id, +req.params.id))
            .returning();

        res.status(201).json({ activity });
    } catch (error) {
        next(new StatusError("Failed to put activity", 500));
    }
}

export async function deleteActivity(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return next(new StatusError(JSON.stringify(result.array()), 400))
    }
    try {
        const activity = await db
            .delete(ActivityTemplatesTable)
            .where(eq(ActivityTemplatesTable.id, +req.params.id))
            .returning({
                deletedActivityId: ActivityTemplatesTable.id
            });

        res.status(200).json({ activity });
    } catch (error) {
        next(new StatusError("Failed to delete activity", 500));
    }
}