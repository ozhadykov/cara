# Phenix Project Dockerized

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
