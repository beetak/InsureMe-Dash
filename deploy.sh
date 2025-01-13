    echo "Swithing to branch main"
    git checkout main

    echo "Building app..."
    yarn run build

    echo "Deploying files to server..."
    scp -r -P 15703 build/* bmasiya@172.27.34.81:/var/www/172.27.34.81:15703

    echo "Done!"