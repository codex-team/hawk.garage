### FOR PRODUCTION USE ONLY ###

# Pull latest changes
git pull

# Update packages and build new Garage version
yarn && yarn build

# Remove current Garage build from /var/www/html (nginx root)
rm -rf /var/www/html/

# Copy new build to /var/www/html
cp -r ./dist/ /var/www/html/
