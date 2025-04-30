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
