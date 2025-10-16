
classDiagram


class alpine{
            -instance: alpine$
-globalAlpine: Alpine
            +getInstance() alpine$
+getGlobalAlpine() Alpine
        }
alpine  --  alpine
class oidc{
            -instance: oidc$
-userManager: UserManager
            +getInstance() oidc$
+getUserManager() UserManager
+initOidcFlow() Promise~void~
        }
oidc  --  oidc
class auth{
            +userProfilePic: string | undefined
+givenName: string | undefined
+userEmail: string | undefined
            
        }
class router{
            +defaultPage: string
+currentPage: string
            
        }
class GraphQLPlayer {
            <<interface>>
            +id: number
+name: string
+lastModified: string
            
        }
class GraphQLTeam {
            <<interface>>
            +id: number
+name: string
+description: string
+lastModified: string
+player: GraphQLPlayer[]
            
        }
class GraphQLActivity {
            <<interface>>
            +id: number
+name: string
+duration: number
+description: string
+imgUrl: string
+lastModified: string
            
        }
class GraphQLListQuery {
            <<interface>>
            +id: number
+name: string
+listToActivityTemplate?: listToActivityTemplate
+accentColor?: string
+lastModified: string
            
        }
class GraphQLListPost {
            <<interface>>
            +id: number
+name: string
+listToActivityTemplate?: #123; id: number; #125;[]
+accentColor?: string
+lastModified?: string
            
        }
class Auth {
            <<interface>>
            +user: User
+userManage: UserManager
            
        }
class PagesStore {
            <<interface>>
            +activities: #123; activitiesList: Activity[]; activitiesListsList: ActivitiesList[]; #125;
+teams: #123; teamsList: Team[]; #125;
+scheduling: #123; sessionName: ""; sessionDate: ""; sessionNotes: ""; sessionActivities: Activity[]; selectedTeam: null; upcomingSessions: Session[]; previousSessions: Session[]; selectedTab: "lists"; expandedSessions: Session[]; #125;
            
        }
class Activity {
            <<interface>>
            +id: string
+name: string
+duration: string
+description: string
+img_url: string
+lastModified?: Date
            
        }
class ActivitiesList {
            <<interface>>
            +id: string
+name: string
+activities: string[]
+accent_color: string
+lastModified?: Date
            
        }
class ActivitiesListAccentColors {
            <<interface>>
            +name: string
+hex: string
            
        }
class Team {
            <<interface>>
            +id: string
+name: string
+description: string
+players: string[]
            
        }
class Session {
            <<interface>>
            +id: string
+name: string
+date: string
+notes: string
+activities: SessionActivity[]
+team?: string
+attendance?: #123; [key: string]: boolean; #125;
            
        }
class SessionActivity {
            <<interface>>
            +isSessionCopy?: boolean
+originalTemplateId?: string
            
        }
class ToastNotification {
            <<interface>>
            +id: number | undefined
+title: string
+message: string
+variant: "info" | "danger"
            
        }
Activity<|..SessionActivity
class urql{
            -instance: urql$
-urqlClient: Client | undefined
            +getInstance() Promise~urql~$
+getUrqlClient() Client
        }
urql  --  urql
class toast{
            +notifications: ToastNotification[]
+displayDuration: number
            +addNotification() void
+removeNotification() void
        }
class activities{
            +activitiesListsList: ActivitiesList[]
+activitiesList: Activity[]
+activitiesListAccentColors: ActivitiesListAccentColors[]
-selectedList: string
-selectedActivity: string
-rightPanelState: "placeholder" | "edit_activity" | "manage_lists"
-manageListsSelectedList: string
            +onListSwitch() void
+onActivitySelection() void
+onContainingListsUpdate() void
+onSaveChanges() void
+onResetChanges() void
+onDeleteActivity() void
+onManageLists() void
+onManageListsListSwitch() void
+onManageListsSaveChanges() void
+onCreateNewList() void
+onDeleteList() void
+saveActivity() void
+createActivity() void
        }
class scheduling{
            +sessionName: string
+sessionDate: string
+sessionNotes: string
+sessionActivities: SessionActivity[]
+selectedTeam: string | null
+upcomingSessions: Session[]
+previousSessions: Session[]
+selectedTab: "lists" | "last" | "history"
+expandedSessions: #123; [key: string]: boolean; #125;
-activitiesList: Activity[]
-teamsList: Team[]
            +addToSession() void
+removeFromSession() void
+handleDragStart() void
+handleDragOver() void
+handleDrop() void
+switchTab() void
+toggleSessionDetails() void
+loadSession() void
+saveSession() void
+moveActivityUp() void
+moveActivityDown() void
+deleteSession() void
        }
class sessions{
            -upcomingSessions: Session[]
-previousSessions: Session[]
            +completeSession() void
+updateNotes() void
+toggleAttendance() void
        }
class teams{
            +teamsList: Team[]
+selectedTeam: string | null
+rightPanelState: "placeholder" | "edit_team"
            +createTeam() void
+onTeamSelection() void
+addPlayer() void
+updatePlayer() void
+removePlayer() void
+onSaveChanges() void
+onDeleteTeam() void
+onTeamSelectForSession() string | null
        }
class ActivitiesSync{
            -ACTIVITIES_LIST_QUERY: "\n    query getActivities #123;\n      activityTemplates {\n        id\n        name\n        duration\n        description\n        imgUrl\n        lastModified\n      #125;\n    }\n  "$
-DELETE_MUTATION: "\n    mutation deleteActivities($id: Int!) #123;\n      deleteFromActivityTemplates(where: { id: { eq: $id #125; }) {\n        id\n      }\n    }\n  "$
-POST_MUTATION: "\n    mutation insertActivities($activity: ActivityTemplatesInsertInput!) #123;\n      insertIntoActivityTemplatesSingle(values: $activity) {\n        id\n        name\n        duration\n        description\n        imgUrl\n        lastModified\n      #125;\n    }\n  "$
-PUT_MUTATION: "\n    mutation updateActivities(\n      $id: Int!\n      $activity: ActivityTemplatesUpdateInput!\n    ) #123;\n      updateActivityTemplates(where: { id: { eq: $id #125; }, set: $activity) {\n        id\n        name\n        duration\n        description\n        imgUrl\n        lastModified\n      }\n    }\n  "$
            -hhmmToMinutes() number$
-minutesToHHMM() string$
-convertGraphQLActivityToActivity() Activity[]$
-convertActivityToGraphQLActivity() GraphQLActivity$
+subscribeToActivitiesList() Promise~void~
+delete() Promise~void~
+post() Promise~void~
+put() Promise~void~
        }
class ActivitiesListsSync{
            -LISTS_LIST_QUERY: "\n    query getLists #123;\n      lists {\n        id\n        name\n        listToActivityTemplate {\n          id\n          activityTemplate {\n            id\n          #125;\n        }\n        accentColor\n        lastModified\n      }\n    }\n  "$
-DELETE_MUTATION: "\n    mutation deleteLists($id: Int!) #123;\n      deleteFromLists(where: { id: { eq: $id #125; }) {\n        id\n      }\n\n      deleteFromActivityTemplateList(where: { list: { eq: $id } }) {\n        id\n      }\n    }\n  "$
-POST_MUTATION: "\n    mutation insertLists($list: ListsInsertInput!) #123;\n      insertIntoListsSingle(values: $list) {\n        id\n        name\n        accentColor\n        lastModified\n      #125;\n    }\n  "$
-PUT_MUTATION: "\n    mutation updateLists(\n      $id: Int!\n      $list: ListsUpdateInput!\n      $activities: [ActivityTemplateListInsertInput!]!\n    ) #123;\n      updateLists(where: { id: { eq: $id #125; }, set: $list) {\n        id\n        name\n        accentColor\n        lastModified\n      }\n      deleteFromActivityTemplateLi...$
-PUT_NO_ACTIVITIES_MUTATION: "\n    mutation updateLists($id: Int!, $list: ListsUpdateInput!) #123;\n      updateLists(where: { id: { eq: $id #125; }, set: $list) {\n        id\n        name\n        accentColor\n        lastModified\n      }\n    }\n  "$
            -convertGraphQLListToList() ActivitiesList[]$
-convertListToGraphQLList() GraphQLListPost$
+subscribeToActivitiesListsList() Promise~void~
+delete() Promise~void~
+post() Promise~void~
+put() Promise~void~
        }
class Sync{
            +activities: #123; activity: ActivitiesSync; list: ActivitiesListsSync; #125;$
+teams: TeamsSync$
            +subscribeToStateLists() Promise~void~$
        }
Sync  --  TeamsSync
class TeamsSync{
            -TEAMS_LIST_QUERY: "\n    query getTeams #123;\n      teams {\n        id\n        name\n        description\n        lastModified\n        player {\n          id\n          name\n          lastModified\n        #125;\n      }\n    }\n  "$
-DELETE_MUTATION: "\n    mutation deleteTeam($id: Int!) #123;\n      deleteFromTeams(where: { id: { eq: $id #125; }) {\n        id\n      }\n    }\n  "$
-POST_MUTATION: "\n    mutation insertTeam($team: TeamsInsertInput!) #123;\n      insertIntoTeamsSingle(values: $team) {\n        id\n      #125;\n    }\n  "$
-PUT_MUTATION: "\n    mutation updateTeam(\n      $id: Int!\n      $team: TeamsUpdateInput!\n      $players: [PlayersInsertInput!]!\n    ) #123;\n      updateTeams(set: $team, where: { id: { eq: $id #125; }) {\n        id\n        name\n        description\n        lastModified\n      }\n\n      deleteFromPlayers(where: { team: { eq: $id ...$
-PUT_NO_PLAYERS_MUTATION: "\n    mutation updateTeam($id: Int!, $team: TeamsUpdateInput!) #123;\n      updateTeams(set: $team, where: { id: { eq: $id #125; }) {\n        id\n        name\n        description\n        lastModified\n      }\n\n      deleteFromPlayers(where: { team: { eq: $id } }) {\n        id\n      }\n    }\n  "$
            -convertGraphQLTeamToTeam() Team[]$
+subscribeToTeamsList() Promise~void~
+delete() Promise~void~
+post() Promise~void~
+put() Promise~void~
        }