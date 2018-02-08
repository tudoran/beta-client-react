# Signle Page Web Application - React / Redux

## Setup

1. `cd frontend && npm install`
2. `cp config/_development.example.js config/_development.js` and enter `API_URL`.
3. `npm start`
4. <http://localhost:3000>

## Nginx configuration

```
server {
    listen 9000;
    server_name localhost;

    location ~ ^/(client) {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   X-NginX-Proxy    true;
        proxy_set_header   Host             $http_host;
        proxy_set_header   Upgrade          $http_upgrade;
        proxy_redirect     off;
    }

    location / {
        proxy_pass          http://localhost:8000;
        proxy_redirect off;
        proxy_buffering off;
        proxy_pass_header Set-Cookie;
        proxy_pass_header P3P;
        proxy_cookie_domain $host localhost;
        proxy_set_header Host $host:$server_port;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Fowarded-Host $host;
        proxy_cache         off;
        proxy_http_version 1.1;
    }
}
```

## Deploy

1. `npm run compile`

## Stack

1. Based on [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit).
2. [React](https://facebook.github.io/react/)
3. [Redux](https://github.com/reactjs/redux)
4. [Ramda](http://ramdajs.com/0.21.0/index.html)
5. [React Router](https://github.com/reactjs/react-router)
6. [Bootstrap](https://react-bootstrap.github.io/)
7. [D3.js](https://d3js.org/) and [NVD3](http://nvd3.org/)
8. [webpack](https://webpack.github.io/)

## Guidelines (draft)

1. Use Ramda to write re-usable pure functions. If a function is too large, break it down to small composable functions.
2. Never use `state` in React components. Components should be stateless. Write a proper `shouldComponentUpdate` using `propsChanged` helper function.
3. Immutable data everywhere. Use `const` for all definitions; avoid using `var` and `let`.
4. Avoid defining class methods, write external functions instead using Ramda (with proper documentation). See existing code for examples.
5. Use `isRequired` in `propTypes` for props that **should** be present.
6. Use [react-bootstrap](https://react-bootstrap.github.io/) components instead of raw HTML tags with Boostrap classes.
7. No `id` attributes.
8. No inline CSS.
9. Use camelCase when naming CSS classes. Combine multiple classes with [classNames](https://github.com/JedWatson/classnames).
10. No nesting of CSS rules, unless you have to use a global selector. Use a separate className-rule instead.
11. No CSS rules duplication. If a certain group of rules is used in multiple places, extract into a SASS mixin, or write a separate component that encapsulates the styling, and re-use it where needed.
12. Avoid the use of `:global` selectors as much as possible.
13. `import`'s are listed as follows: first the imports from external packages, then the imports from within the app. Each group of imports is listed alphabetically. Use for example [this package](https://atom.io/packages/sort-lines) to automatically sort rows.
14. ESLint your code before merging and make sure there are no lint errors or warnings.
15. Keep lines length under 100 chars.
16. Install [trailing-spaces](https://atom.io/packages/trailing-spaces) or a similar package to remove any trailing spaces upon file save.

## Git guidelines

**Step 1**: Assuming you are working on BU-99, create a new branch:

```
git checkout master
git checkout -b BU-99
```

**Step 2**: Make your changes and, ideally, squash all your commits into a single commit. Assuming you made 5 commits:

```
git rebase -i HEAD~5
```

Follow the guide to squash your commits into a single commit. If needed, enter a multi-line commit message, for example:

```
Add Create-Goal modal - BU-99
* Use react-modal
* Use /settings/goal-types API endpoint
* Add <Spinner /> for indicating pending request
* Fully tested
```

**Step 3**: Finally to merge your branch back to master and push to remote, do the following:

```
git checkout master
git pull origin master
git checkout BU-99
git rebase master
git checkout master
git merge --no-ff BU-99
git push origin master
```

## Common Issues

- If you get this error on `npm start` or `npm run test`:

```
[Error: ENOENT: no such file or directory, open '.env']
errno: -2, code: 'ENOENT', syscall: 'open', path: '.env'
```

make sure you have an `.env` file in the project root dir.
