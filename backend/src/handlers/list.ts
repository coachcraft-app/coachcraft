import { Request, Response, NextFunction } from 'express';
import {db} from "../db/db.js";
import {ActivityTemplateListTable, ActivityTemplatesTable, ListTable} from "../db/schema.js";
import {StatusError} from "../lib/status-error.js";
import {validationResult} from "express-validator";
import {eq} from "drizzle-orm";

export async function getAllLists(req: Request, res: Response, next: NextFunction) {
    try {
        const lists = await db.select().from(ListTable);
        res.status(200).json({ lists });
    } catch (error) {
        next(new StatusError("Failed to get lists", 500));
    }
}

export async function getList(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return next(new StatusError(JSON.stringify(result.array()), 400))
    }
    try {
        const list = await db
            .select()
            .from(ListTable)
            .where(eq(ListTable.id, +req.params.id));

        const activityList = db
            .select()
            .from(ActivityTemplateListTable)
            .where(eq(ActivityTemplateListTable.list, +req.params.id))
            .as("activity_list");

        const activities = await db
            .select()
            .from(ActivityTemplatesTable)
            .innerJoin(activityList, eq(activityList.activityTemplate, ActivityTemplatesTable.id))

        activities.forEach((v, i, arr) => {
            // @ts-ignore
            arr[i] = v.activity_template;
        })
        //@ts-ignore
        list[0].activities = activities;

        res.status(200).json({list: list[0]});
    } catch (error) {
        console.log(error);
        next(new StatusError("Failed to get list", 500));
    }
}

export async function postList(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return next(new StatusError(JSON.stringify(result.array()), 400))
    }
    try {
        const list = await db
            .insert(ListTable)
            .values({title: req.body.title, lastModified: new Date()})
            .returning();


        // Create a list of ActivityTemplateList rows to insert from list.id from above and activityTemplate from input
        const activityList: typeof ActivityTemplateListTable.$inferInsert[] = []
        req.body.activities.forEach((v: any, i: number) => {
            activityList[i] = {activityTemplate: v, list: list[0].id};
        });

        const activities = await db.insert(ActivityTemplateListTable).values(activityList).returning();

        activities.forEach((v, i, arr) => {
            // @ts-ignore
            arr[i] = v.activityTemplate;
        })

        // @ts-ignore
        list[0].activities = activities;

        res.status(201).json({ list: list[0] });
    } catch (error) {
        console.log(error);
        next(new StatusError("Failed to post list", 500));
    }
}

export async function putList(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return next(new StatusError(JSON.stringify(result.array()), 400))
    }
    try {
        let list : typeof ListTable.$inferSelect[];
        // edit title or not
        // if (req.body.title) {
            list = await db
                .update(ListTable)
                .set({title: req.body.title, lastModified: new Date()})
                .where(eq(ListTable.id, +req.params.id))
                .returning();
        // } else {
        //     list = await db
        //         .select()
        //         .from(ListTable)
        //         .where(eq(ListTable.id, +req.params.id));
        // }

        if (req.body.activities) {
            // Remove all items from the many-to-many table to completely
            await db
                .delete(ActivityTemplateListTable)
                .where(eq(ActivityTemplateListTable.list, +req.params.id))


            // Create a list of ActivityTemplateList rows to insert from list.id from above and activityTemplate from input
            const activityList: typeof ActivityTemplateListTable.$inferInsert[] = []
            req.body.activities.forEach((v: any, i: number) => {
                activityList[i] = {activityTemplate: v, list: +req.params.id};
            });

            const activities = await db.insert(ActivityTemplateListTable).values(activityList).returning();

            activities.forEach((v, i, arr) => {
                // @ts-ignore
                arr[i] = v.activityTemplate;
            })

            // @ts-ignore
            list[0].activities = activities;

            console.log(JSON.stringify(activities));
        } else {
            // @ts-ignore
            list[0].activities = []
        }

        res.status(201).json({ list: list[0] });
    } catch (error) {
        next(new StatusError("Failed to put list", 500));
    }
}

export async function deleteList(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return next(new StatusError(JSON.stringify(result.array()), 400))
    }
    try {
        const list = await db
            .delete(ListTable)
            .where(eq(ListTable.id, +req.params.id))
            .returning({
                deletedListId: ListTable.id
            });

        res.status(200).json({ list });
    } catch (error) {
        next(new StatusError("Failed to delete list", 500));
    }
}