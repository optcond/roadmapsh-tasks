# roadmapsh-tasks

An implementation of the https://roadmap.sh/projects/task-tracker

## Utility
The user can:
* Add, Update, and Delete tasks
* Mark a task as in progress or done
* List all tasks
* List all tasks that are done
* List all tasks that are not done
* List all tasks that are in progress

## Skills battle tested
* Github readme
* unit & integration tests
* Container for dependency injection (as a concept)
* Router, Action and Response generator for logic separation

## Installation
```
yarn build
```
## Usage
```
yarn task-cli [command]
# commands:
task-cli add [description]
task-cli update [id] [description]
task-cli delete [id]
task-cli mark-in-progress [id]
task-cli mark-done [id]
task-cli list
task-cli list done
task-cli list todo
task-cli list in-progress
```
## Examples
```
# Adding a new task
task-cli add "Buy groceries"
```
```
# Updating and deleting tasks
task-cli update 1 "Buy groceries and cook dinner"
task-cli delete 1
```
```
# Marking a task as in progress or done
task-cli mark-in-progress 1
task-cli mark-done 1
```
```
# Listing all tasks
task-cli list
```
```
# Listing tasks by status
task-cli list done
task-cli list todo
task-cli list in-progress
```
## Additional information
```
yarn clear-storage
```
remove default storage file
```
yarn test
```
unit & integration tests
