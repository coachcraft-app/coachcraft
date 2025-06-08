import { Request, Response, NextFunction } from 'express';
import {db} from "../db/db.js";
import {ActivityTemplateListTable, ActivityTemplatesTable, ListTable} from "../db/schema.js";
import {StatusError} from "../lib/status-error.js";
import {validationResult} from "express-validator";
import {eq, max} from "drizzle-orm";

export async function getAllLists(req: Request, res: Response, next: NextFunction) {
    try {
        const lastModified = await db.select({value: max(ListTable.lastModified)}).from(ListTable);
        if (lastModified[0].value) {
            res.append("Last-Modified", lastModified[0].value.toUTCString());
        }

        const lists = await db.select().from(ListTable);

        for (const list of lists) {
            const activityList = db
                .select()
                .from(ActivityTemplateListTable)
                .where(eq(ActivityTemplateListTable.list, list.id))
                .as("activity_list");

            const activities = await db
                .select({id: ActivityTemplatesTable.id})
                .from(ActivityTemplatesTable)
                .innerJoin(activityList, eq(activityList.activityTemplate, ActivityTemplatesTable.id))


            // @ts-ignore
            list.activities = [];

            for (const activity of activities) {
                // @ts-ignore
                list.activities.push(activity.id);
            }
        }

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

        res.append("Last-Modified", list[0].lastModified.toUTCString());

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
        console.error(error);
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
            .values({name: req.body.name, lastModified: new Date(), accentColor: req.body.accentColor})
            .returning();


        // Create a list of ActivityTemplateList rows to insert from list.id from above and activityTemplate from input
        const activityList: typeof ActivityTemplateListTable.$inferInsert[] = []
        req.body.activities.forEach((v: any, i: number) => {
            activityList[i] = {activityTemplate: v, list: list[0].id};
        });

        if (activityList.length > 0) {
            const activities = await db.insert(ActivityTemplateListTable).values(activityList).returning();


            activities.forEach((v, i, arr) => {
                // @ts-ignore
                arr[i] = v.activityTemplate;
            })

            // @ts-ignore
            list[0].activities = activities;
        } else {
            //@ts-ignore
            list[0].activities = []
        }

        res.status(201).json({ list: list[0] });
    } catch (error) {
        console.error(error);
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
        list = await db
            .update(ListTable)
            .set({name: req.body.name, lastModified: new Date(), accentColor: req.body.accentColor})
            .where(eq(ListTable.id, +req.params.id))
            .returning();


        // Remove all items from the many-to-many table to completely
        await db
            .delete(ActivityTemplateListTable)
            .where(eq(ActivityTemplateListTable.list, +req.params.id))

        if (req.body.activities && req.body.activities.length !== 0) {
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