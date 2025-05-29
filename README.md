# CARA (Child and Assistant Resource Assignment)

## Important notes about development

I will note important things.

We are working with docker, so all links, are relative to local machines, but when it will be in production
and someone will call this website with a domain, `http://localhost` will mean a different thing. It will
mean localhost of a users machine, so it will be dead wrong.

This is the reason why WE MUST work with frontend like that:

```
# activate local dev
npm run dev
```

And when we will push it to production we will have to add Nginx proxy, which will THE ONLY entry point to our Docker network. Please pay attention and try to understand that. Each api call should be in a form like:

```
fetch('/api/service') -> this is wright

fetch('http://localhost:8080') -> this is WRONG, please don't do that.
```

## Planning

Milestones:

- first presentation 22.05.2025
- last presentation 03.07.2025 or 26.06.2025, depends on us
- Report 28.08.2205

Our milestones:

- 04.05.2025 first model, should not be optimal
- 8.05.2025 minimal frontend wich outputs model results
- 15.05.2025 DB from excel tables, Frontend with iput Forms for Children and Assitents. Also fine tuned model
- 22.05.2025 Dashboards about capacity of phenix. (How many children, how many assitents, how many hours total and so on)
- 29.05.2025 Bug fixes and fine tuning.
- 05.06.2025 Production ready. (installed proxy for communicating with docekr network)
- 12.06.2025 fully tested and documented for future installation in phenix

# Requierments

1. CRUD Operations on children and assitents

   - Add new child / assitent
   - delete child / assitent
   - update child / assitent

2. Dashboard / Overview

   - Capacity, how many hours are free, how many assitents are free and so on
   - list of children and assitents, who is working with whom

3. Creating a new paln

   - select children and assitents, who need a pair (because some assitents want to continue work with the same child)
   - set up soft constraints, such as 'time to destination' as range in mins and more if there are

4. Working with "non assigned"

   - after a new plan is created, create a list with children and assitents who don't have a pair
   - add to pool new requests from children and new apllications from assistants
   - use model to find "new possible" pairs

5. Working with edge cases

   - handling "unusual" working days
   - handling "working pairs", two assitents work with one child, changing in defined period of times
   - qualification missmatch, but it assitent can still work with a child (FK with QHK)
   - and citation, because I did not understand the meaning "Begleiter:innen, die als Übungsleiter:innen tätig sind, sind im Moment als Vertretung eingeplant und bekommen kein festes Kind!"

6. Data migration. Phenix already has children in care, so this pairs should be imported in the app.
   - Migration tool from csv, for existing pairs

# Goal

As requested the goal is to get as many pairs as possible with the best possible conditions for every child and assitent

## Look into problem

We have defined this problem as a maximization problem.
