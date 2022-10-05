# Intensio (Frontend)

A productivity web application written in Vue. The application is still in development.

#### Features

* Todo list / Notes
* Calendar
* Kanban board
* Fitness Tracker

Note: Not all the listed features are (fully) implemented.
Check the [backlog](./BACKLOG.md) for a fully featured list of currently available or planned features.

### Todo list / Task Tracker

The application contains a todo list
and the created tasks interact with many other parts of the application like the calendar.

Tasks can additionally contain attached text - also called a note - encoded in markdown (markdown not yet implemented).
A start and end date may also be added to a task, and if so, it is displayed in the app's calendar.

### Calendar

Calendar tasks (or events) can be intuitively created, resized and moved by dragging them and their attached task will
update the start and end date automatically.

It is possible to shrink or extend the number of days shown in the calendar.
The main driver behind this feature is that I don't like the Google calendar week view, that starts showing when you
want to display more than seven days.

### Designs

It is possible to change between different app design in the settings panel.

## Project setup

Parallel to this project, the backend server is being developed in Express.js. The repository can be found
[here](https://github.com/Smail/notion-backend).
However, the frontend application, i.e., this repository/project, can be run in demo mode, which runs locally on the
client by emulating (server) requests through the browser's local storage.
For more information on the demo mode check the #Demo Mode section

```
yarn install
```

### Environment variables

* `VUE_APP_API_ENDPOINT`: URL to server (required if not in demo mode)
* `VUE_APP_IS_DEMO`: Flag to activate the demo/local storage mode (optional, defaults to `false`)

### Compiles and hot-reloads for development

```
yarn start
```

### Compiles and minifies for production

```
yarn build
```

### Demo Mode

This project can be run in demo mode, which runs locally on the client by emulating the server through the browser's local storage.
Set the environment variable `VUE_APP_IS_DEMO` to `true` (for example in `.env.local`) to activate the demo/local
storage mode.

Start by creating a new user in the »Sign Up« section.
Password checks are omitted during demo mode, 
hence, after creating the user, you can simply log in with a random password and your entered username.
If you create a new account, all data of the previous account are lost.
