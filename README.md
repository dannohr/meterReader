# meterReader

# Data Migrations

sequelize db:migrate --config config/sequelizeConfig.js

sequelize db:migrate:undo --config config/sequelizeConfig.js
sequelize db:migrate:undo:all --config config/sequelizeConfig.js

# Seed Tables

seed:generate --name pick-any-name

sequelize db:seed:all --config config/sequelizeConfig.js

sequelize db:seed:undo
sequelize db:seed:undo:all --config config/sequelizeConfig.js

# Making a major change

Creating a Topical Branch
First, we will need to create a branch from the latest commit on master. Make sure your repository is up to date first using

git pull origin master
Note: git pull does a git fetch followed by a git merge to update the local repo with the remote repo. For a more detailed explanation, see this stackoverflow post.

To create a branch, use git checkout -b <new-branch-name> [<base-branch-name>], where base-branch-name is optional and defaults to master. I'm going to create a new branch called pull-request-demo from the master branch and push it to github.

git checkout -b pull-request-demo
git push origin pull-request-demo
Creating a Pull Request
To create a pull request, you must have changes committed to the your new branch.

Go to the repository page on github. And click on "Pull Request" button in the repo header.
