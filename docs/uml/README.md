# Database Design
## Functional Requirements
- Keeps track of **Parents**, **Coaches** and **Admins**
- Keeps track of a Coaches **Teams**
- Keeps track of **Sessions**, and their **Activities**
- Stores **Activity Templates** so duplicate activities can be used in later sessions
- Keeps track of web app **customisation** done for a Team

## Entities
- Parent, Coach, Admin -> User + Role
- Team
- Session
- Activity
- Customisation
- Activity_Template

## Relations and Cardinality
### User - Role
`0-* - 1-*`
### Justification
- A Role might have no users, but can have up to all users.
- A User must have a role.
- A User might want to be a parent for one team and a coach for another, or be the admin and a coach, etc.